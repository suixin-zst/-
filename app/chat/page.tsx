/**
 * 会话列表页（/chat）—— 左侧全部会话，右侧引导选一个
 *
 * /chat 与 /chat/[id] 共用 ConversationList；选中态由 [id] 页传入，
 * 不依赖 usePathname，避免列表在水合时闪一次。
 */

import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { loadConversations } from "@/lib/chat";
import { ConversationList } from "./conversation-list";

export const metadata = { title: "消息 · 台前" };

export default async function ChatIndexPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // middleware 已挡未登录；这里是类型收窄 + 兜底
  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <EmptyState title="请先登录" hint="登录后即可查看你的会话" />
      </div>
    );
  }

  const conversations = await loadConversations(supabase, user.id);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-display text-3xl font-semibold">消息</h1>
      <p className="mt-2 text-sm text-ink-soft">和对方直接聊，不加微信、不经过中介。</p>

      <div className="mt-6 grid gap-4 md:grid-cols-[20rem_1fr]">
        <ConversationList
          items={conversations}
          currentUserId={user.id}
          activeId={null}
        />

        <Card className="hidden min-h-[28rem] items-center justify-center md:flex">
          <div className="text-center">
            <p className="font-display text-lg font-semibold">选一个会话开始聊天</p>
            <p className="mt-2 text-sm text-ink-soft">左侧列出你参与的全部会话</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
