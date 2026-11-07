import type { Metadata } from "next";
import { ChatShell } from "@/components/chat/ChatShell";
import { Button } from "@/components/ui/Button";
import { getHostProfile, listConversationsForUser } from "@/lib/server/db";
import { requireUser } from "@/lib/session";
import type { Tone } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "站内会话 · 台前 TAIQIAN",
  description: "和商家 / 主持人直接沟通，不交换手机号。",
};

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string }>;
}) {
  const user = await requireUser();
  const rows = await listConversationsForUser(user.id);
  const hostProfiles = await Promise.all(
    rows.map((row) => getHostProfile(row.host.id)),
  );

  const conversations = rows.map((row, index) => {
    const isHost = user.role === "host";
    const other = isHost ? row.merchant : row.host;
    return {
      id: row.conversation.id,
      otherName: other.name,
      otherRole: (isHost ? "merchant" : "host") as "host" | "merchant",
      otherTone: (isHost
        ? "ink"
        : hostProfiles[index]?.tone ?? "sand") as Tone,
      gigTitle: row.gig?.title,
      lastMessage: row.lastMessage?.content,
      updatedAt:
        row.lastMessage?.created_at ?? row.conversation.created_at,
    };
  });

  const { c } = await searchParams;
  const initialId =
    c && conversations.some((conversation) => conversation.id === c)
      ? c
      : conversations[0]?.id;

  return (
    <main>
      <section className="container dashboard-head">
        <div>
          <span className="eyebrow">Messages</span>
          <h1 className="display-lg dashboard-title">站内会话</h1>
          <p className="page-sub">
            直接聊清流程和报价，不交换手机号。消息每 2 秒自动刷新。
          </p>
        </div>
        <div className="action-row">
          <Button
            href={user.role === "host" ? "/host/gigs" : "/merchant/hosts"}
            variant="ghost"
          >
            {user.role === "host" ? "去商单大厅" : "去找主持人"}
          </Button>
          <Button
            href={
              user.role === "host"
                ? "/host/dashboard"
                : "/merchant/dashboard"
            }
            variant="ghost"
          >
            返回工作台
          </Button>
        </div>
      </section>

      <section className="container chat-page">
        <ChatShell
          userId={user.id}
          conversations={conversations}
          initialId={initialId}
        />
      </section>
    </main>
  );
}
