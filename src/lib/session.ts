import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession } from "./server/auth";
import { getUserById, type DbUser } from "./server/db";

export async function getSessionUser(): Promise<DbUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const payload = verifySession(token);
  if (!payload) return null;

  return (await getUserById(payload.uid)) ?? null;
}

export async function requireUser(): Promise<DbUser> {
  const user = await getSessionUser();
  if (!user) redirect("/auth");
  return user;
}

export async function requireRole(
  role: "host" | "merchant",
): Promise<DbUser> {
  const user = await requireUser();
  if (user.role !== role) {
    redirect(
      user.role === "host" ? "/host/dashboard" : "/merchant/dashboard",
    );
  }
  return user;
}
