import {
  BookMarked,
  MessageCircle,
  ScrollText,
  ShoppingBag,
  Settings,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  tome: BookMarked,
  tavern: MessageCircle,
  scroll: ScrollText,
  coin: ShoppingBag,
  gear: Settings,
};

export function PixelIcon({ name, size = 48 }: { name: "tome" | "tavern" | "scroll" | "coin" | "gear"; size?: number }) {
  const Icon = iconMap[name];
  return <Icon size={size} strokeWidth={1.5} className="text-[oklch(0.85_0.17_90)]" />;
}