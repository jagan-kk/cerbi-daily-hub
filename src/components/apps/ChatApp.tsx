import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { randomRoomCode } from "@/lib/constants";
import type { Profile } from "@/hooks/useProfile";
import { toast } from "sonner";

type Msg = { id: string; user_id: string; username: string; body: string; created_at: string };

export function ChatApp({ profile }: { profile: Profile }) {
  const [code, setCode] = useState<string | null>(null);
  const [joinCode, setJoinCode] = useState("");

  if (!code) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="font-display text-lg" style={{ color: "var(--color-accent)" }}>
          THE TAVERN
        </h2>
        <p className="font-body text-lg" style={{ color: "var(--color-muted-foreground)" }}>
          Create a room and share the code, or join one with a code your friend gave you.
        </p>
        <div className="pixel-card">
          <div className="font-display text-[10px] mb-2">JOIN ROOM</div>
          <div className="flex gap-2">
            <input
              className="pixel-input font-display"
              placeholder="ABCD12"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase().slice(0, 6))}
              maxLength={6}
            />
            <button
              className="pixel-btn"
              onClick={async () => {
                if (joinCode.length !== 6) return toast.error("Codes are 6 characters");
                const { data } = await supabase
                  .from("chat_rooms")
                  .select("code")
                  .eq("code", joinCode)
                  .maybeSingle();
                if (!data) return toast.error("Room not found");
                setCode(joinCode);
              }}
            >
              JOIN
            </button>
          </div>
        </div>
        <div className="pixel-card">
          <div className="font-display text-[10px] mb-2">CREATE ROOM</div>
          <button
            className="pixel-btn variant-gold"
            onClick={async () => {
              const c = randomRoomCode();
              const { error } = await supabase
                .from("chat_rooms")
                .insert({ code: c, creator_id: profile.id });
              if (error) return toast.error(error.message);
              setCode(c);
            }}
          >
            NEW ROOM
          </button>
        </div>
      </div>
    );
  }

  return <ChatRoom code={code} profile={profile} onLeave={() => setCode(null)} />;
}

function ChatRoom({
  code,
  profile,
  onLeave,
}: {
  code: string;
  profile: Profile;
  onLeave: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;
    supabase
      .from("chat_messages")
      .select("*")
      .eq("room_code", code)
      .order("created_at", { ascending: true })
      .limit(200)
      .then(({ data }) => {
        if (mounted && data) setMessages(data as Msg[]);
      });
    const channel = supabase
      .channel(`room:${code}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `room_code=eq.${code}` },
        (payload) => {
          setMessages((m) => [...m, payload.new as Msg]);
        },
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [code]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setText("");
    const { error } = await supabase.from("chat_messages").insert({
      room_code: code,
      user_id: profile.id,
      username: profile.username,
      body,
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between p-2 border-b-2"
        style={{ borderColor: "oklch(0.08 0.02 260)" }}
      >
        <div className="font-display text-[11px]">
          ◆ ROOM <span style={{ color: "var(--color-accent)" }}>{code}</span>
        </div>
        <div className="flex gap-2">
          <button
            className="pixel-btn variant-ghost text-[9px]"
            onClick={() => {
              navigator.clipboard.writeText(code);
              toast.success("Code copied");
            }}
          >
            COPY CODE
          </button>
          <button className="pixel-btn variant-ghost text-[9px]" onClick={onLeave}>
            LEAVE
          </button>
        </div>
      </div>
      <div ref={listRef} className="flex-1 overflow-auto p-3 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="font-body text-lg leading-tight">
            <span
              className="font-display text-[9px] mr-2"
              style={{ color: m.user_id === profile.id ? "var(--color-accent)" : "var(--color-primary)" }}
            >
              {m.username}:
            </span>
            {m.body}
          </div>
        ))}
        {messages.length === 0 && (
          <div className="font-body text-lg" style={{ color: "var(--color-muted-foreground)" }}>
            No messages yet. Break the silence.
          </div>
        )}
      </div>
      <div className="p-2 flex gap-2 border-t-2" style={{ borderColor: "oklch(0.08 0.02 260)" }}>
        <input
          className="pixel-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder="say something..."
        />
        <button className="pixel-btn variant-gold" onClick={send}>
          SEND
        </button>
      </div>
    </div>
  );
}