import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="pixel-window max-w-md flex flex-col">
        <div className="pixel-window-bar px-3 py-2 font-display text-[11px] flex items-center justify-between">
          <span>◆ CERBI.OS — 404</span>
          <span className="animate-pixel-blink">_</span>
        </div>
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
          <h1 className="font-display text-7xl text-foreground leading-none">404</h1>
          <h2 className="font-display text-xl text-foreground">Tome not found</h2>
          <p className="font-body text-lg text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Link to="/" className="pixel-btn variant-gold">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="pixel-window max-w-md flex flex-col">
        <div className="pixel-window-bar px-3 py-2 font-display text-[11px] flex items-center justify-between">
          <span>◆ CERBI.OS — SYSTEM ERROR</span>
          <span className="animate-pixel-blink">!</span>
        </div>
        <div className="p-8 flex flex-col items-center justify-center gap-3 text-center">
          <h1 className="font-display text-xl text-foreground">System fault</h1>
          <p className="font-body text-lg text-muted-foreground">
            Something went wrong on our end. You can try refreshing or head back home.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              className="pixel-btn variant-gold"
            >
              Try again
            </button>
            <Link to="/" className="pixel-btn variant-ghost">
              Go home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Cerbi — a retro OS for news, chat, daily trials & rewards" },
      {
        name: "description",
        content:
          "Cerbi is a game-style desktop OS: browse a monthly news calendar, chat in code-only rooms, take a 10-question daily trial for your occupation, and spend points in the shop.",
      },
      { property: "og:title", content: "Cerbi — retro OS" },
      {
        property: "og:description",
        content: "A game-style desktop with news, chat rooms, daily quizzes and a rewards shop.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as any },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Pixelify+Sans:wght@400..700&family=Silkscreen:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        router.invalidate();
        if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
      }
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster theme="dark" position="top-center" />
    </QueryClientProvider>
  );
}
