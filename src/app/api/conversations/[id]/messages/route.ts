import { NextResponse } from "next/server";
import {
  addMessage,
  getConversation,
  listMessages,
  type DbConversation,
} from "@/lib/server/db";
import { jsonError, str } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";

type Membership =
  | { error: string; status: number }
  | { conversation: DbConversation };

async function ensureMember(
  conversationId: string,
  userId: string,
): Promise<Membership> {
  const conversation = await getConversation(conversationId);
  if (!conversation) return { error: "会话不存在。", status: 404 };
  if (
    conversation.host_id !== userId &&
    conversation.merchant_id !== userId
  ) {
    return { error: "无权访问该会话。", status: 403 };
  }
  return { conversation };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return jsonError("请先登录。", 401, "UNAUTHORIZED");

  const { id } = await params;
  const membership = await ensureMember(id, user.id);
  if ("error" in membership) {
    return jsonError(membership.error, membership.status);
  }

  const url = new URL(request.url);
  const after = url.searchParams.get("after") || undefined;
  const messages = await listMessages(id, after);

  return NextResponse.json({ ok: true, messages });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return jsonError("请先登录。", 401, "UNAUTHORIZED");

  const { id } = await params;
  const membership = await ensureMember(id, user.id);
  if ("error" in membership) {
    return jsonError(membership.error, membership.status);
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const content = str(body.content);
    if (!content) return jsonError("消息不能为空。");
    if (content.length > 2000) return jsonError("消息不能超过 2000 字。");

    const message = await addMessage({
      conversation_id: id,
      sender_id: user.id,
      content,
    });
    return NextResponse.json({ ok: true, message });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "发送失败。",
      500,
      "INTERNAL",
    );
  }
}
