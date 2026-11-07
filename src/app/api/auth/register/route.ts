import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  signSession,
} from "@/lib/server/auth";
import { createUser, getUserByEmail } from "@/lib/server/db";
import { jsonError, publicUser, str } from "@/lib/server/http";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = str(body.email).toLowerCase();
    const password = str(body.password);
    const name = str(body.name);
    const role = str(body.role);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError("请输入有效邮箱。");
    }
    if (password.length < 6) {
      return jsonError("密码至少 6 位。");
    }
    if (!name) {
      return jsonError("请填写名称。");
    }
    if (role !== "host" && role !== "merchant") {
      return jsonError("请选择「主持人」或「商家」。");
    }
    if (await getUserByEmail(email)) {
      return jsonError("该邮箱已注册。", 409, "EMAIL_TAKEN");
    }

    const user = await createUser({ email, password, name, role });
    const response = NextResponse.json({ ok: true, user: publicUser(user) });
    response.cookies.set(
      SESSION_COOKIE,
      signSession(user.id),
      SESSION_COOKIE_OPTIONS,
    );
    return response;
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "注册失败。",
      500,
      "INTERNAL",
    );
  }
}
