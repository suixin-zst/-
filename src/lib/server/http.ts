import { NextResponse } from "next/server";
import type { DbUser } from "./db";

export function publicUser(user: DbUser) {
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  };
}

export function jsonOk(data: Record<string, unknown> = {}): NextResponse {
  return NextResponse.json({ ok: true, ...data });
}

export function jsonError(
  message: string,
  status = 400,
  code = "BAD_REQUEST",
): NextResponse {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status },
  );
}

export function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function num(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
