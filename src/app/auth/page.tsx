import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { getSessionUser } from "@/lib/session";

export const metadata: Metadata = {
  title: "登录 / 注册 · 台前 TAIQIAN",
  description: "主持人注册、商家注册，进入自己的台前。",
};

function safeNext(next?: string): string | undefined {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return undefined;
  }
  return next;
}

export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getSessionUser();

  if (user) {
    redirect(
      safeNext(next) ??
        (user.role === "host" ? "/host/dashboard" : "/merchant/dashboard"),
    );
  }

  return (
    <main className="auth-page">
      <AuthForm next={safeNext(next)} />
    </main>
  );
}
