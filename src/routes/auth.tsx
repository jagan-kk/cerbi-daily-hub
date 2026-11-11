import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Cerbi" },
      {
        name: "description",
        content:
          "Sign in to Cerbi to access your game-style desktop, daily trials, chat rooms and shop.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/desktop" });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "up") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Account created! Signing you in…");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
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
      options: { redirectTo: window.location.origin },
    });
    if (error) toast.error(error.message ?? "Google sign in failed");
  };

  return (
    <div className="min-h-screen w-full wp-grid-purple flex items-center justify-center p-4">
      <a href="#auth-content" className="skip-link">
        Skip to sign in
      </a>
      <div
        id="auth-content"
        className="pixel-window w-full max-w-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
      >
        <div className="pixel-window-bar px-3 py-2 font-display text-[11px] flex items-center justify-between">
          <span>◆ CERBI.OS — LOGIN</span>
          <span className="animate-pixel-blink">_</span>
        </div>
        <div className="p-8 space-y-6">
          <div className="text-center">
            <h1
              id="auth-title"
              className="font-display text-3xl text-center"
              style={{ color: "var(--color-accent)" }}
            >
              CERBI
            </h1>
            <p
              className="font-body text-lg mt-2"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              insert coin to begin
            </p>
          </div>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              role="tab"
              aria-selected={mode === "in"}
              className={`pixel-btn flex-1 ${mode === "in" ? "" : "variant-ghost"}`}
              onClick={() => setMode("in")}
            >
              SIGN IN
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === "up"}
              className={`pixel-btn flex-1 ${mode === "up" ? "" : "variant-ghost"}`}
              onClick={() => setMode("up")}
            >
              NEW GAME
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label
                htmlFor="auth-email"
                className="font-display text-[10px] block mb-1"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                EMAIL
              </label>
              <input
                id="auth-email"
                className="pixel-input"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label
                htmlFor="auth-password"
                className="font-display text-[10px] block mb-1"
                style={{ color: "var(--color-muted-foreground)" }}
              >
                PASSWORD
              </label>
              <input
                id="auth-password"
                className="pixel-input"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" disabled={busy} className="pixel-btn variant-gold w-full">
              {busy ? "…" : mode === "in" ? "PRESS START" : "CREATE HERO"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-4">
            <div className="flex-grow border-t border-[oklch(0.08_0.02_260)]"></div>
            <span
              className="font-display text-[9px]"
              style={{ color: "var(--color-muted-foreground)" }}
            >
              — OR —
            </span>
            <div className="flex-grow border-t border-[oklch(0.08_0.02_260)]"></div>
          </div>

          <button type="button" className="pixel-btn w-full" onClick={google}>
            CONTINUE WITH GOOGLE
          </button>
        </div>
      </div>
    </div>
  );
}
