import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useRef } from "react";
import type { Profile } from "@/hooks/useProfile";
import {
  getSpotifyStatus,
  getSpotifyToken,
  fetchMyPlaylists,
  syncMyPlaylists,
  getShowcasePlaylists,
  searchSpotifyTracks,
  getPlaylistTracks,
} from "@/lib/spotify.functions";

type TrackInfo = {
  id: string;
  name: string;
  artists: string[];
  album: { name: string; image_url: string | null };
  duration_ms: number;
  uri: string;
};

type PlaylistInfo = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  track_count: number;
  spotify_url: string;
  owner: string;
};

export function MusicApp({ profile }: { profile: Profile }) {
  const [connected, setConnected] = useState<boolean | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"playlists" | "search" | "showcase">("playlists");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [playerBusy, setPlayerBusy] = useState(false);
  const [playlistTracks, setPlaylistTracks] = useState<TrackInfo[]>([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const playerInitRef = useRef(false);

  useEffect(() => {
    getSpotifyStatus()
      .then((s) => setConnected(s.connected))
      .catch(() => setConnected(false));
  }, []);

  useEffect(() => {
    if (!connected) return;
    getSpotifyToken()
      .then((t) => setAccessToken(t.access_token))
      .catch(() => setConnected(false));
  }, [connected]);

  useEffect(() => {
    if (!accessToken || playerInitRef.current) return;
    playerInitRef.current = true;

    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    (window as any).onSpotifyWebPlaybackSDKReady = () => {
      const p = new (window as any).Spotify.Player({
        name: "Cerbi OS Player",
        getOAuthToken: (cb: (token: string) => void) => {
          getSpotifyToken().then((t) => cb(t.access_token)).catch(() => {});
        },
        volume,
      });

      p.addListener("ready", ({ device_id }: { device_id: string }) => {
        setDeviceId(device_id);
      });

      p.addListener("not_ready", () => {
        setDeviceId(null);
      });

      p.addListener("player_state_changed", (state: any) => {
        if (!state) return;
        setIsPlaying(!state.paused);
        if (state.track_window?.current_track) {
          const t = state.track_window.current_track;
          setCurrentTrack({
            id: t.id,
            name: t.name,
            artists: t.artists?.map((a: any) => a.name) ?? [],
            album: { name: t.album?.name ?? "", image_url: t.album?.images?.[0]?.url ?? null },
            duration_ms: t.duration,
            uri: t.uri,
          });
        }
      });

      p.connect();
      setPlayer(p);
    };

    return () => {
      const sp = document.querySelector('script[src="https://sdk.scdn.co/spotify-player.js"]');
      if (sp) sp.remove();
    };
  }, [accessToken, volume]);

  const { data: playlists, error: playlistsError, refetch: refetchPlaylists } = useQuery({
    queryKey: ["spotify-playlists"],
    queryFn: () => fetchMyPlaylists(),
    enabled: !!connected,
  });

  const { data: showcase } = useQuery({
    queryKey: ["spotify-showcase"],
    queryFn: () => getShowcasePlaylists(),
    enabled: !!connected,
  });

  const { data: searchResults } = useQuery({
    queryKey: ["spotify-search", searchQuery, searchTrigger],
    queryFn: () => searchSpotifyTracks({ data: { query: searchQuery } }),
    enabled: searchTrigger > 0,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) setSearchTrigger((s) => s + 1);
  };

  const ensurePlayback = async () => {
    if (!player || !deviceId || playerBusy) return;
    setPlayerBusy(true);
    try {
      const token = accessToken || (await getSpotifyToken()).access_token;
      await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ device_ids: [deviceId], play: false }),
      });
    } catch {
    } finally {
      setPlayerBusy(false);
    }
  };

  const playTracks = async (uris: string[]) => {
    if (!player) return;
    try {
      await player.play({ uris });
    } catch {
      await ensurePlayback();
      await new Promise((r) => setTimeout(r, 300));
      await player.play({ uris });
    }
  };

  const playPlaylist = async (uri: string) => {
    if (!player) return;
    try {
      await player.play({ context_uri: uri });
    } catch {
      await ensurePlayback();
      await new Promise((r) => setTimeout(r, 300));
      await player.play({ context_uri: uri });
    }
  };

  const loadPlaylistTracks = async (playlistId: string) => {
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      setPlaylistTracks([]);
      return;
    }
    setSelectedPlaylistId(playlistId);
    try {
      const tracks = await getPlaylistTracks({ data: { playlistId } });
      setPlaylistTracks(tracks as any);
    } catch {
      setPlaylistTracks([]);
    }
  };

  const syncToShowcase = async () => {
    await syncMyPlaylists();
    refetchPlaylists();
  };

  if (connected === null) {
    return (
      <div className="p-6 flex items-center justify-center h-full">
        <div className="font-display text-lg animate-pixel-blink">LOADING...</div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full gap-4">
        <div className="font-display text-lg" style={{ color: "var(--color-accent)" }}>
          MUSIC PLAYER
        </div>
        <p className="font-body text-lg text-center" style={{ color: "var(--color-muted-foreground)" }}>
          Connect your Spotify to play music from the desktop.
        </p>
        <a href="/api/spotify/auth" className="pixel-btn variant-gold inline-block">
          CONNECT SPOTIFY
        </a>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b-2 shrink-0" style={{ borderColor: "oklch(0.08 0.02 260)" }}>
        {(["playlists", "search", "showcase"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="flex-1 font-display text-[9px] py-2"
            style={{
              background: activeTab === tab ? "var(--color-accent)" : "transparent",
              color: activeTab === tab ? "black" : "var(--color-muted-foreground)",
            }}
          >
            {tab === "playlists" ? "MY PLAYLISTS" : tab === "search" ? "SEARCH" : "SHOWCASE"}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {activeTab === "playlists" && (
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-2">
              <div className="font-display text-[10px]">YOUR PLAYLISTS</div>
              <button className="pixel-btn variant-ghost text-[8px]" onClick={syncToShowcase}>
                SYNC TO SHOWCASE
              </button>
            </div>
            {playlistsError && (
              <div className="font-body text-base" style={{ color: "var(--color-blood)" }}>
                Error: {playlistsError.message}
              </div>
            )}
            {!playlistsError && !playlists?.length && (
              <div className="font-body text-lg" style={{ color: "var(--color-muted-foreground)" }}>
                No playlists found.
              </div>
            )}
            {(playlists as PlaylistInfo[])?.map((p) => (
              <div key={p.id}>
                <button
                  onClick={() => playPlaylist(`spotify:playlist:${p.id}`)}
                  className="pixel-card w-full text-left flex items-center gap-3 hover:brightness-110"
                >
                  <div
                    className="w-10 h-10 shrink-0 bg-[oklch(0.2_0.03_260)] rounded"
                    style={
                      p.image_url
                        ? { backgroundImage: `url(${p.image_url})`, backgroundSize: "cover" }
                        : {}
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[10px] truncate">{p.name}</div>
                    <div className="font-body text-base" style={{ color: "var(--color-muted-foreground)" }}>
                      {p.track_count} tracks
                    </div>
                  </div>
                </button>
                <button
                  className="font-display text-[8px] ml-[3.25rem] mt-1"
                  style={{ color: "var(--color-accent)" }}
                  onClick={() => loadPlaylistTracks(p.id)}
                >
                  {selectedPlaylistId === p.id ? "HIDE TRACKS" : "SHOW TRACKS"}
                </button>
                {selectedPlaylistId === p.id && (
                  <div className="ml-[3.25rem] mt-1 space-y-1">
                    {playlistTracks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => playTracks([t.uri])}
                        className="block w-full text-left font-body text-base hover:brightness-110 px-1"
                      >
                        <span className="font-display text-[9px]" style={{ color: "var(--color-accent)" }}>
                          {t.name}
                        </span>
                        <span className="ml-2" style={{ color: "var(--color-muted-foreground)" }}>
                          {t.artists.join(", ")}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === "search" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                className="pixel-input flex-1"
                placeholder="Search tracks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="pixel-btn" onClick={handleSearch}>
                SEARCH
              </button>
            </div>
            <div className="space-y-1">
              {(searchResults as TrackInfo[])?.map((t) => (
                <button
                  key={t.id}
                  onClick={() => playTracks([t.uri])}
                  className="pixel-card w-full text-left flex items-center gap-3 hover:brightness-110"
                >
                  <div
                    className="w-10 h-10 shrink-0 bg-[oklch(0.2_0.03_260)] rounded"
                    style={
                      t.album?.image_url
                        ? { backgroundImage: `url(${t.album.image_url})`, backgroundSize: "cover" }
                        : {}
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[10px] truncate">{t.name}</div>
                    <div className="font-body text-base" style={{ color: "var(--color-muted-foreground)" }}>
                      {t.artists.join(", ")}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "showcase" && (
          <div className="space-y-2">
            <div className="font-display text-[10px] mb-2">COMMUNITY PLAYLISTS</div>
            {!showcase?.length && (
              <div className="font-body text-lg" style={{ color: "var(--color-muted-foreground)" }}>
                No shared playlists yet. Sync yours!
              </div>
            )}
            {(showcase as any[])?.map((p: any) => (
              <div key={p.id}>
                <button
                  onClick={() => playPlaylist(`spotify:playlist:${p.id}`)}
                  className="pixel-card w-full text-left flex items-center gap-3 hover:brightness-110"
                >
                  <div
                    className="w-10 h-10 shrink-0 bg-[oklch(0.2_0.03_260)] rounded"
                    style={
                      p.image_url
                        ? { backgroundImage: `url(${p.image_url})`, backgroundSize: "cover" }
                        : {}
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-[10px] truncate">{p.name}</div>
                    <div className="font-body text-base" style={{ color: "var(--color-muted-foreground)" }}>
                      by {p.profiles?.username} · {p.track_count} tracks
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {player && (
        <div
          className="shrink-0 border-t-2 p-2 flex items-center gap-3"
          style={{ borderColor: "oklch(0.08 0.02 260)", background: "oklch(0.12 0.03 260)" }}
        >
          <div
            className="w-10 h-10 shrink-0 bg-[oklch(0.2_0.03_260)] rounded"
            style={
              currentTrack?.album?.image_url
                ? { backgroundImage: `url(${currentTrack.album.image_url})`, backgroundSize: "cover" }
                : {}
            }
          />
          <div className="min-w-0 flex-1">
            <div className="font-display text-[9px] truncate">{currentTrack?.name ?? "No track"}</div>
            <div className="font-body text-base truncate" style={{ color: "var(--color-muted-foreground)" }}>
              {currentTrack?.artists?.join(", ") ?? ""}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="pixel-btn variant-ghost text-[9px] px-1"
              onClick={() => player.previousTrack()}
            >
              ⏮
            </button>
            <button
              className="pixel-btn variant-gold text-[9px] px-2"
              onClick={() => (isPlaying ? player.pause() : player.resume())}
            >
              {isPlaying ? "⏸" : "▶"}
            </button>
            <button
              className="pixel-btn variant-ghost text-[9px] px-1"
              onClick={() => player.nextTrack()}
            >
              ⏭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
