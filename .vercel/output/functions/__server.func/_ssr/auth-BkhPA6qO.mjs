import { r as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-BkhPA6qO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function SpotifyAuthRedirect() {
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams({
			client_id: "38e1a9e4665b495c889508625935a1da",
			response_type: "code",
			redirect_uri: "https://cerbi-daily-hub.vercel.app/api/spotify/callback",
			scope: "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative"
		});
		window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
	}, []);
	return null;
}
//#endregion
export { SpotifyAuthRedirect as component };
