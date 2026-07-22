
-- ============ SPOTIFY TOKENS ============
CREATE TABLE public.spotify_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spotify_tokens TO authenticated;
GRANT ALL ON public.spotify_tokens TO service_role;
ALTER TABLE public.spotify_tokens ENABLE ROW LEVEL SECURITY;
CREATE POLICY "spotify_tokens_select_own" ON public.spotify_tokens FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "spotify_tokens_insert_own" ON public.spotify_tokens FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spotify_tokens_update_own" ON public.spotify_tokens FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "spotify_tokens_delete_own" ON public.spotify_tokens FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ============ SPOTIFY PLAYLISTS (Showcase) ============
CREATE TABLE public.spotify_playlists (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  track_count INT NOT NULL DEFAULT 0,
  spotify_url TEXT NOT NULL,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX spotify_playlists_user_idx ON public.spotify_playlists(user_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.spotify_playlists TO authenticated;
GRANT ALL ON public.spotify_playlists TO service_role;
ALTER TABLE public.spotify_playlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "playlists_select_all" ON public.spotify_playlists FOR SELECT TO authenticated USING (true);
CREATE POLICY "playlists_insert_own" ON public.spotify_playlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playlists_update_own" ON public.spotify_playlists FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "playlists_delete_own" ON public.spotify_playlists FOR DELETE TO authenticated USING (auth.uid() = user_id);
