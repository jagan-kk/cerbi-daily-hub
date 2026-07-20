
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.leaderboard_for(TEXT, DATE) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.purchase_item(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.leaderboard_for(TEXT, DATE) TO authenticated;
GRANT EXECUTE ON FUNCTION public.purchase_item(TEXT) TO authenticated;
