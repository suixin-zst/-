"use client";

import { useState, useRef, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Database } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // 用 ref 存定时器：state 在回调里读到的是旧闭包值，清不掉
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  function clearTimer() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 10 秒兜底：网络或 Supabase 无响应时不至于永远停在「登录中…」
    timeoutRef.current = setTimeout(() => {
      setError("登录超时，请检查网络或稍后重试");
      setLoading(false);
    }, 10000);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        clearTimer();
        setError("邮箱或密码不对，再检查一下");
        setLoading(false);
        return;
      }

      // 按角色分流进各自工作台；取档案失败不阻断登录，落到主持人端并留日志
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let role: "host" | "merchant" = "host";
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        if (error) {
          console.error("Failed to fetch profile:", error);
        } else if (data?.role === "merchant") {
          role = "merchant";
        }
      }

      clearTimer();
      router.push(role === "host" ? "/host/dashboard" : "/merchant/dashboard");
      router.refresh();
    } catch (err) {
      clearTimer();
      console.error("Login failed:", err);
      setError("网络错误，请稍后重试");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-center font-display text-3xl font-semibold">登录</h1>

      <Card className="mt-8">
        <form onSubmit={handleSubmit} className="space-y-5">
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
              required
            />
          </div>

          {error ? (
            <p className="rounded-card bg-spotlight-tint px-4 py-3 text-sm text-spotlight-deep">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "登录中…" : "登录"}
          </Button>
        </form>
      </Card>

      <p className="mt-6 text-center text-sm text-ink-soft">
        还没有账号？{" "}
        <Link href="/auth/signup" className="text-spotlight underline-offset-4 hover:underline">
          注册
        </Link>
      </p>
    </div>
  );
}
