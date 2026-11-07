import { NextResponse } from "next/server";
import {
  getApplication,
  updateApplicationStatus,
} from "@/lib/server/db";
import { jsonError, str } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUser();
  if (!user) return jsonError("请先登录。", 401, "UNAUTHORIZED");

  const { id } = await params;
  const application = await getApplication(id);
  if (!application) return jsonError("报名记录不存在。", 404, "NOT_FOUND");
  if (application.merchant_id !== user.id) {
    return jsonError("无权处理这条报名。", 403, "FORBIDDEN");
  }

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const status = str(body.status);
    if (status !== "accepted" && status !== "rejected") {
      return jsonError("状态只能是 accepted 或 rejected。");
    }

    const updated = await updateApplicationStatus(id, status);
    return NextResponse.json({ ok: true, application: updated });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "操作失败。",
      500,
      "INTERNAL",
    );
  }
}
