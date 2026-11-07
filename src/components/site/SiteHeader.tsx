import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { getSessionUser } from "@/lib/session";
import { LogoutButton } from "./LogoutButton";

export async function SiteHeader() {
  const user = await getSessionUser();
  const dashboard = user
    ? user.role === "host"
      ? "/host/dashboard"
      : "/merchant/dashboard"
    : "/auth";

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link href="/" className="brand" aria-label="台前首页">
          <span className="brand-mark">台</span>
          <span className="brand-word">
            <strong>台前</strong>
            <span>TAIQIAN</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="主导航">
          <Link href="/merchant/hosts" className="nav-link">
            找主持人
          </Link>
          <Link href="/host/gigs" className="nav-link">
            找商单
          </Link>
          <Link href="/#how" className="nav-link">
            怎么工作
          </Link>
        </nav>

        <div className="nav-actions">
          {user ? (
            <>
              <Link
                href={dashboard}
                className={`role-pill ${user.role}`}
                title="进入工作台"
              >
                <span className="dot" />
                {user.name}
              </Link>
              <LogoutButton />
              <Button
                href={
                  user.role === "host"
                    ? "/host/dashboard"
                    : "/merchant/gig/new"
                }
                size="sm"
              >
                {user.role === "host" ? "我的工作台" : "发布商单"}
              </Button>
            </>
          ) : (
            <>
              <Link href="/host/gigs" className="role-pill host">
                <span className="dot" />
                我是主持人
              </Link>
              <Link href="/merchant/hosts" className="role-pill merchant">
                <span className="dot" />
                我是商家
              </Link>
              <Button href="/auth" size="sm">
                登录 / 注册
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
