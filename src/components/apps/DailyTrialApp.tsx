import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDailyQuestions, submitDailyTrial, getLeaderboard } from "@/lib/trial.functions";
import type { Profile } from "@/hooks/useProfile";
import { toast } from "sonner";

export function DailyTrialApp({ profile }: { profile: Profile }) {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["daily-questions"],
    queryFn: () => getDailyQuestions(),
  });
  const lb = useQuery({
    queryKey: ["leaderboard"],
    queryFn: () => getLeaderboard(),
  });

  const [phase, setPhase] = useState<"intro" | "playing" | "done">("intro");
  const [answers, setAnswers] = useState<number[]>(Array(10).fill(-1));
  const [idx, setIdx] = useState(0);
  const [remaining, setRemaining] = useState(15);
  const [result, setResult] = useState<{ score: number; correct: number } | null>(null);

  const submit = useMutation({
    mutationFn: (ans: number[]) => submitDailyTrial({ data: { answers: ans } }),
    onSuccess: (res: any) => {
      setResult({ score: res.score, correct: res.correct });
      setPhase("done");
      qc.invalidateQueries({ queryKey: ["profile"] });
      qc.invalidateQueries({ queryKey: ["leaderboard"] });
      qc.invalidateQueries({ queryKey: ["daily-questions"] });
      toast.success(`+${res.score} points`);
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    setRemaining(15);
    const start = Date.now();
    const interval = setInterval(() => {
      const left = 15 - Math.floor((Date.now() - start) / 1000);
      setRemaining(Math.max(0, left));
      if (left <= 0) {
        clearInterval(interval);
        goNext(-1);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [idx, phase]);

  function pick(choice: number) {
    goNext(choice);
  }
  function goNext(choice: number) {
    const next = [...answers];
    next[idx] = choice;
    setAnswers(next);
    if (idx >= 9) {
      submit.mutate(next);
      setPhase("done");
    } else {
      setIdx(idx + 1);
    }
  }

  if (q.isLoading)
    return (
      <div
        className="p-6 font-display text-lg animate-pixel-pulse"
        style={{ color: "var(--color-neon)" }}
      >
        Preparing trial…
      </div>
    );
  if (q.error)
    return (
      <div className="p-6 font-body text-lg" style={{ color: "var(--color-blood)" }}>
        {(q.error as Error).message}
      </div>
    );
  if (!q.data) return null;

  const questions = q.data.questions;

  if (q.data.completed && phase === "intro") {
    return (
      <div className="app-window p-6 gap-4">
        <div className="app-header">
          <div className="app-title" style={{ color: "var(--color-neon)" }}>
            DAILY TRIAL
          </div>
          <div className="font-body text-xl">You already conquered today's trial.</div>
        </div>
        <div className="app-body gap-4">
          <div className="font-body text-lg">
            Score: <b style={{ color: "var(--color-neon)" }}>{q.data.lastScore}</b>
          </div>
          <Leaderboard data={lb.data} profileId={profile.id} />
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="app-window p-6 gap-4">
        <div className="app-header">
          <div className="app-title" style={{ color: "var(--color-neon)" }}>
            DAILY TRIAL
          </div>
          <div className="font-body text-lg space-y-1">
            <div>
              Class: <b>{q.data.occupation}</b>
            </div>
            <div>
              Questions: <b>10</b> · Time each: <b>15s</b>
            </div>
            <div>+10 points per correct answer. Weekly rankings reset every Monday.</div>
          </div>
        </div>
        <div className="app-body gap-4">
          <button className="pixel-btn variant-gold w-full" onClick={() => setPhase("playing")}>
            BEGIN
          </button>
          <Leaderboard data={lb.data} profileId={profile.id} />
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="app-window p-6 gap-4">
        <div className="app-header">
          <div className="app-title" style={{ color: "var(--color-neon)" }}>
            RESULTS
          </div>
        </div>
        <div className="app-body gap-4">
          {submit.isPending && (
            <div className="font-display text-lg animate-pixel-pulse">Tallying…</div>
          )}
          {result && (
            <>
              <div className="font-body text-2xl">
                {result.correct} / 10 correct —{" "}
                <b style={{ color: "var(--color-neon)" }}>+{result.score} pts</b>
              </div>
            </>
          )}
          <Leaderboard data={lb.data} profileId={profile.id} />
        </div>
      </div>
    );
  }

  const cur = questions[idx];
  return (
    <div className="app-window p-6 gap-4">
      <div className="app-header">
        <div className="flex items-center justify-between">
          <div className="font-display text-[11px]">Q {idx + 1} / 10</div>
          <div
            className="font-display text-[14px]"
            style={{ color: remaining <= 5 ? "var(--color-blood)" : "var(--color-neon)" }}
          >
            {remaining}s
          </div>
        </div>
      </div>
      <div className="app-body gap-4">
        <div className="pixel-card">
          <div className="font-body text-xl leading-tight">{cur.question}</div>
        </div>
        <div className="grid gap-2">
          {cur.choices.map((c: string, i: number) => (
            <button key={i} className="pixel-btn text-left w-full" onClick={() => pick(i)}>
              {String.fromCharCode(65 + i)}. {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Leaderboard({ data, profileId }: { data: any; profileId: string }) {
  if (!data) return null;
  const rows = data.rows ?? [];
  return (
    <div className="pixel-card mt-4">
      <div className="font-display text-[10px] mb-2" style={{ color: "var(--color-neon)" }}>
        WEEKLY RANKINGS — {data.occupation ?? "?"}
      </div>
      {rows.length === 0 && <div className="pixel-empty">No scores yet this week.</div>}
      <ol className="space-y-1">
        {rows.map((r: any) => (
          <li
            key={r.user_id}
            className="flex justify-between font-body text-lg"
            style={{ color: r.user_id === profileId ? "var(--color-neon)" : undefined }}
          >
            <span>
              #{r.rank} {r.username}
            </span>
            <span>{r.total_score}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
