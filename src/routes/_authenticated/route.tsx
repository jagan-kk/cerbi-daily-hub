import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async () => {
    if (typeof window !== "undefined") {
      try {
        const { data } = await supabase.auth.getUser();
        if (!data?.user) throw redirect({ to: "/auth" });
        return { user: data.user };
      } catch {
        throw redirect({ to: "/auth" });
      }
    }
  },
  component: () => <Outlet />,
});