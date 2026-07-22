import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const SPOTIFY_ACCOUNTS = "https://accounts.spotify.com/api";
const SPOTIFY_API = "https://api.spotify.com/v1";

async function getValidAccessToken(
  userId: string,
  supabase: any,
): Promise<string> {
  const { data: token } = await supabase
    .from("spotify_tokens")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (!token) throw new Error("Spotify not connected");

  const now = new Date();
  const expiresAt = new Date(token.expires_at);

  if (expiresAt > now) return token.access_token;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!clientId || !clientSecret) throw new Error("Spotify credentials not configured");

  const res = await fetch(`${SPOTIFY_ACCOUNTS}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: token.refresh_token,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Spotify token refresh failed: ${err}`);
  }

  const body = await res.json();
  const newExpiresAt = new Date(Date.now() + body.expires_in * 1000).toISOString();
  const newAccessToken = body.access_token;
  const newRefreshToken = body.refresh_token ?? token.refresh_token;

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("spotify_tokens").upsert(
    {
      user_id: userId,
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
      expires_at: newExpiresAt,
    },
    { onConflict: "user_id" },
  );

  return newAccessToken;
}

export const exchangeSpotifyCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ code: z.string() }).parse(d))
  .handler(async ({ data, context }) => {
    const { userId } = context;
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Spotify credentials not configured");
    }

    const res = await fetch(`${SPOTIFY_ACCOUNTS}/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: data.code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Spotify token exchange failed: ${err}`);
    }

    const body = await res.json();
    const expiresAt = new Date(Date.now() + body.expires_in * 1000).toISOString();

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("spotify_tokens").upsert(
      {
        user_id: userId,
        access_token: body.access_token,
        refresh_token: body.refresh_token,
        expires_at: expiresAt,
      },
      { onConflict: "user_id" },
    );

    return { success: true };
  });

export const getSpotifyStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data } = await supabase
      .from("spotify_tokens")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle();
    return { connected: !!data };
  });

export const getSpotifyToken = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const token = await getValidAccessToken(userId, supabase);
    return { access_token: token };
  });

export const fetchMyPlaylists = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const token = await getValidAccessToken(userId, supabase);
    const res = await fetch(`${SPOTIFY_API}/me/playlists?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to fetch playlists: ${err}`);
    }
    const body = await res.json();
    return (body.items ?? []).map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image_url: p.images?.[0]?.url ?? null,
      track_count: p.tracks?.total ?? 0,
      spotify_url: p.external_urls?.spotify ?? "",
      owner: p.owner?.display_name ?? "",
    }));
  });

export const syncMyPlaylists = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const token = await getValidAccessToken(userId, supabase);
    const res = await fetch(`${SPOTIFY_API}/me/playlists?limit=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to fetch playlists: ${err}`);
    }
    const body = await res.json();
    const items = body.items ?? [];

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    await supabaseAdmin.from("spotify_playlists").delete().eq("user_id", userId);

    if (items.length > 0) {
      const rows = items.map((p: any) => ({
        id: p.id,
        user_id: userId,
        name: p.name,
        description: p.description ?? null,
        image_url: p.images?.[0]?.url ?? null,
        track_count: p.tracks?.total ?? 0,
        spotify_url: p.external_urls?.spotify ?? "",
      }));
      await supabaseAdmin.from("spotify_playlists").insert(rows);
    }

    return { synced: items.length };
  });

export const getShowcasePlaylists = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data } = await supabase
      .from("spotify_playlists")
      .select("*, profiles!inner(username)")
      .order("synced_at", { ascending: false });
    return data ?? [];
  });

const searchInput = z.object({ query: z.string().min(1).max(100) });

export const searchSpotifyTracks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => searchInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const token = await getValidAccessToken(userId, supabase);
    const res = await fetch(
      `${SPOTIFY_API}/search?q=${encodeURIComponent(data.query)}&type=track&limit=20`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Search failed: ${err}`);
    }
    const body = await res.json();
    return (body.tracks?.items ?? []).map((t: any) => ({
      id: t.id,
      name: t.name,
      artists: t.artists?.map((a: any) => a.name) ?? [],
      album: { name: t.album?.name, image_url: t.album?.images?.[0]?.url ?? null },
      duration_ms: t.duration_ms,
      uri: t.uri,
      preview_url: t.preview_url,
    }));
  });

const playlistTracksInput = z.object({ playlistId: z.string() });

export const getPlaylistTracks = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => playlistTracksInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const token = await getValidAccessToken(userId, supabase);
    const res = await fetch(`${SPOTIFY_API}/playlists/${data.playlistId}/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to fetch playlist tracks: ${err}`);
    }
    const body = await res.json();
    return (body.items ?? [])
      .filter((item: any) => item.track)
      .map((item: any) => {
        const t = item.track;
        return {
          id: t.id,
          name: t.name,
          artists: t.artists?.map((a: any) => a.name) ?? [],
          album: { name: t.album?.name, image_url: t.album?.images?.[0]?.url ?? null },
          duration_ms: t.duration_ms,
          uri: t.uri,
          preview_url: t.preview_url,
        };
      });
  });
