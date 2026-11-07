"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";

type Mode = "login" | "register";
type Role = "host" | "merchant";

interface AuthUser {
  id: string;
  role: Role;
  name: string;
}

export function AuthForm({ next }: { next?: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("host");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function targetFor(userRole: Role): string {
    if (next && next.startsWith("/") && !next.startsWith("//")) {
      return next;
    }
    return userRole === "host" ? "/host/dashboard" : "/merchant/dashboard";
  }

  async function callAuth(path: string, body: Record<string, unknown>) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as {
      ok: boolean;
      user?: AuthUser;
      error?: { message?: string };
    };
    if (!response.ok || !data.ok || !data.user) {
      throw new Error(data?.error?.message || "操作失败，请重试。");
    }
    router.push(targetFor(data.user.role));
    router.refresh();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await callAuth("/api/auth/login", { email, password });
      } else {
        await callAuth("/api/auth/register", {
          email,
          password,
          name,
          role,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败，请重试。");
      setLoading(false);
    }
  }

  async function quickLogin(demoEmail: string) {
    setError("");
    setLoading(true);
    setMode("login");
    setEmail(demoEmail);
    setPassword("demo1234");
    try {
      await callAuth("/api/auth/login", {
        email: demoEmail,
        password: "demo1234",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "登录失败。");
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <aside className="auth-brand">
        <Link href="/" className="brand" aria-label="台前首页">
          <span className="brand-mark">台</span>
          <span className="brand-word">
            <strong>台前</strong>
            <span>TAIQIAN</span>
          </span>
        </Link>

        <div className="auth-quote">
          <span className="kicker">A STAGE FOR EVERY HOST</span>
          <h1 className="display-lg">好主持，<br />不该只在群里等活。</h1>
          <p>
            作品、报价、档期，一次讲清楚。
            <br />
            商家直接找到对的人，主持人直接接到对的活。
          </p>
        </div>

        <div className="auth-brand-foot">台前 TAIQIAN · 黑客松 2026</div>
      </aside>

      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === "login" ? "on" : ""}`}
              onClick={() => {
                setMode("login");
                setError("");
              }}
            >
              登录
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === "register" ? "on" : ""}`}
              onClick={() => {
                setMode("register");
                setError("");
              }}
            >
              注册
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {mode === "register" ? (
              <div className="field" style={{ marginTop: 0 }}>
                <label>
                  我是 <em>注册后不可更改</em>
                </label>
                <div className="chips">
                  <button
                    type="button"
                    className={`chip ${role === "host" ? "on" : ""}`}
                    onClick={() => setRole("host")}
                  >
                    我是主持人
                  </button>
                  <button
                    type="button"
                    className={`chip ${role === "merchant" ? "on" : ""}`}
                    onClick={() => setRole("merchant")}
                  >
                    我是商家
                  </button>
                </div>
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="auth-email">邮箱</label>
              <input
                id="auth-email"
                className="input"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            {mode === "register" ? (
              <div className="field">
                <label htmlFor="auth-name">
                  {role === "host" ? "姓名" : "公司名称"}
                </label>
                <input
                  id="auth-name"
                  className="input"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={role === "host" ? "例：林知遥" : "例：星野活动"}
                  required
                />
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="auth-password">密码</label>
              <input
                id="auth-password"
                className="input"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="至少 6 位"
                required
              />
            </div>

            {error ? <div className="error-text">{error}</div> : null}

            <div style={{ marginTop: 20 }}>
              <Button
                type="submit"
                variant="stage"
                block
                disabled={loading}
              >
                {loading
                  ? "请稍候…"
                  : mode === "login"
                    ? "登录"
                    : "创建账号"}
              </Button>
            </div>
          </form>

          <div className="auth-divider">
            <span>或使用演示账号</span>
          </div>

          <div className="auth-demo">
            <button
              type="button"
              onClick={() => quickLogin("merchant@taiqian.demo")}
              disabled={loading}
            >
              商家演示
            </button>
            <button
              type="button"
              onClick={() => quickLogin("lin-zhiyao@taiqian.demo")}
              disabled={loading}
            >
              主持人演示
            </button>
          </div>

          <p className="auth-note">
            演示账号密码均为 demo1234。登录后可发单、报名、聊天。
          </p>
        </div>
      </main>
    </div>
  );
}
