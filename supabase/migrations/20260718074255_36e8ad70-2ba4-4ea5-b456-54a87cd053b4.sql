
DROP FUNCTION IF EXISTS public.leaderboard_for(text, date);

CREATE OR REPLACE FUNCTION public.leaderboard_for(occ text, week date)
RETURNS TABLE (user_id uuid, username text, total_score bigint, rank int)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.user_id, p.username, SUM(s.score)::bigint,
         ROW_NUMBER() OVER (ORDER BY SUM(s.score) DESC, MIN(s.created_at) ASC)::int
  FROM public.daily_scores s
  JOIN public.profiles p ON p.id = s.user_id
  WHERE s.occupation = occ AND s.week_start = week
  GROUP BY s.user_id, p.username
  ORDER BY 3 DESC
  LIMIT 100;
$$;
GRANT EXECUTE ON FUNCTION public.leaderboard_for(text, date) TO authenticated;

CREATE OR REPLACE FUNCTION public.purchase_item(item uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_cost int; v_uid uuid := auth.uid(); v_points int;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'not authenticated'; END IF;
  SELECT cost INTO v_cost FROM public.shop_items WHERE id = item;
  IF v_cost IS NULL THEN RAISE EXCEPTION 'item not found'; END IF;
  IF EXISTS (SELECT 1 FROM public.user_inventory WHERE user_id = v_uid AND item_id = item) THEN
    RAISE EXCEPTION 'already owned';
  END IF;
  SELECT wallet_points INTO v_points FROM public.profiles WHERE id = v_uid FOR UPDATE;
  IF v_points < v_cost THEN RAISE EXCEPTION 'not enough points'; END IF;
  UPDATE public.profiles SET wallet_points = wallet_points - v_cost WHERE id = v_uid;
  INSERT INTO public.user_inventory (user_id, item_id) VALUES (v_uid, item);
END;
$$;
GRANT EXECUTE ON FUNCTION public.purchase_item(uuid) TO authenticated;

ALTER TABLE public.shop_items ALTER COLUMN id SET DEFAULT gen_random_uuid();

INSERT INTO public.shop_items (id, kind, name, description, cost, asset_key) VALUES
  (gen_random_uuid(), 'font', 'Press Start', 'Default 8-bit arcade font', 0, 'display'),
  (gen_random_uuid(), 'font', 'VT323 Terminal', 'Chunky monospace terminal', 100, 'body'),
  (gen_random_uuid(), 'font', 'Silkscreen', 'Compact pixel headline', 250, 'silk'),
  (gen_random_uuid(), 'font', 'Pixelify Sans', 'Rounded pixel modern', 400, 'pixelify'),
  (gen_random_uuid(), 'wallpaper', 'Teal Grid', 'Cool circuit grid', 0, 'grid-teal'),
  (gen_random_uuid(), 'wallpaper', 'Purple Grid', 'Deep space grid', 150, 'grid-purple'),
  (gen_random_uuid(), 'wallpaper', 'Sunset', 'Warm gradient dusk', 300, 'sunset'),
  (gen_random_uuid(), 'wallpaper', 'Forest', 'Green pixel woods', 300, 'forest');

DO $$ BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END;
END $$;
