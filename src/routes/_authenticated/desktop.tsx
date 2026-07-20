import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { OnboardingModal } from "@/components/OnboardingModal";
import { PixelIcon } from "@/components/desktop/PixelIcon";
import { Window } from "@/components/desktop/Window";
import { NewsApp } from "@/components/apps/NewsApp";
import { ChatApp } from "@/components/apps/ChatApp";
import { DailyTrialApp } from "@/components/apps/DailyTrialApp";
import { ShopApp } from "@/components/apps/ShopApp";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "@tanstack/react-router";

type AppKey = "news" | "chat" | "trial" | "shop";

const APPS: { key: AppKey; title: string; icon: "tome" | "tavern" | "scroll" | "coin" }[] = [
  { key: "news", title: "News Tome", icon: "tome" },
  { key: "chat", title: "Chat Tavern", icon: "tavern" },
  { key: "trial", title: "Daily Trial", icon: "scroll" },
  { key: "shop", title: "Shop of Wares", icon: "coin" },
];

export const Route = createFileRoute("/_authenticated/desktop")({
  head: () => ({ meta: [{ title: "Cerbi Desktop" }] }),
  component: Desktop,
});

const FONT_STYLES: Record<string, { display: string; body: string }> = {
  "press-start": { display: "'Press Start 2P', system-ui, monospace", body: "'VT323', 'Courier New', monospace" },
  vt323: { display: "'VT323', monospace", body: "'VT323', monospace" },
  pixelify: { display: "'Pixelify Sans', system-ui, monospace", body: "'VT323', 'Courier New', monospace" },
  silkscreen: { display: "'Silkscreen', system-ui, monospace", body: "'VT323', 'Courier New', monospace" },
};

function Desktop() {
  const { data: profile, isLoading } = useProfile();
  const [open, setOpen] = useState<Set<AppKey>>(new Set());
  const [z, setZ] = useState<Record<AppKey, number>>({ news: 1, chat: 1, trial: 1, shop: 1 });
  const [top, setTop] = useState(2);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen wp-grid-purple flex items-center justify-center">
        <div className="font-display text-lg animate-pixel-blink" style={{ color: "var(--color-accent)" }}>
          LOADING…
        </div>
      </div>
    );
  }
  if (!profile) return null;
  if (!profile.onboarded) return <OnboardingModal />;

  const wallpaper = `wp-${profile.active_wallpaper || "grid-teal"}`;
  const fonts = FONT_STYLES[profile.active_font] || FONT_STYLES["press-start"];

  const openApp = (k: AppKey) => {
    setOpen((s) => new Set(s).add(k));
    focus(k);
  };
  const closeApp = (k: AppKey) => {
    setOpen((s) => {
      const n = new Set(s);
      n.delete(k);
      return n;
    });
  };
  const focus = (k: AppKey) => {
    setTop((t) => {
      setZ((zz) => ({ ...zz, [k]: t + 1 }));
      return t + 1;
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div
      className={`min-h-screen ${wallpaper} relative overflow-hidden`}
      style={{ "--font-display": fonts.display, "--font-body": fonts.body } as React.CSSProperties}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-[oklch(0.08_0.02_260)] text-[oklch(0.95_0.02_90)] font-display text-[10px] z-50 border-b-2 border-[oklch(0.7_0.15_85)]">
        <span>◆ CERBI.OS</span>
        <span>
          {profile.username} · <span style={{ color: "var(--color-accent)" }}>{profile.wallet_points} PTS</span>
        </span>
        <button onClick={signOut} className="pixel-btn variant-ghost text-[9px] py-1 px-2">
          LOGOUT
        </button>
      </div>

      {/* Desktop icons */}
      <div className="pt-14 pl-4 grid grid-cols-2 md:grid-cols-1 gap-4 w-32 md:w-28">
        {APPS.map((a) => (
          <button
            key={a.key}
            onDoubleClick={() => openApp(a.key)}
            onClick={() => openApp(a.key)}
            className="flex flex-col items-center gap-1 group"
          >
            <PixelIcon name={a.icon} />
            <span
              className="font-display text-[9px] px-1 py-0.5 group-hover:bg-[oklch(0.7_0.15_85)] group-hover:text-black"
              style={{ color: "oklch(0.98 0.01 90)", textShadow: "1px 1px 0 #000" }}
            >
              {a.title.toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {APPS.map((a) =>
        open.has(a.key) ? (
          <Window
            key={a.key}
            title={a.title}
            onClose={() => closeApp(a.key)}
            onFocus={() => focus(a.key)}
            zIndex={z[a.key]}
          >
            {a.key === "news" && <NewsApp profile={profile} />}
            {a.key === "chat" && <ChatApp profile={profile} />}
            {a.key === "trial" && <DailyTrialApp profile={profile} />}
            {a.key === "shop" && <ShopApp profile={profile} />}
          </Window>
        ) : null,
      )}
    </div>
  );
}