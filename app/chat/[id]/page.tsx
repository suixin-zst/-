/**
 * 会话详情页（/chat/[id]）—— 左列表 + 右聊天窗
 *
 * 服务端把首屏消息一次性取好传进 ChatPane，
 * 之后的新消息由客户端的 Realtime 订阅（或轮询兜底）追加。
 */

import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadConversation, loadConversations } from "@/lib/chat";
import { ConversationList } from "../conversation-list";
import { ChatPane } from "../chat-pane";

export const metadata = { title: "会话 · 台前" };

export default async function ChatDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) notFound();

  const [conversation, conversations] = await Promise.all([
    loadConversation(supabase, id, user.id),
    loadConversations(supabase, user.id),
  ]);

  // 非参与方或会话不存在 —— 直接 404，不暴露「这个 id 存在但你无权看」
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
