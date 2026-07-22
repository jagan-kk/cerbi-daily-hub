import { r as __toESM } from "../_runtime.mjs";
import { a as require_jsx_runtime, o as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./client-B7SjN-VM.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D5oW51AP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AuthPage() {
	const navigate = useNavigate();
	const [mode, setMode] = (0, import_react.useState)("in");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		supabase.auth.getUser().then(({ data }) => {
			if (data.user) navigate({ to: "/desktop" });
		});
	}, [navigate]);
	const submit = async (e) => {
		e.preventDefault();
		setBusy(true);
		try {
			if (mode === "up") {
				const { error } = await supabase.auth.signUp({
					email,
					password,
					options: { emailRedirectTo: window.location.origin }
				});
				if (error) throw error;
				toast.success("Account created! Signing you in…");
			} else {
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password
				});
				if (error) throw error;
			}
			navigate({ to: "/desktop" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Auth failed");
		} finally {
			setBusy(false);
		}
	};
	const google = async () => {
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin }
		});
		if (error) toast.error(error.message ?? "Google sign in failed");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen w-full wp-grid-purple flex items-center justify-center p-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pixel-window w-full max-w-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pixel-window-bar px-3 py-2 font-display text-[11px] flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◆ CERBI.OS — LOGIN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "animate-pixel-blink",
					children: "_"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl text-center mb-1",
						style: { color: "var(--color-accent)" },
						children: "CERBI"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center font-body text-lg mb-6",
						style: { color: "var(--color-muted-foreground)" },
						children: "insert coin to begin"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `pixel-btn flex-1 ${mode === "in" ? "" : "variant-ghost"}`,
							onClick: () => setMode("in"),
							children: "SIGN IN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: `pixel-btn flex-1 ${mode === "up" ? "" : "variant-ghost"}`,
							onClick: () => setMode("up"),
							children: "NEW GAME"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: submit,
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "pixel-input",
								type: "email",
								placeholder: "email",
								value: email,
								onChange: (e) => setEmail(e.target.value),
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "pixel-input",
								type: "password",
								placeholder: "password",
								value: password,
								onChange: (e) => setPassword(e.target.value),
								minLength: 6,
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								disabled: busy,
								className: "pixel-btn variant-gold w-full",
								children: busy ? "..." : mode === "in" ? "PRESS START" : "CREATE HERO"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "my-4 text-center font-display text-[9px]",
						style: { color: "var(--color-muted-foreground)" },
						children: "— OR —"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "pixel-btn w-full",
						onClick: google,
						children: "CONTINUE WITH GOOGLE"
					})
				]
			})]
		})
	});
}
//#endregion
export { AuthPage as component };
