import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D_hiGrJN.mjs";
import { i as stringType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/news.functions-CFygtXOF.js
var input = objectType({
	date: stringType().regex(/^\d{4}-\d{2}-\d{2}$/),
	topics: arrayType(stringType()).min(1).max(10)
});
/**
* Get news for a specific date and set of user interest topics.
* - Serves cached rows from `news_articles` when present.
* - Otherwise fetches from GNews API, then caches them.
* - Also clears news_articles rows from previous months on first fetch each day.
*/
var getNewsForDay_createServerFn_handler = createServerRpc({
	id: "a1be1efbada04e9518d46f29bd7912b8a2ae8718ee3c23a3322826f7f3202549",
	name: "getNewsForDay",
	filename: "src/lib/news.functions.ts"
}, (opts) => getNewsForDay.__executeServer(opts));
var getNewsForDay = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => input.parse(d)).handler(getNewsForDay_createServerFn_handler, async ({ data, context }) => {
	const { supabase } = context;
	const { date, topics } = data;
	const firstOfMonth = date.slice(0, 7) + "-01";
	await supabase.from("news_articles").delete().lt("article_date", firstOfMonth);
	const { data: cached } = await supabase.from("news_articles").select("*").eq("article_date", date).in("topic", topics);
	const cachedTopics = new Set((cached ?? []).map((r) => r.topic));
	const missing = topics.filter((t) => !cachedTopics.has(t));
	if (missing.length > 0) {
		const gnewsKey = process.env.GNEWS_API_KEY;
		if (!gnewsKey) return { articles: [] };
		for (const topic of missing) try {
			let articles = [];
			articles = await fetchGNews(gnewsKey, topic, date);
			if (articles.length > 0) {
				const rows = articles.slice(0, 8).map((a) => ({
					article_date: date,
					topic,
					title: a.title,
					description: a.description,
					url: a.url,
					image_url: a.image_url,
					source: a.source
				}));
				const { supabaseAdmin } = await import("./client.server-pv5dszoL.mjs");
				await supabaseAdmin.from("news_articles").insert(rows);
			}
		} catch (e) {
			console.error("News fetch failed for", topic, e);
		}
	}
	const { data: final } = await supabase.from("news_articles").select("*").eq("article_date", date).in("topic", topics).order("created_at", { ascending: false });
	return { articles: final ?? [] };
});
async function fetchGNews(key, topic, date) {
	const from = `${date}T00:00:00Z`;
	const to = `${date}T23:59:59Z`;
	const url = `https://gnews.io/api/v4/top-headlines?category=${encodeURIComponent(topic)}&lang=en&max=8&from=${from}&to=${to}&apikey=${key}`;
	const res = await fetch(url);
	if (!res.ok) throw new Error(`GNews ${res.status}`);
	return ((await res.json()).articles ?? []).map((a) => ({
		title: a.title,
		description: a.description ?? null,
		url: a.url ?? null,
		image_url: a.image ?? null,
		source: a.source?.name ?? null,
		topic
	}));
}
//#endregion
export { getNewsForDay_createServerFn_handler };
