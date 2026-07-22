//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Ej2c5TmJ.js
var manifest = {
	"0db76b542cdf515cec6a53ace1f6b03413ab76b2731678ab20dd3a45d1de1c9b": {
		functionName: "submitDailyTrial_createServerFn_handler",
		importer: () => import("./_ssr/trial.functions-CwdJuoLo.mjs")
	},
	"2054ab26270312bfc394ffd5f04e3d54e81a52b9ad60dae623b2e4d7a9ab907f": {
		functionName: "getShowcasePlaylists_createServerFn_handler",
		importer: () => import("./_ssr/spotify.functions-BbN72POA.mjs")
	},
	"29fff5da6af31d00af77ec937b520bab841f00dfd01498109a529976e434d0d2": {
		functionName: "getLeaderboard_createServerFn_handler",
		importer: () => import("./_ssr/trial.functions-CwdJuoLo.mjs")
	},
	"418cf2898b3a2b53db69a625763f8823facf6364c6e0720cdcf9c3df3a557d25": {
		functionName: "fetchMyPlaylists_createServerFn_handler",
		importer: () => import("./_ssr/spotify.functions-BbN72POA.mjs")
	},
	"589b04b3fb08e0f207e9a45d3d1607b8242236dd7999d9d425931c195d7dd6d7": {
		functionName: "searchSpotifyTracks_createServerFn_handler",
		importer: () => import("./_ssr/spotify.functions-BbN72POA.mjs")
	},
	"58d50cf35e705bcc7d90599a5eb92869d3ad1a32106c19a58bbdd978daee2b1b": {
		functionName: "exchangeSpotifyCode_createServerFn_handler",
		importer: () => import("./_ssr/spotify.functions-BbN72POA.mjs")
	},
	"6f1a665bc2bb0dff3c44190f93489fac4aabc9e32b2ef27ef8108caf80c0bd3e": {
		functionName: "getPlaylistTracks_createServerFn_handler",
		importer: () => import("./_ssr/spotify.functions-BbN72POA.mjs")
	},
	"6f35cbd11f9a89802cdf4a93e3b50261192c38a9b09ab5657d92d99e8008051d": {
		functionName: "getSpotifyStatus_createServerFn_handler",
		importer: () => import("./_ssr/spotify.functions-BbN72POA.mjs")
	},
	"a1be1efbada04e9518d46f29bd7912b8a2ae8718ee3c23a3322826f7f3202549": {
		functionName: "getNewsForDay_createServerFn_handler",
		importer: () => import("./_ssr/news.functions-CFygtXOF.mjs")
	},
	"c31fe3ef3d878a9615f6e89eccbee0addcd044110e811c13a22e0248d7454fe5": {
		functionName: "getDailyQuestions_createServerFn_handler",
		importer: () => import("./_ssr/trial.functions-CwdJuoLo.mjs")
	},
	"d713d34b662af2d30802319140378ac403ee28d619931ba6a7f24f20a9555441": {
		functionName: "syncMyPlaylists_createServerFn_handler",
		importer: () => import("./_ssr/spotify.functions-BbN72POA.mjs")
	},
	"ef6c4322bc9065dc67939b319d04a076b1fa57b02900798dbc2759c3d61429f6": {
		functionName: "getSpotifyToken_createServerFn_handler",
		importer: () => import("./_ssr/spotify.functions-BbN72POA.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
