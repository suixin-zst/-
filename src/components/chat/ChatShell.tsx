"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Tone } from "@/lib/types";

interface ChatConversation {
  id: string;
  otherName: string;
  otherRole: "host" | "merchant";
  otherTone: Tone;
  gigTitle?: string;
  lastMessage?: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

function timeLabel(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("zh-CN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ChatShell({
  userId,
  conversations,
  initialId,
}: {
  userId: string;
  conversations: ChatConversation[];
  initialId?: string;
}) {
  const [selectedId, setSelectedId] = useState<string | undefined>(initialId);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(Boolean(initialId));
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const lastTs = useRef("");
  const bodyRef = useRef<HTMLDivElement | null>(null);

  const selected = conversations.find((item) => item.id === selectedId);

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch(
          `/api/conversations/${selectedId}/messages`,
        );
        const data = (await response.json()) as {
          ok: boolean;
          messages?: ChatMessage[];
          error?: { message?: string };
        };
        if (!response.ok || !data.ok || !data.messages) {
          throw new Error(data?.error?.message || "加载会话失败。");
        }
        if (cancelled) return;
        setMessages(data.messages);
        lastTs.current = data.messages.at(-1)?.created_at ?? "";
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "加载会话失败。");
        setLoading(false);
      }
    }

    load();

    const timer = window.setInterval(async () => {
      try {
        const query = lastTs.current
          ? `?after=${encodeURIComponent(lastTs.current)}`
          : "";
        const response = await fetch(
          `/api/conversations/${selectedId}/messages${query}`,
        );
        const data = (await response.json()) as {
          ok: boolean;
          messages?: ChatMessage[];
        };
        if (!response.ok || !data.ok || !data.messages?.length) return;
        setMessages((prev) => {
          const known = new Set(prev.map((message) => message.id));
          const fresh = data.messages!.filter(
            (message) => !known.has(message.id),
          );
          if (!fresh.length) return prev;
          lastTs.current = fresh[fresh.length - 1].created_at;
          return [...prev, ...fresh];
        });
      } catch {
        // 轮询失败时不打断当前会话，下一轮再试
      }
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [selectedId]);

  useEffect(() => {
    const body = bodyRef.current;
    if (body) {
      body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });
    }
  }, [messages.length]);

  function selectConversation(id: string) {
    if (id === selectedId) return;
    setSelectedId(id);
    setMessages([]);
    setLoading(true);
    setError("");
    lastTs.current = "";
  }

  async function send() {
    if (!selectedId || !draft.trim() || sending) return;
    setSending(true);
    setError("");
    try {
      const response = await fetch(
        `/api/conversations/${selectedId}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: draft }),
        },
      );
      const data = (await response.json()) as {
        ok: boolean;
        message?: ChatMessage;
        error?: { message?: string };
      };
      if (!response.ok || !data.ok || !data.message) {
        throw new Error(data?.error?.message || "发送失败。");
      }
      setMessages((prev) => [...prev, data.message!]);
      lastTs.current = data.message.created_at;
      setDraft("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "发送失败。");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="chat-layout">
      <aside className="chat-side">
        <div className="chat-side-head">
          CONVERSATIONS · {conversations.length}
        </div>
        {conversations.length ? (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={`conv-item ${
                conversation.id === selectedId ? "on" : ""
              }`}
              onClick={() => selectConversation(conversation.id)}
            >
              <Avatar
                name={conversation.otherName}
                tone={conversation.otherTone}
                size={34}
              />
              <div className="conv-main">
                <div className="conv-name">
                  <span>{conversation.otherName}</span>
                  <span className="conv-time">
                    {timeLabel(conversation.updatedAt)}
                  </span>
                </div>
                <div className="conv-preview">
                  {conversation.gigTitle
                    ? `${conversation.gigTitle} · `
                    : ""}
                  {conversation.lastMessage ?? "开始对话"}
                </div>
              </div>
            </button>
          ))
        ) : (
          <div className="chat-empty">还没有会话。</div>
        )}
      </aside>

      <section className="chat-main">
        {selected ? (
          <>
            <div className="chat-head">
              <div>
                <h2>{selected.otherName}</h2>
                <p>{selected.gigTitle ?? "直接沟通"}</p>
              </div>
              <span className="tag">
                {selected.otherRole === "host" ? "主持人" : "商家"}
              </span>
            </div>

            <div className="chat-body" ref={bodyRef}>
              {loading ? (
                <div className="chat-empty">加载中…</div>
              ) : messages.length ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`msg ${
                      message.sender_id === userId ? "mine" : "theirs"
                    }`}
                  >
                    <div className="msg-bubble">{message.content}</div>
                    <div className="msg-time">
                      {timeLabel(message.created_at)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="chat-empty">
                  还没有消息，先说一句吧。
                </div>
              )}
            </div>

            {error ? <div className="chat-error">{error}</div> : null}

            <div className="chat-composer">
              <textarea
                className="textarea"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
                placeholder="输入消息…（Enter 发送，Shift+Enter 换行）"
              />
              <Button
                variant="stage"
                onClick={send}
                disabled={sending || !draft.trim()}
              >
                {sending ? "发送中…" : "发送"}
              </Button>
            </div>
          </>
        ) : (
          <div className="chat-empty">
            从左侧选择一个会话，或者去商单大厅找一张商单。
          </div>
        )}
      </section>
    </div>
  );
}
