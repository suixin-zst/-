"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { Role } from "@/lib/types";

export function SignupForm({ initialRole }: { initialRole: Role }) {
  const router = useRouter();
  const [role, setRole] = useState<Role>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("请填写昵称");
      return;
    }
    if (password.length < 6) {
      setError("密码至少 6 位");
      return;
    }
    setLoading(true);

    // 注册即建档：name/role 写进 metadata，由 schema 里的触发器落库
    const supabase = createClient();
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name: name.trim(), role } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // session 为空 = 邮箱验证开着（demo 应当关闭，见 README）
    if (data.user && !data.session) {
      setError("注册成功，但需要邮箱验证。请到 Supabase 关闭 Confirm email（README 第 3 步）");
      setLoading(false);
      return;
    }

    router.push(role === "host" ? "/host/dashboard" : "/merchant/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-center font-display text-3xl font-semibold">注册</h1>
      <p className="mt-2 text-center text-sm text-ink-soft">选好身份，一分钟即可开始</p>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label>我是</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("host")}
                className={cn(
                  "rounded-card border px-4 py-3 text-left transition-colors",
                  role === "host"
                    ? "border-spotlight bg-spotlight-tint"
                    : "border-line bg-card hover:border-spotlight/50"
                )}
              >
                <span className="block font-medium">主持人</span>
                <span className="mt-0.5 block text-xs text-ink-soft">浏览商单 · 接活</span>
              </button>
              <button
                type="button"
                onClick={() => setRole("merchant")}
                className={cn(
                  "rounded-card border px-4 py-3 text-left transition-colors",
                  role === "merchant"
                    ? "border-spotlight bg-spotlight-tint"
                    : "border-line bg-card hover:border-spotlight/50"
                )}
              >
                <span className="block font-medium">商家</span>
                <span className="mt-0.5 block text-xs text-ink-soft">发布商单 · 找主持人</span>
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="name">昵称</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "host" ? "如：林晚秋" : "如：星驰汽车市场部"}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              required
            />
          </div>

          {error ? (
            <p className="rounded-card bg-spotlight-tint px-4 py-3 text-sm text-spotlight-deep">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "注册中…" : `注册为${role === "host" ? "主持人" : "商家"}`}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-soft">
        已有账号？{" "}
        <Link href="/auth/login" className="text-spotlight underline-offset-4 hover:underline">
          登录
        </Link>
      </p>
    </div>
  );
}
