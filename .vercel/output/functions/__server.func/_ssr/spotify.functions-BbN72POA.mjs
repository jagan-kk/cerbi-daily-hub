import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D_hiGrJN.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spotify.functions-BbN72POA.js
var SPOTIFY_ACCOUNTS = "https://accounts.spotify.com/api";
var SPOTIFY_API = "https://api.spotify.com/v1";
async function getValidAccessToken(userId, supabase) {
	const { data: token } = await supabase.from("spotify_tokens").select("*").eq("user_id", userId).maybeSingle();
	if (!token) throw new Error("Spotify not connected");
	const now = /* @__PURE__ */ new Date();
	if (new Date(token.expires_at) > now) return token.access_token;
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
			client_secret: clientSecret
		})
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Spotify token refresh failed: ${err}`);
	}
	const body = await res.json();
	const newExpiresAt = new Date(Date.now() + body.expires_in * 1e3).toISOString();
	const newAccessToken = body.access_token;
	const newRefreshToken = body.refresh_token ?? token.refresh_token;
	const { supabaseAdmin } = await import("./client.server-pv5dszoL.mjs");
	await supabaseAdmin.from("spotify_tokens").upsert({
		user_id: userId,
		access_token: newAccessToken,
		refresh_token: newRefreshToken,
		expires_at: newExpiresAt
	}, { onConflict: "user_id" });
	return newAccessToken;
}
var exchangeSpotifyCode_createServerFn_handler = createServerRpc({
	id: "58d50cf35e705bcc7d90599a5eb92869d3ad1a32106c19a58bbdd978daee2b1b",
	name: "exchangeSpotifyCode",
	filename: "src/lib/spotify.functions.ts"
}, (opts) => exchangeSpotifyCode.__executeServer(opts));
var exchangeSpotifyCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ code: stringType() }).parse(d)).handler(exchangeSpotifyCode_createServerFn_handler, async ({ data, context }) => {
	const { userId } = context;
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
	const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
	if (!clientId || !clientSecret || !redirectUri) throw new Error("Spotify credentials not configured");
	const res = await fetch(`${SPOTIFY_ACCOUNTS}/token`, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			grant_type: "authorization_code",
			code: data.code,
			redirect_uri: redirectUri,
			client_id: clientId,
			client_secret: clientSecret
		})
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Spotify token exchange failed: ${err}`);
	}
	const body = await res.json();
	const expiresAt = new Date(Date.now() + body.expires_in * 1e3).toISOString();
	const { supabaseAdmin } = await import("./client.server-pv5dszoL.mjs");
	await supabaseAdmin.from("spotify_tokens").upsert({
		user_id: userId,
		access_token: body.access_token,
		refresh_token: body.refresh_token,
		expires_at: expiresAt
	}, { onConflict: "user_id" });
	return { success: true };
});
var getSpotifyStatus_createServerFn_handler = createServerRpc({
	id: "6f35cbd11f9a89802cdf4a93e3b50261192c38a9b09ab5657d92d99e8008051d",
	name: "getSpotifyStatus",
	filename: "src/lib/spotify.functions.ts"
}, (opts) => getSpotifyStatus.__executeServer(opts));
var getSpotifyStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getSpotifyStatus_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data } = await supabase.from("spotify_tokens").select("user_id").eq("user_id", userId).maybeSingle();
	return { connected: !!data };
});
var getSpotifyToken_createServerFn_handler = createServerRpc({
	id: "ef6c4322bc9065dc67939b319d04a076b1fa57b02900798dbc2759c3d61429f6",
	name: "getSpotifyToken",
	filename: "src/lib/spotify.functions.ts"
}, (opts) => getSpotifyToken.__executeServer(opts));
var getSpotifyToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getSpotifyToken_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	return { access_token: await getValidAccessToken(userId, supabase) };
});
var fetchMyPlaylists_createServerFn_handler = createServerRpc({
	id: "418cf2898b3a2b53db69a625763f8823facf6364c6e0720cdcf9c3df3a557d25",
	name: "fetchMyPlaylists",
	filename: "src/lib/spotify.functions.ts"
}, (opts) => fetchMyPlaylists.__executeServer(opts));
var fetchMyPlaylists = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(fetchMyPlaylists_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const token = await getValidAccessToken(userId, supabase);
	const res = await fetch(`${SPOTIFY_API}/me/playlists?limit=50`, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Failed to fetch playlists: ${err}`);
	}
	return ((await res.json()).items ?? []).map((p) => ({
		id: p.id,
		name: p.name,
		description: p.description,
		image_url: p.images?.[0]?.url ?? null,
		track_count: p.tracks?.total ?? 0,
		spotify_url: p.external_urls?.spotify ?? "",
		owner: p.owner?.display_name ?? ""
	}));
});
var syncMyPlaylists_createServerFn_handler = createServerRpc({
	id: "d713d34b662af2d30802319140378ac403ee28d619931ba6a7f24f20a9555441",
	name: "syncMyPlaylists",
	filename: "src/lib/spotify.functions.ts"
}, (opts) => syncMyPlaylists.__executeServer(opts));
var syncMyPlaylists = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(syncMyPlaylists_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const token = await getValidAccessToken(userId, supabase);
	const res = await fetch(`${SPOTIFY_API}/me/playlists?limit=50`, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Failed to fetch playlists: ${err}`);
	}
	const items = (await res.json()).items ?? [];
	const { supabaseAdmin } = await import("./client.server-pv5dszoL.mjs");
	await supabaseAdmin.from("spotify_playlists").delete().eq("user_id", userId);
	if (items.length > 0) {
		const rows = items.map((p) => ({
			id: p.id,
			user_id: userId,
			name: p.name,
			description: p.description ?? null,
			image_url: p.images?.[0]?.url ?? null,
			track_count: p.tracks?.total ?? 0,
			spotify_url: p.external_urls?.spotify ?? ""
		}));
		await supabaseAdmin.from("spotify_playlists").insert(rows);
	}
	return { synced: items.length };
});
var getShowcasePlaylists_createServerFn_handler = createServerRpc({
	id: "2054ab26270312bfc394ffd5f04e3d54e81a52b9ad60dae623b2e4d7a9ab907f",
	name: "getShowcasePlaylists",
	filename: "src/lib/spotify.functions.ts"
}, (opts) => getShowcasePlaylists.__executeServer(opts));
var getShowcasePlaylists = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getShowcasePlaylists_createServerFn_handler, async ({ context }) => {
	const { supabase } = context;
	const { data } = await supabase.from("spotify_playlists").select("*, profiles!inner(username)").order("synced_at", { ascending: false });
	return data ?? [];
});
var searchInput = objectType({ query: stringType().min(1).max(100) });
var searchSpotifyTracks_createServerFn_handler = createServerRpc({
	id: "589b04b3fb08e0f207e9a45d3d1607b8242236dd7999d9d425931c195d7dd6d7",
	name: "searchSpotifyTracks",
	filename: "src/lib/spotify.functions.ts"
}, (opts) => searchSpotifyTracks.__executeServer(opts));
var searchSpotifyTracks = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => searchInput.parse(d)).handler(searchSpotifyTracks_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const token = await getValidAccessToken(userId, supabase);
	const res = await fetch(`${SPOTIFY_API}/search?q=${encodeURIComponent(data.query)}&type=track&limit=20`, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Search failed: ${err}`);
	}
	return ((await res.json()).tracks?.items ?? []).map((t) => ({
		id: t.id,
		name: t.name,
		artists: t.artists?.map((a) => a.name) ?? [],
		album: {
			name: t.album?.name,
			image_url: t.album?.images?.[0]?.url ?? null
		},
		duration_ms: t.duration_ms,
		uri: t.uri,
		preview_url: t.preview_url
	}));
});
var playlistTracksInput = objectType({ playlistId: stringType() });
var getPlaylistTracks_createServerFn_handler = createServerRpc({
	id: "6f1a665bc2bb0dff3c44190f93489fac4aabc9e32b2ef27ef8108caf80c0bd3e",
	name: "getPlaylistTracks",
	filename: "src/lib/spotify.functions.ts"
}, (opts) => getPlaylistTracks.__executeServer(opts));
var getPlaylistTracks = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => playlistTracksInput.parse(d)).handler(getPlaylistTracks_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const token = await getValidAccessToken(userId, supabase);
	const res = await fetch(`${SPOTIFY_API}/playlists/${data.playlistId}/tracks`, { headers: { Authorization: `Bearer ${token}` } });
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Failed to fetch playlist tracks: ${err}`);
	}
	return ((await res.json()).items ?? []).filter((item) => item.track).map((item) => {
		const t = item.track;
		return {
			id: t.id,
			name: t.name,
			artists: t.artists?.map((a) => a.name) ?? [],
			album: {
				name: t.album?.name,
				image_url: t.album?.images?.[0]?.url ?? null
			},
			duration_ms: t.duration_ms,
			uri: t.uri,
			preview_url: t.preview_url
		};
	});
});
//#endregion
export { exchangeSpotifyCode_createServerFn_handler, fetchMyPlaylists_createServerFn_handler, getPlaylistTracks_createServerFn_handler, getShowcasePlaylists_createServerFn_handler, getSpotifyStatus_createServerFn_handler, getSpotifyToken_createServerFn_handler, searchSpotifyTracks_createServerFn_handler, syncMyPlaylists_createServerFn_handler };
