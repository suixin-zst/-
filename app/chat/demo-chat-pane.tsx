"use client";

/**
 * Demo 聊天窗 —— 静态展示 demo 会话内容
 *
 * 不连接 Supabase，不订阅 Realtime，纯展示用
 */

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { DemoConversation } from "@/lib/demo-data";

interface Props {
  conversation: DemoConversation;
}

export function DemoChatPane({ conversation }: Props) {
  const [messages, setMessages] = useState(conversation.messages);
  const [draft, setDraft] = useState("");

  function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const content = draft.trim();
    if (!content) return;

    setMessages((prev) => [
      ...prev,
      { sender: "me" as const, content, time: "刚刚" },
    ]);
    setDraft("");
  }

  return (
    <div className="flex min-h-[28rem] flex-col overflow-hidden rounded-card border border-line bg-card md:h-[32rem]">
      {/* 会话头 */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Avatar name={conversation.peer.name} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-medium text-ink">{conversation.peer.name}</p>
          <p className="truncate text-xs text-ink-soft">
            {conversation.gigTitle ? `关于：${conversation.gigTitle}` : "直接沟通"}
          </p>
        </div>
      </div>

      {/* 消息区 */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => {
          const mine = m.sender === "me";
          return (
            <div key={i} className={cn("flex", mine ? "justify-end" : "justify-start")}>
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
                  {m.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 输入区 */}
      <form onSubmit={handleSend} className="border-t border-line px-4 py-3">
        <div className="flex gap-2">
          <Input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="输入消息…"
          />
          <Button type="submit" disabled={!draft.trim()}>
            发送
          </Button>
        </div>
      </form>
    </div>
  );
}
