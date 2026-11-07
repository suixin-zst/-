import { NextResponse } from "next/server";
import {
  createApplication,
  getGig,
  getUserById,
} from "@/lib/server/db";
import { jsonError, str } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("请先登录。", 401, "UNAUTHORIZED");

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const gigId = str(body.gigId);
    const hostId = str(body.hostId);
    const message = str(body.message);

    if (user.role === "host") {
      if (!gigId) return jsonError("缺少商单 ID。");
      const gig = await getGig(gigId);
      if (!gig) return jsonError("商单不存在。", 404, "NOT_FOUND");
      if (gig.status !== "open") {
        return jsonError("该商单已停止招募。", 409, "GIG_CLOSED");
      }

      const result = await createApplication({
        gig_id: gig.id,
        host_id: user.id,
        merchant_id: gig.merchant_id,
        initiator: "host",
        message: message || "您好，我想报名这场活动。",
      });

      return NextResponse.json({
        ok: true,
        application: result.application,
        conversationId: result.conversation.id,
      });
    }

    if (user.role === "merchant") {
      if (!hostId) return jsonError("缺少主持人 ID。");
      const host = await getUserById(hostId);
      if (!host || host.role !== "host") {
        return jsonError("主持人不存在。", 404, "NOT_FOUND");
      }

      if (gigId) {
        const gig = await getGig(gigId);
        if (!gig || gig.merchant_id !== user.id) {
          return jsonError("无权操作该商单。", 403, "FORBIDDEN");
        }
      }

      const result = await createApplication({
        gig_id: gigId || null,
        host_id: hostId,
        merchant_id: user.id,
        initiator: "merchant",
        message: message || "您好，想邀请您合作一场活动。",
      });

      return NextResponse.json({
        ok: true,
        application: result.application,
        conversationId: result.conversation.id,
      });
    }

    return jsonError("当前角色不能发起报名或邀约。", 403, "FORBIDDEN");
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "操作失败。",
      500,
      "INTERNAL",
    );
  }
}
