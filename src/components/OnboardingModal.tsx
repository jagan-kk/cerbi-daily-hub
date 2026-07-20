import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { OCCUPATIONS, INTERESTS } from "@/lib/constants";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export function OnboardingModal() {
  const [occupation, setOccupation] = useState<string>("");
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const qc = useQueryClient();

  const toggle = (id: string) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const save = async () => {
    if (!occupation) return toast.error("Pick an occupation");
    if (selected.length === 0) return toast.error("Pick at least one interest");
    setBusy(true);
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    const { error } = await supabase
      .from("profiles")
      .update({ occupation, interests: selected, onboarded: true })
      .eq("id", u.user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["profile"] });
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: "oklch(0 0 0 / 0.7)" }}
    >
      <div className="pixel-window w-full max-w-2xl">
        <div className="pixel-window-bar px-3 py-2 font-display text-[11px]">
          ◆ CHARACTER SELECT
        </div>
        <div className="p-6 space-y-5">
          <h2 className="font-display text-lg" style={{ color: "var(--color-accent)" }}>
            CHOOSE YOUR CLASS
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {OCCUPATIONS.map((o) => (
              <button
                key={o}
                type="button"
                className={`pixel-btn text-[9px] ${occupation === o ? "variant-gold" : ""}`}
                onClick={() => setOccupation(o)}
              >
                {o.toUpperCase()}
              </button>
            ))}
          </div>

          <h2 className="font-display text-lg pt-2" style={{ color: "var(--color-accent)" }}>
            NEWS INTERESTS
          </h2>
          <p className="font-body text-lg" style={{ color: "var(--color-muted-foreground)" }}>
            Pick topics for your daily news tome.
          </p>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map((i) => (
              <button
                key={i.id}
                type="button"
                className={`pixel-btn text-[9px] ${selected.includes(i.id) ? "variant-gold" : ""}`}
                onClick={() => toggle(i.id)}
              >
                {i.label.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="pt-2">
            <button onClick={save} disabled={busy} className="pixel-btn variant-gold w-full">
              {busy ? "..." : "ENTER CERBI"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}