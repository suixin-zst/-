/**
 * 会话详情页（/chat/[id]）—— 左列表 + 右聊天窗
 *
 * 服务端把首屏消息一次性取好传进 ChatPane，
 * 之后的新消息由客户端的 Realtime 订阅（或轮询兜底）追加。
 *
 * demo 会话 id 时渲染静态 demo 聊天界面
 */

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadConversation, loadConversations } from "@/lib/chat";
import { ConversationList } from "../conversation-list";
import { ChatPane } from "../chat-pane";
import { DemoChatPane } from "../demo-chat-pane";
import { demoConversations } from "@/lib/demo-data";

export const metadata = { title: "会话 · 台前" };

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // demo 会话走静态渲染
  if (id.startsWith("demo-conv-")) {
    const demoConv = demoConversations.find((c) => c.id === id);
    if (!demoConv) notFound();

    return (
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="font-display text-3xl font-semibold">消息</h1>
        <p className="mt-2 text-sm text-ink-soft">和对方直接聊，不加微信、不经过中介。</p>

        <div className="mt-6 grid gap-4 md:grid-cols-[20rem_1fr]">
          <div className="hidden md:block">
            <DemoConversationListSidebar activeId={id} />
          </div>
          <DemoChatPane conversation={demoConv} />
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const [conversation, conversations] = await Promise.all([
    loadConversation(supabase, id, user.id),
    loadConversations(supabase, user.id),
  ]);

  if (!conversation) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-display text-3xl font-semibold">消息</h1>
      <p className="mt-2 text-sm text-ink-soft">和对方直接聊，不加微信、不经过中介。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[20rem_1fr]">
        <div className="hidden md:block">
          <ConversationList
            items={conversations}
            currentUserId={user.id}
            activeId={conversation.id}
          />
        </div>

        <ChatPane conversation={conversation} currentUserId={user.id} />
      </div>
    </div>
  );
}

/** Demo 会话侧栏 */
function DemoConversationListSidebar({ activeId }: { activeId: string }) {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-card">
      {demoConversations.map((c, i) => {
        const active = c.id === activeId;
        const lastMsg = c.messages[c.messages.length - 1];
        return (
          <a
            key={c.id}
            href={`/chat/${c.id}`}
            className={`flex gap-3 px-4 py-3 transition-colors ${
              active ? "bg-spotlight-tint" : "hover:bg-paper"
            } ${i > 0 ? "border-t border-line" : ""}`}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-spotlight-tint font-display font-semibold text-spotlight-deep"
            >
              {c.peer.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-medium text-ink">{c.peer.name}</span>
                <span className="shrink-0 text-xs text-ink-soft">{lastMsg.time}</span>
              </div>
              <p className="mt-1 truncate text-sm text-ink-soft">
                {lastMsg.sender === "me" ? "我：" : ""}
                {lastMsg.content}
              </p>
            </div>
          </a>
        );
      })}
    </div>
  );
}
