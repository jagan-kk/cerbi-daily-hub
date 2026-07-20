import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Cerbi" },
      { name: "description", content: "Sign in to Cerbi to access your game-style desktop, daily trials, chat rooms and shop." },
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
      <div className="pixel-window w-full max-w-md">
        <div className="pixel-window-bar px-3 py-2 font-display text-[11px] flex items-center justify-between">
          <span>◆ CERBI.OS — LOGIN</span>
          <span className="animate-pixel-blink">_</span>
        </div>
        <div className="p-6">
          <h1 className="font-display text-2xl text-center mb-1" style={{ color: "var(--color-accent)" }}>
            CERBI
          </h1>
          <p className="text-center font-body text-lg mb-6" style={{ color: "var(--color-muted-foreground)" }}>
            insert coin to begin
          </p>

          <div className="flex gap-2 mb-4">
            <button
              type="button"
              className={`pixel-btn flex-1 ${mode === "in" ? "" : "variant-ghost"}`}
              onClick={() => setMode("in")}
            >
              SIGN IN
            </button>
            <button
              type="button"
              className={`pixel-btn flex-1 ${mode === "up" ? "" : "variant-ghost"}`}
              onClick={() => setMode("up")}
            >
              NEW GAME
            </button>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <input
              className="pixel-input"
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="pixel-input"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
            <button type="submit" disabled={busy} className="pixel-btn variant-gold w-full">
              {busy ? "..." : mode === "in" ? "PRESS START" : "CREATE HERO"}
            </button>
          </form>

          <div className="my-4 text-center font-display text-[9px]" style={{ color: "var(--color-muted-foreground)" }}>
            — OR —
          </div>

          <button type="button" className="pixel-btn w-full" onClick={google}>
            CONTINUE WITH GOOGLE
          </button>
        </div>
      </div>
    </div>
  );
}