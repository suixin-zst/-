import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  signSession,
  verifyPassword,
} from "@/lib/server/auth";
import { getUserByEmail } from "@/lib/server/db";
import { jsonError, publicUser, str } from "@/lib/server/http";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = str(body.email).toLowerCase();
    const password = str(body.password);

    const user = await getUserByEmail(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return jsonError("邮箱或密码不正确。", 401, "INVALID_CREDENTIALS");
    }

    const response = NextResponse.json({ ok: true, user: publicUser(user) });
    response.cookies.set(
      SESSION_COOKIE,
      signSession(user.id),
      SESSION_COOKIE_OPTIONS,
    );
    return response;
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "登录失败。",
      500,
      "INTERNAL",
    );
  }
}
