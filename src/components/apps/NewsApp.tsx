import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getNewsForDay } from "@/lib/news.functions";
import type { Profile } from "@/hooks/useProfile";

function daysInMonth(y: number, m: number) {
  return new Date(y, m + 1, 0).getDate();
}

export function NewsApp({ profile }: { profile: Profile }) {
  const now = new Date();
  const [year] = useState(now.getFullYear());
  const [month] = useState(now.getMonth());
  const [selected, setSelected] = useState<string | null>(null);

  const total = daysInMonth(year, month);
  const firstDow = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(d);
  const monthName = now.toLocaleString("en", { month: "long" });

  return (
    <div className="app-window p-6 gap-4">
      <div className="app-header">
        <div>
          <div className="app-title" style={{ color: "var(--color-neon)" }}>
            {monthName.toUpperCase()} {year}
          </div>
          <div className="font-body text-lg" style={{ color: "var(--color-muted-foreground)" }}>
            Older months burn away when a new one begins. Click a day to open its tome.
          </div>
        </div>
      </div>
      <div className="app-body">
        <div className="grid grid-cols-7 gap-1 text-center font-display text-[9px]">
          {"SUN MON TUE WED THU FRI SAT".split(" ").map((d) => (
            <div key={d} className="py-1" style={{ color: "var(--color-muted-foreground)" }}>
              {d}
            </div>
          ))}
          {cells.map((d, i) => {
            const dateStr = d
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`
              : null;
            const today = new Date();
            const isFuture = !!(
              d && new Date(year, month, d).setHours(0, 0, 0, 0) > today.setHours(0, 0, 0, 0)
            );
            return (
              <button
                key={i}
                id={`news-day-${d || i}`}
                disabled={!d || isFuture}
                onClick={() => dateStr && setSelected(dateStr)}
                className="aspect-square flex flex-col items-center justify-center p-1"
                style={{
                  background: d ? "oklch(0.28 0.05 260)" : "transparent",
                  border: d ? "2px solid oklch(0.08 0.02 260)" : "none",
                  opacity: isFuture ? 0.35 : 1,
                  cursor: d && !isFuture ? "pointer" : "default",
                }}
              >
                {d && (
                  <>
                    <svg viewBox="0 0 16 16" width="20" height="20" shapeRendering="crispEdges">
                      <rect x="3" y="2" width="10" height="12" fill="#8a2a2a" />
                      <rect x="3" y="2" width="10" height="1" fill="#c14545" />
                      <rect x="6" y="6" width="4" height="1" fill="#f6d34a" />
                      <rect x="5" y="8" width="6" height="1" fill="#f6d34a" />
                    </svg>
                    <span className="text-[8px] mt-1">{d}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {selected && (
          <NewsSheet date={selected} topics={profile.interests} onClose={() => setSelected(null)} />
        )}
      </div>
    </div>
  );
}

function NewsSheet({
  date,
  topics,
  onClose,
}: {
  date: string;
  topics: string[];
  onClose: () => void;
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["news", date, topics.join(",")],
    queryFn: () => getNewsForDay({ data: { date, topics } }),
  });

  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: "var(--color-window)" }}>
      <div
        className="flex items-center justify-between p-3 border-b-2"
        style={{ borderColor: "oklch(0.08 0.02 260)" }}
      >
        <div className="font-display text-[11px]">◆ TOME OF {date}</div>
        <button className="pixel-btn variant-ghost text-[9px]" onClick={onClose}>
          BACK
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {isLoading && (
          <div
            className="font-display text-lg animate-pixel-pulse"
            style={{ color: "var(--color-neon)" }}
          >
            Loading headlines…
          </div>
        )}
        {error && (
          <div className="pixel-card">
            <div className="font-display text-[10px]" style={{ color: "var(--color-blood)" }}>
              ERROR
            </div>
            <div className="font-body text-lg mt-2" style={{ color: "var(--color-blood)" }}>
              {(error as Error).message}
            </div>
          </div>
        )}
        {!isLoading && !error && data?.articles?.length === 0 && (
          <div className="pixel-empty">No news found for this day.</div>
        )}
        {!isLoading &&
          !error &&
          data?.articles?.map((a: any, idx: number) => (
            <article
              key={idx}
              className="pixel-card block hover:brightness-110 transition-colors duration-80"
            >
              <div className="font-display text-[10px] mb-1" style={{ color: "var(--color-neon)" }}>
                {a.source ?? a.topic} · {a.topic}
              </div>
              <div className="font-body text-lg leading-tight">{a.title}</div>
              {a.description && (
                <div
                  className="font-body text-base mt-2"
                  style={{ color: "var(--color-muted-foreground)" }}
                >
                  {a.description}
                </div>
              )}
              <a
                href={a.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="pixel-btn variant-ghost text-[9px] mt-2 w-fit"
              >
                READ SOURCE
              </a>
            </article>
          ))}
      </div>
    </div>
  );
}
