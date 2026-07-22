import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { exchangeSpotifyCode } from "@/lib/spotify.functions";

export const Route = createFileRoute("/api/spotify/callback")({
  ssr: false,
  component: SpotifyCallback,
});

function SpotifyCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"exchanging" | "done" | "error">("exchanging");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
          setTimeout(() => navigate({ to: "/desktop" }), 1000);
        }
      } catch (err) {
        if (!cancelled) {
          setStatus("error");
          setError(err instanceof Error ? err.message : "Failed to connect Spotify");
        }
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen wp-grid-purple flex items-center justify-center">
      <div className="font-display text-lg animate-pixel-blink" style={{ color: "var(--color-accent)" }}>
        {status === "exchanging" && "CONNECTING SPOTIFY..."}
        {status === "done" && "SPOTIFY CONNECTED!"}
        {status === "error" && `ERROR: ${error}`}
      </div>
    </div>
  );
}
