import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as exchangeSpotifyCode } from "./spotify.functions-BMR7f-Op.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/callback-BjYtYVxX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SpotifyCallback() {
	const navigate = useNavigate();
	const [status, setStatus] = (0, import_react.useState)("exchanging");
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const params = new URLSearchParams(window.location.search);
		const code = params.get("code");
		const err = params.get("error");
		if (err) {
			setStatus("error");
			setError(`Spotify authorization denied: ${err}`);
			return;
		}
		if (!code) {
			setStatus("error");
			setError("No authorization code received from Spotify.");
			return;
		}
		let cancelled = false;
		(async () => {
			try {
				await exchangeSpotifyCode({ data: { code } });
				if (!cancelled) {
					setStatus("done");
					setTimeout(() => navigate({ to: "/desktop" }), 1e3);
				}
			} catch (err) {
				if (!cancelled) {
					setStatus("error");
					setError(err instanceof Error ? err.message : "Failed to connect Spotify");
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen wp-grid-purple flex items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "font-display text-lg animate-pixel-blink",
			style: { color: "var(--color-accent)" },
			children: [
				status === "exchanging" && "CONNECTING SPOTIFY...",
				status === "done" && "SPOTIFY CONNECTED!",
				status === "error" && `ERROR: ${error}`
			]
		})
	});
}
//#endregion
export { SpotifyCallback as component };
