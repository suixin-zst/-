import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { jsonError } from "@/lib/server/http";
import { getSessionUser } from "@/lib/session";

const MAX_SIZE = 25 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
};

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return jsonError("未登录。", 401, "UNAUTHORIZED");

  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return jsonError("请选择文件。");
    }
    if (file.size > MAX_SIZE) {
      return jsonError("文件不能超过 25MB。", 413, "TOO_LARGE");
    }
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/") && !file.type.startsWith("audio/")) {
      return jsonError("只支持图片、视频或音频。", 415, "UNSUPPORTED_TYPE");
    }

    const ext =
      EXT_BY_TYPE[file.type] ||
      (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
    const safeExt = ext.slice(0, 8) || "bin";
    const dir = path.join(process.cwd(), "public", "uploads", user.id);
    await fs.mkdir(dir, { recursive: true });

    const filename = `${crypto.randomUUID()}.${safeExt}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(dir, filename), buffer);

    const url = `/uploads/${user.id}/${filename}`;
    return NextResponse.json({ ok: true, url });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "上传失败。",
      500,
      "INTERNAL",
    );
  }
}
