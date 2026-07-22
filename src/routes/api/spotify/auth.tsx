import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/api/spotify/auth")({
  ssr: false,
  component: SpotifyAuthRedirect,
});

function SpotifyAuthRedirect() {
  useEffect(() => {
    const params = new URLSearchParams({
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID!,
      response_type: "code",
      redirect_uri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI!,
      scope:
        "streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state playlist-read-private playlist-read-collaborative",
    });
    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }, []);
  return null;
}
