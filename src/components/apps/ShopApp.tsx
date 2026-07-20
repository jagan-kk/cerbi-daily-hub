import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/hooks/useProfile";
import { toast } from "sonner";

type Item = {
  id: string;
  kind: string;
  name: string;
  description: string | null;
  cost: number;
  asset_key: string;
};

export function ShopApp({ profile }: { profile: Profile }) {
  const qc = useQueryClient();
  const items = useQuery({
    queryKey: ["shop-items"],
    queryFn: async (): Promise<Item[]> => {
      const { data } = await supabase.from("shop_items").select("*").order("cost");
      return (data ?? []) as Item[];
    },
  });
  const inv = useQuery({
    queryKey: ["inventory", profile.id],
    queryFn: async () => {
      const { data } = await supabase.from("user_inventory").select("item_id").eq("user_id", profile.id);
      return new Set((data ?? []).map((r) => r.item_id));
    },
  });

  const buy = async (id: string) => {
    const { error } = await supabase.rpc("purchase_item", { item: id });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["profile"] });
    qc.invalidateQueries({ queryKey: ["inventory", profile.id] });
    toast.success("Purchased!");
  };

  const apply = async (kind: string, asset_key: string) => {
    const patch = kind === "font" ? { active_font: asset_key } : { active_wallpaper: asset_key };
    const { error } = await supabase.from("profiles").update(patch).eq("id", profile.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Applied");
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg" style={{ color: "var(--color-accent)" }}>SHOP OF WARES</h2>
        <div className="pixel-badge">{profile.wallet_points} PTS</div>
      </div>
      {["font", "wallpaper"].map((kind) => (
        <div key={kind}>
          <div className="font-display text-[11px] mb-2">{kind.toUpperCase()}S</div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {items.data?.filter((i) => i.kind === kind).map((i) => {
              const owned = inv.data?.has(i.id) || i.cost === 0;
              const active =
                (kind === "font" && profile.active_font === i.asset_key) ||
                (kind === "wallpaper" && profile.active_wallpaper === i.asset_key);
              return (
                <div key={i.id} className="pixel-card space-y-2">
                  <div className={`font-display text-[11px] font-${i.asset_key}`}>{i.name}</div>
                  {i.description && (
                    <div className="font-body text-base" style={{ color: "var(--color-muted-foreground)" }}>
                      {i.description}
                    </div>
                  )}
                  {kind === "wallpaper" && (
                    <div className={`wp-${i.asset_key} h-12`} style={{ border: "2px solid oklch(0.08 0.02 260)" }} />
                  )}
                  {active ? (
                    <button className="pixel-btn variant-ghost w-full" disabled>ACTIVE</button>
                  ) : owned ? (
                    <button className="pixel-btn w-full" onClick={() => apply(i.kind, i.asset_key)}>APPLY</button>
                  ) : (
                    <button
                      className="pixel-btn variant-gold w-full"
                      onClick={() => buy(i.id)}
                      disabled={profile.wallet_points < i.cost}
                    >
                      BUY {i.cost}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}