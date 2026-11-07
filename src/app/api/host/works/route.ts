import { NextResponse } from "next/server";
import { addWork, type DbWork } from "@/lib/server/db";
import { jsonError, str } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("未登录。", 401, "UNAUTHORIZED");
  if (user.role !== "host") return jsonError("只有主持人可以添加作品。", 403);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const title = str(body.title);
    const type = str(body.type);
    const url = str(body.url);
    const duration = str(body.duration);

    if (!title) return jsonError("请填写作品标题。");
    if (!["video", "image", "audio"].includes(type)) {
      return jsonError("作品类型不正确。");
    }
    if (!url) return jsonError("请上传文件或填写作品链接。");

    const work = await addWork(user.id, {
      title,
      type: type as DbWork["type"],
      url,
      duration: duration || "新上传",
    });
    return NextResponse.json({ ok: true, work });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "添加作品失败。",
      500,
      "INTERNAL",
    );
  }
}
