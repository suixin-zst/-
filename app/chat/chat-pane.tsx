"use client";

/**
 * 聊天窗（右栏）—— 客户端组件，本项目技术密度最高的一块
 *
 * 数据流：
 *  1. 首次由服务端渲染传入 messages（所以刷新不闪空白）
 *  2. 客户端订阅 postgres_changes 的 INSERT 事件做实时追加
 *  3. 订阅失败/不灵时降级 3 秒轮询（契约里写明的兜底）
 *
 * 去重：Realtime 回推的消息和自己插入的消息可能重复，统一按 id 去重。
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatClock, formatDayDivider } from "@/lib/format";
import type { MessageRow } from "@/lib/types";
import type { ConversationDetail } from "@/lib/chat";

interface Props {
  conversation: ConversationDetail;
  currentUserId: string;
}

const POLL_INTERVAL_MS = 3000;
/** 首次订阅若 8 秒内没收到 SUBSCRIBED，就认为实时不可用，转轮询 */
const SUBSCRIBE_GRACE_MS = 8000;

export function ChatPane({ conversation, currentUserId }: Props) {
  const [messages, setMessages] = useState<MessageRow[]>(conversation.messages);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [realtimeOk, setRealtimeOk] = useState(false);

  // 用 ref 存，避免把 supabase client 放进依赖数组导致重复建连
  const clientRef = useRef<ReturnType<typeof createClient> | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const graceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 订阅状态用 ref 存一份：宽限计时器里要读最新值，读 state 会拿到闭包旧值
  const subscribedRef = useRef(false);

  const conversationId = conversation.id;

  /** 按 id 合并消息，天然去重 + 按时间排序 */
  const mergeMessages = useCallback((incoming: MessageRow[]) => {
    setMessages((prev) => {
      const byId = new Map(prev.map((m) => [m.id, m]));
      for (const m of incoming) byId.set(m.id, m);
      return Array.from(byId.values()).sort((a, b) =>
        a.created_at.localeCompare(b.created_at)
      );
    });
  }, []);

  /** 拉全量消息（轮询用；也用于订阅建立后的补齐） */
  const fetchAll = useCallback(async () => {
    const client = clientRef.current;
    if (!client) return;
    const { data } = await client
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    if (data) mergeMessages(data);
  }, [conversationId, mergeMessages]);

  // ---- 实时订阅 + 轮询兜底 ----
  useEffect(() => {
    const client = createClient();
    clientRef.current = client;

    const channel = client
      .channel(`chat:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          mergeMessages([payload.new as MessageRow]);
        }
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          subscribedRef.current = true;
          setRealtimeOk(true);
          // 订阅成功前后可能漏消息，补一次全量
          void fetchAll();
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          subscribedRef.current = false;
          setRealtimeOk(false);
        }
      });

    // 兜底：宽限期内没订阅成功就开轮询，保证消息一定能到
    graceTimerRef.current = setTimeout(() => {
      if (subscribedRef.current) return;
      if (pollTimerRef.current) return;
      pollTimerRef.current = setInterval(() => void fetchAll(), POLL_INTERVAL_MS);
    }, SUBSCRIBE_GRACE_MS);

    return () => {
      if (graceTimerRef.current) clearTimeout(graceTimerRef.current);
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      void client.removeChannel(channel);
      clientRef.current = null;
    };
  }, [conversationId, mergeMessages, fetchAll]);

  // 新消息进来滚到底
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);

    // 乐观插入：本地先造一条，成功后被真实记录按 id 覆盖
    const tempId = `temp-${Date.now()}`;
    const optimistic: MessageRow = {
      id: tempId,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setDraft("");

    const client = clientRef.current ?? createClient();
    const { data, error: insertError } = await client
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: currentUserId, content })
      .select("*")
      .single();

    if (insertError) {
      // 失败就把乐观那条撤掉，别让用户以为发出去了
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setDraft(content);
      setError("发送失败，请重试");
      setSending(false);
      return;
    }

    setMessages((prev) => prev.filter((m) => m.id !== tempId).concat(data));
    setSending(false);
  }

  const now = new Date();

  return (
    <div className="flex min-h-[28rem] flex-col overflow-hidden rounded-card border border-line bg-card md:h-[32rem]">
      {/* 会话头 */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Avatar src={conversation.peer.avatarUrl} name={conversation.peer.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{conversation.peer.name}</p>
          <p className="truncate text-xs text-ink-soft">
            {conversation.gigTitle ? `关于：${conversation.gigTitle}` : "直接沟通"}
          </p>
        </div>
        {!realtimeOk ? (
          <span className="ml-auto shrink-0 text-xs text-ink-soft/70">轮询中</span>
        ) : null}
      </div>

      {/* 消息区 */}
      <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink-soft">
            还没有消息，说点什么开始吧
          </p>
        ) : (
          messages.map((m, i) => {
            const mine = m.sender_id === currentUserId;
            const divider = formatDayDivider(m.created_at, i > 0 ? messages[i - 1].created_at : null, now);
            return (
              <div key={m.id}>
                {divider ? (
                  <p className="py-3 text-center text-xs text-ink-soft/70">{divider}</p>
                ) : null}
                <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
                  <div className="max-w-[75%]">
                    <div
                      className={cn(
                        "rounded-card px-4 py-2 text-sm",
                        mine
                          ? "bg-spotlight text-white"
                          : "border border-line bg-paper text-ink"
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words">{m.content}</p>
                    </div>
                    <p
                      className={cn(
                        "mt-0.5 text-[11px] text-ink-soft/70",
                        mine ? "text-right" : "text-left"
                      )}
                    >
                      {formatClock(m.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* 输入区 */}
      <form onSubmit={handleSend} className="border-t border-line px-4 py-3">
        {error ? <p className="mb-2 text-xs text-spotlight-deep">{error}</p> : null}
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="输入消息…"
            disabled={sending}
          />
          <Button type="submit" disabled={sending || !draft.trim()}>
            {sending ? "发送中" : "发送"}
          </Button>
        </div>
      </form>
    </div>
  );
}
