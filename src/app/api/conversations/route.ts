import { NextResponse } from "next/server";
import { listConversationsForUser } from "@/lib/server/db";
import { jsonError, publicUser } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return jsonError("请先登录。", 401, "UNAUTHORIZED");

  const rows = await listConversationsForUser(user.id);
  return NextResponse.json({
    ok: true,
    conversations: rows.map((row) => ({
      id: row.conversation.id,
      gig_id: row.conversation.gig_id,
      created_at: row.conversation.created_at,
      host: publicUser(row.host),
      merchant: publicUser(row.merchant),
      gig: row.gig ?? null,
      lastMessage: row.lastMessage ?? null,
    })),
  });
}
