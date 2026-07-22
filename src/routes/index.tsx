import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      navigate({ to: data?.user ? "/desktop" : "/auth" });
    }).catch(() => {
      navigate({ to: "/auth" });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen wp-grid-purple flex items-center justify-center">
      <div
        className="font-display text-lg animate-pixel-blink"
        style={{ color: "var(--color-accent)" }}
      >
        LOADING.
      </div>
    </div>
  );
}
