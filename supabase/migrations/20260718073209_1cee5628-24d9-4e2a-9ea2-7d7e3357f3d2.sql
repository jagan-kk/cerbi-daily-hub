
-- ============ PROFILES ============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE,
  occupation TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  wallet_points INTEGER NOT NULL DEFAULT 0,
  weekly_points INTEGER NOT NULL DEFAULT 0,
  active_font TEXT NOT NULL DEFAULT 'press-start',
  active_wallpaper TEXT NOT NULL DEFAULT 'grid-teal',
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all_auth" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  base_name TEXT;
  final_name TEXT;
  suffix INT := 0;
BEGIN
  base_name := COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1), 'player');
  base_name := regexp_replace(base_name, '[^a-zA-Z0-9_]', '', 'g');
  IF length(base_name) < 3 THEN base_name := 'player' || substr(NEW.id::text, 1, 6); END IF;
  final_name := base_name;
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_name) LOOP
    suffix := suffix + 1;
    final_name := base_name || suffix::text;
  END LOOP;
  INSERT INTO public.profiles (id, username) VALUES (NEW.id, final_name);
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Generic updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;
CREATE TRIGGER profiles_touch BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ============ NEWS ============
CREATE TABLE public.news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_date DATE NOT NULL,
  topic TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT,
  image_url TEXT,
  source TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX news_articles_date_topic_idx ON public.news_articles(article_date, topic);
GRANT SELECT ON public.news_articles TO authenticated;
GRANT ALL ON public.news_articles TO service_role;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "news_read_auth" ON public.news_articles FOR SELECT TO authenticated USING (true);

-- ============ CHAT ============
CREATE TABLE public.chat_rooms (
  code TEXT PRIMARY KEY,
  name TEXT,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.chat_rooms TO authenticated;
GRANT ALL ON public.chat_rooms TO service_role;
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rooms_read_auth" ON public.chat_rooms FOR SELECT TO authenticated USING (true);
CREATE POLICY "rooms_insert_own" ON public.chat_rooms FOR INSERT TO authenticated WITH CHECK (auth.uid() = creator_id);

CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_code TEXT NOT NULL REFERENCES public.chat_rooms(code) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX chat_messages_room_created_idx ON public.chat_messages(room_code, created_at);
GRANT SELECT, INSERT ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "msg_read_auth" ON public.chat_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "msg_insert_own" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- ============ DAILY TRIAL ============
CREATE TABLE public.daily_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_date DATE NOT NULL,
  occupation TEXT NOT NULL,
  order_index INT NOT NULL,
  question TEXT NOT NULL,
  choices TEXT[] NOT NULL,
  correct_index INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (question_date, occupation, order_index)
);
GRANT SELECT ON public.daily_questions TO authenticated;
GRANT ALL ON public.daily_questions TO service_role;
ALTER TABLE public.daily_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "q_read_auth" ON public.daily_questions FOR SELECT TO authenticated USING (true);

CREATE TABLE public.daily_attempts (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  attempt_date DATE NOT NULL,
  score INT NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, attempt_date)
);
GRANT SELECT, INSERT, UPDATE ON public.daily_attempts TO authenticated;
GRANT ALL ON public.daily_attempts TO service_role;
ALTER TABLE public.daily_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attempts_read_own" ON public.daily_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "attempts_ins_own" ON public.daily_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "attempts_upd_own" ON public.daily_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.daily_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occupation TEXT NOT NULL,
  score INT NOT NULL,
  score_date DATE NOT NULL,
  week_start DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, score_date)
);
CREATE INDEX daily_scores_lb_idx ON public.daily_scores(occupation, week_start);
GRANT SELECT, INSERT ON public.daily_scores TO authenticated;
GRANT ALL ON public.daily_scores TO service_role;
ALTER TABLE public.daily_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scores_read_auth" ON public.daily_scores FOR SELECT TO authenticated USING (true);
CREATE POLICY "scores_ins_own" ON public.daily_scores FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Leaderboard RPC (aggregates by user for a given occupation & week)
CREATE OR REPLACE FUNCTION public.leaderboard_for(occ TEXT, week DATE)
RETURNS TABLE(user_id UUID, username TEXT, total_score BIGINT, rank BIGINT)
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT
    s.user_id,
    p.username,
    SUM(s.score)::bigint AS total_score,
    RANK() OVER (ORDER BY SUM(s.score) DESC) AS rank
  FROM public.daily_scores s
  JOIN public.profiles p ON p.id = s.user_id
  WHERE s.occupation = occ AND s.week_start = week
  GROUP BY s.user_id, p.username
  ORDER BY total_score DESC
  LIMIT 50;
$$;
GRANT EXECUTE ON FUNCTION public.leaderboard_for(TEXT, DATE) TO authenticated;

-- ============ SHOP ============
CREATE TABLE public.shop_items (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  cost INT NOT NULL,
  asset_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.shop_items TO authenticated;
GRANT ALL ON public.shop_items TO service_role;
ALTER TABLE public.shop_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "shop_read_auth" ON public.shop_items FOR SELECT TO authenticated USING (true);

CREATE TABLE public.user_inventory (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES public.shop_items(id) ON DELETE CASCADE,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, item_id)
);
GRANT SELECT, INSERT ON public.user_inventory TO authenticated;
GRANT ALL ON public.user_inventory TO service_role;
ALTER TABLE public.user_inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inv_read_own" ON public.user_inventory FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "inv_ins_own" ON public.user_inventory FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Purchase RPC: atomic
CREATE OR REPLACE FUNCTION public.purchase_item(item TEXT)
RETURNS TABLE(new_balance INT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid UUID := auth.uid();
  item_cost INT;
  bal INT;
BEGIN
  IF uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  SELECT cost INTO item_cost FROM public.shop_items WHERE id = item;
  IF item_cost IS NULL THEN RAISE EXCEPTION 'item_not_found'; END IF;
  IF EXISTS (SELECT 1 FROM public.user_inventory WHERE user_id = uid AND item_id = item) THEN
    RAISE EXCEPTION 'already_owned';
  END IF;
  UPDATE public.profiles SET wallet_points = wallet_points - item_cost
    WHERE id = uid AND wallet_points >= item_cost
    RETURNING wallet_points INTO bal;
  IF bal IS NULL THEN RAISE EXCEPTION 'insufficient_points'; END IF;
  INSERT INTO public.user_inventory (user_id, item_id) VALUES (uid, item);
  RETURN QUERY SELECT bal;
END;
$$;
GRANT EXECUTE ON FUNCTION public.purchase_item(TEXT) TO authenticated;

-- ============ WEEKLY AWARDS ============
CREATE TABLE public.weekly_awards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  occupation TEXT NOT NULL,
  week_start DATE NOT NULL,
  rank INT NOT NULL,
  points_awarded INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, week_start, occupation)
);
GRANT SELECT ON public.weekly_awards TO authenticated;
GRANT ALL ON public.weekly_awards TO service_role;
ALTER TABLE public.weekly_awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "awards_read_auth" ON public.weekly_awards FOR SELECT TO authenticated USING (true);

-- ============ SEED SHOP ITEMS ============
INSERT INTO public.shop_items (id, kind, name, description, cost, asset_key) VALUES
  ('font-press-start', 'font', 'Press Start', 'Default pixel display font', 0, 'press-start'),
  ('font-vt323', 'font', 'VT323', 'Retro CRT terminal font', 50, 'vt323'),
  ('font-pixelify', 'font', 'Pixelify', 'Rounded pixel serif font', 120, 'pixelify'),
  ('font-silkscreen', 'font', 'Silkscreen', 'Compact bitmap sans', 150, 'silkscreen'),
  ('wp-grid-teal', 'wallpaper', 'Teal Grid', 'Classic teal desktop grid', 0, 'grid-teal'),
  ('wp-grid-purple', 'wallpaper', 'Neon Grid', 'Neon purple synth grid', 80, 'grid-purple'),
  ('wp-stars', 'wallpaper', 'Starfield', 'Retro starfield background', 120, 'stars'),
  ('wp-dungeon', 'wallpaper', 'Dungeon Stone', 'RPG dungeon tile floor', 200, 'dungeon'),
  ('wp-sunset', 'wallpaper', 'Synth Sunset', 'Vaporwave sunset gradient', 250, 'sunset');
