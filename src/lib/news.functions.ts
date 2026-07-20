import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const input = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  topics: z.array(z.string()).min(1).max(10),
});

type Article = {
  title: string;
  description: string | null;
  url: string | null;
  image_url: string | null;
  source: string | null;
  topic: string;
};

/**
 * Get news for a specific date and set of user interest topics.
 * - Serves cached rows from `news_articles` when present.
 * - Otherwise fetches from GNews API, then caches them.
 * - Also clears news_articles rows from previous months on first fetch each day.
 */
export const getNewsForDay = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => input.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { date, topics } = data;

    // Sweep older months (best-effort; ignore errors)
    const firstOfMonth = date.slice(0, 7) + "-01";
    await supabase.from("news_articles").delete().lt("article_date", firstOfMonth);

    // Check cache
    const { data: cached } = await supabase
      .from("news_articles")
      .select("*")
      .eq("article_date", date)
      .in("topic", topics);

    const cachedTopics = new Set((cached ?? []).map((r) => r.topic));
    const missing = topics.filter((t) => !cachedTopics.has(t));

    if (missing.length > 0) {
      const gnewsKey = process.env.GNEWS_API_KEY;
      if (!gnewsKey) return { articles: [] };
      for (const topic of missing) {
        try {
          let articles: Article[] = [];
          articles = await fetchGNews(gnewsKey, topic, date);
          if (articles.length > 0) {
            const rows = articles.slice(0, 8).map((a) => ({
              article_date: date,
              topic,
              title: a.title,
              description: a.description,
              url: a.url,
              image_url: a.image_url,
              source: a.source,
            }));
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("news_articles").insert(rows);
          }
        } catch (e) {
          console.error("News fetch failed for", topic, e);
        }
      }
    }

    const { data: final } = await supabase
      .from("news_articles")
      .select("*")
      .eq("article_date", date)
      .in("topic", topics)
      .order("created_at", { ascending: false });

    return { articles: final ?? [] };
  });

async function fetchGNews(key: string, topic: string, date: string): Promise<Article[]> {
  const from = `${date}T00:00:00Z`;
  const to = `${date}T23:59:59Z`;
  const url = `https://gnews.io/api/v4/top-headlines?category=${encodeURIComponent(
    topic,
  )}&lang=en&max=8&from=${from}&to=${to}&apikey=${key}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GNews ${res.status}`);
  const body: any = await res.json();
  return (body.articles ?? []).map((a: any) => ({
    title: a.title,
    description: a.description ?? null,
    url: a.url ?? null,
    image_url: a.image ?? null,
    source: a.source?.name ?? null,
    topic,
  }));
}

