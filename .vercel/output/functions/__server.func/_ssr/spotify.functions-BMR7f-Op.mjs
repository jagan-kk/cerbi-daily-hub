import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BFFE07zL.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-Ej2c5TmJ.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D_hiGrJN.mjs";
import { i as stringType, r as objectType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spotify.functions-BMR7f-Op.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var exchangeSpotifyCode = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => objectType({ code: stringType() }).parse(d)).handler(createSsrRpc("58d50cf35e705bcc7d90599a5eb92869d3ad1a32106c19a58bbdd978daee2b1b"));
var getSpotifyStatus = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("6f35cbd11f9a89802cdf4a93e3b50261192c38a9b09ab5657d92d99e8008051d"));
var getSpotifyToken = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("ef6c4322bc9065dc67939b319d04a076b1fa57b02900798dbc2759c3d61429f6"));
var fetchMyPlaylists = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("418cf2898b3a2b53db69a625763f8823facf6364c6e0720cdcf9c3df3a557d25"));
var syncMyPlaylists = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("d713d34b662af2d30802319140378ac403ee28d619931ba6a7f24f20a9555441"));
var getShowcasePlaylists = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("2054ab26270312bfc394ffd5f04e3d54e81a52b9ad60dae623b2e4d7a9ab907f"));
var searchInput = objectType({ query: stringType().min(1).max(100) });
var searchSpotifyTracks = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => searchInput.parse(d)).handler(createSsrRpc("589b04b3fb08e0f207e9a45d3d1607b8242236dd7999d9d425931c195d7dd6d7"));
var playlistTracksInput = objectType({ playlistId: stringType() });
var getPlaylistTracks = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => playlistTracksInput.parse(d)).handler(createSsrRpc("6f1a665bc2bb0dff3c44190f93489fac4aabc9e32b2ef27ef8108caf80c0bd3e"));
//#endregion
export { getShowcasePlaylists as a, searchSpotifyTracks as c, getPlaylistTracks as i, syncMyPlaylists as l, exchangeSpotifyCode as n, getSpotifyStatus as o, fetchMyPlaylists as r, getSpotifyToken as s, createSsrRpc as t };
