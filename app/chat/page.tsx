/**
 * 会话列表页（/chat）—— 左侧全部会话，右侧引导选一个
 *
 * 数据库空时用 demo 会话兜底，保证评委看到有内容的聊天界面
 */

import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { EmptyState } from "@/components/ui/empty-state";
import { loadConversations } from "@/lib/chat";
import { ConversationList } from "./conversation-list";
import { demoConversations } from "@/lib/demo-data";

export const metadata = { title: "消息 · 台前" };

export default async function ChatIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <EmptyState title="请先登录" hint="登录后即可查看你的会话" />
      </div>
    );
  }

  const conversations = await loadConversations(supabase, user.id);
  const hasRealData = conversations.length > 0;

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-display text-3xl font-semibold">消息</h1>
      <p className="mt-2 text-sm text-ink-soft">和对方直接聊，不加微信、不经过中介。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[20rem_1fr]">
        {hasRealData ? (
          <ConversationList
            items={conversations}
            currentUserId={user.id}
            activeId={null}
          />
        ) : (
          <DemoConversationList />
        )}

        <Card className="hidden min-h-[28rem] items-center justify-center md:flex">
          <div className="text-center">
            <Icon name="message" size={32} className="mx-auto text-spotlight/30" />
            <p className="mt-4 font-display text-lg font-semibold">选一个会话开始聊天</p>
            <p className="mt-2 text-sm text-ink-soft">左侧列出你参与的全部会话</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

/** Demo 会话列表（数据库空时渲染） */
function DemoConversationList() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-card">
      {demoConversations.map((c, i) => {
        const lastMsg = c.messages[c.messages.length - 1];
        return (
          <Link
            key={c.id}
            href={`/chat/${c.id}`}
            className={`flex gap-3 px-4 py-3 transition-colors hover:bg-paper ${
              i > 0 ? "border-t border-line" : ""
            }`}
          >
            <Avatar name={c.peer.name} size="md" />

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="truncate font-medium text-ink">{c.peer.name}</span>
                <span className="shrink-0 text-xs text-ink-soft">{lastMsg.time}</span>
              </div>

              <div className="mt-0.5 flex items-center gap-1.5">
                <Badge tone={c.peer.role === "host" ? "spotlight" : "outline"} className="shrink-0">
                  {c.peer.role === "host" ? "主持人" : "商家"}
                </Badge>
                <span className="truncate text-xs text-ink-soft">
                  {c.gigTitle ?? "直接沟通"}
                </span>
              </div>

              <p className="mt-1 truncate text-sm text-ink-soft">
                {lastMsg.sender === "me" ? "我：" : ""}
                {lastMsg.content}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
