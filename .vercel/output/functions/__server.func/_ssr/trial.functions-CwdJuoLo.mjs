import { c as createServerFn } from "./createServerFn-BFFE07zL.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-D_hiGrJN.mjs";
import { n as numberType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-MBa5GZ-L.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trial.functions-CwdJuoLo.js
/** Ensure today's 10 questions exist for the caller's occupation, then return them (without the correct index). */
var getDailyQuestions_createServerFn_handler = createServerRpc({
	id: "c31fe3ef3d878a9615f6e89eccbee0addcd044110e811c13a22e0248d7454fe5",
	name: "getDailyQuestions",
	filename: "src/lib/trial.functions.ts"
}, (opts) => getDailyQuestions.__executeServer(opts));
var getDailyQuestions = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getDailyQuestions_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: profile } = await supabase.from("profiles").select("occupation").eq("id", userId).maybeSingle();
	const occupation = profile?.occupation;
	if (!occupation) throw new Error("Complete onboarding first");
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const { data: attempt } = await supabase.from("daily_attempts").select("*").eq("user_id", userId).eq("attempt_date", today).maybeSingle();
	const { data: existing } = await supabase.from("daily_questions").select("id, order_index, question, choices").eq("occupation", occupation).eq("question_date", today).order("order_index");
	let questions = existing;
	if (!existing || existing.length < 10) {
		const generated = await generateQuestions(occupation);
		const { supabaseAdmin } = await import("./client.server-pv5dszoL.mjs");
		const rows = generated.map((q, i) => ({
			question_date: today,
			occupation,
			order_index: i,
			question: q.question,
			choices: q.choices,
			correct_index: q.correct_index
		}));
		await supabaseAdmin.from("daily_questions").upsert(rows, { onConflict: "question_date,occupation,order_index" });
		const { data: reread } = await supabase.from("daily_questions").select("id, order_index, question, choices").eq("occupation", occupation).eq("question_date", today).order("order_index");
		questions = reread;
	}
	return {
		occupation,
		today,
		completed: !!attempt?.completed,
		lastScore: attempt?.score ?? null,
		questions: (questions ?? []).map((q) => ({
			id: q.id,
			order_index: q.order_index,
			question: q.question,
			choices: q.choices
		}))
	};
});
var submitInput = objectType({ answers: arrayType(numberType().int().min(-1).max(3)).length(10) });
var submitDailyTrial_createServerFn_handler = createServerRpc({
	id: "0db76b542cdf515cec6a53ace1f6b03413ab76b2731678ab20dd3a45d1de1c9b",
	name: "submitDailyTrial",
	filename: "src/lib/trial.functions.ts"
}, (opts) => submitDailyTrial.__executeServer(opts));
var submitDailyTrial = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => submitInput.parse(d)).handler(submitDailyTrial_createServerFn_handler, async ({ data, context }) => {
	const { supabase, userId } = context;
	const { data: profile } = await supabase.from("profiles").select("occupation, wallet_points, weekly_points").eq("id", userId).maybeSingle();
	if (!profile?.occupation) throw new Error("No occupation");
	const occupation = profile.occupation;
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const { data: existingAttempt } = await supabase.from("daily_attempts").select("completed").eq("user_id", userId).eq("attempt_date", today).maybeSingle();
	if (existingAttempt?.completed) throw new Error("Already completed today");
	const { data: qs } = await supabase.from("daily_questions").select("order_index, correct_index").eq("occupation", occupation).eq("question_date", today).order("order_index");
	if (!qs || qs.length !== 10) throw new Error("Questions missing");
	let correct = 0;
	for (const q of qs) if (data.answers[q.order_index] === q.correct_index) correct++;
	const score = correct * 10;
	const weekStart = isoWeekStartServer(/* @__PURE__ */ new Date());
	const { data: existingWeek } = await supabase.from("daily_scores").select("week_start").eq("user_id", userId).order("score_date", { ascending: false }).limit(1).maybeSingle();
	const priorWeek = existingWeek?.week_start && existingWeek.week_start !== weekStart ? existingWeek.week_start : null;
	const { supabaseAdmin } = await import("./client.server-pv5dszoL.mjs");
	if (priorWeek) {
		const { data: top } = await supabaseAdmin.rpc("leaderboard_for", {
			occ: occupation,
			week: priorWeek
		});
		if (Array.isArray(top)) for (const row of top.slice(0, 10)) {
			const bonus = [
				200,
				120,
				80,
				50,
				40,
				30,
				25,
				20,
				15,
				10
			][row.rank - 1] ?? 5;
			await supabaseAdmin.from("weekly_awards").upsert({
				user_id: row.user_id,
				occupation,
				week_start: priorWeek,
				rank: row.rank,
				points_awarded: bonus
			}, { onConflict: "user_id,week_start,occupation" });
			await supabaseAdmin.rpc;
			await supabaseAdmin.from("profiles").update({ wallet_points: 0 }).eq("id", "00000000-0000-0000-0000-000000000000");
			const { data: p } = await supabaseAdmin.from("profiles").select("wallet_points").eq("id", row.user_id).maybeSingle();
			if (p) await supabaseAdmin.from("profiles").update({
				wallet_points: p.wallet_points + bonus,
				weekly_points: 0
			}).eq("id", row.user_id);
		}
		await supabaseAdmin.from("profiles").update({ weekly_points: 0 }).eq("occupation", occupation);
	}
	await supabaseAdmin.from("daily_scores").upsert({
		user_id: userId,
		occupation,
		score,
		score_date: today,
		week_start: weekStart
	}, { onConflict: "user_id,score_date" });
	await supabaseAdmin.from("daily_attempts").upsert({
		user_id: userId,
		attempt_date: today,
		score,
		completed: true
	}, { onConflict: "user_id,attempt_date" });
	await supabaseAdmin.from("profiles").update({
		wallet_points: profile.wallet_points + score,
		weekly_points: (profile.weekly_points ?? 0) + score
	}).eq("id", userId);
	return {
		score,
		correct,
		weekStart
	};
});
var getLeaderboard_createServerFn_handler = createServerRpc({
	id: "29fff5da6af31d00af77ec937b520bab841f00dfd01498109a529976e434d0d2",
	name: "getLeaderboard",
	filename: "src/lib/trial.functions.ts"
}, (opts) => getLeaderboard.__executeServer(opts));
var getLeaderboard = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(getLeaderboard_createServerFn_handler, async ({ context }) => {
	const { supabase, userId } = context;
	const { data: profile } = await supabase.from("profiles").select("occupation").eq("id", userId).maybeSingle();
	if (!profile?.occupation) return {
		rows: [],
		occupation: null
	};
	const weekStart = isoWeekStartServer(/* @__PURE__ */ new Date());
	const { data } = await supabase.rpc("leaderboard_for", {
		occ: profile.occupation,
		week: weekStart
	});
	return {
		rows: data ?? [],
		occupation: profile.occupation,
		weekStart
	};
});
function isoWeekStartServer(d) {
	const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
	const day = date.getUTCDay() || 7;
	if (day !== 1) date.setUTCDate(date.getUTCDate() - (day - 1));
	return date.toISOString().slice(0, 10);
}
async function generateQuestions(occupation) {
	const key = process.env.OPENROUTER_API_KEY;
	if (!key) throw new Error("OpenRouter key missing");
	const prompt = `Generate 10 multiple-choice quiz questions relevant to a professional working as a "${occupation}". Each question has exactly 4 choices and one correct answer. Return JSON:
{"items":[{"question":"...","choices":["A","B","C","D"],"correct_index":0}, ...]}
Difficulty: moderate. No trick questions. Cover different sub-topics.`;
	const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${key}`
		},
		body: JSON.stringify({
			model: "openai/gpt-4o-mini",
			messages: [{
				role: "user",
				content: prompt
			}],
			response_format: { type: "json_object" }
		})
	});
	if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
	const txt = (await res.json()).choices?.[0]?.message?.content ?? "{}";
	const items = (JSON.parse(txt).items ?? []).slice(0, 10);
	if (items.length !== 10) throw new Error("AI returned wrong number of questions");
	return items.map((it) => ({
		question: String(it.question),
		choices: (it.choices ?? []).slice(0, 4).map(String),
		correct_index: Math.max(0, Math.min(3, Number(it.correct_index ?? 0)))
	}));
}
//#endregion
export { getDailyQuestions_createServerFn_handler, getLeaderboard_createServerFn_handler, submitDailyTrial_createServerFn_handler };
