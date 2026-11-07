import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="brand">
              <span className="brand-mark">台</span>
              <span className="brand-word">
                <strong>台前</strong>
                <span>TAIQIAN</span>
              </span>
            </div>
            <p>
              主持人 × 商家直聘式撮合平台。作品说话，直接开聊，砍掉中间抽成。
            </p>
          </div>

          <div className="footer-col">
            <h4>平台</h4>
            <Link href="/merchant/hosts">找主持人</Link>
            <Link href="/host/gigs">找商单</Link>
            <Link href="/merchant/gig/new">发布商单</Link>
          </div>

          <div className="footer-col">
            <h4>角色</h4>
            <Link href="/host/gigs">主持人入驻</Link>
            <Link href="/merchant/hosts">商家入驻</Link>
            <Link href="/dev/ui">组件库 / 设计系统</Link>
          </div>

          <div className="footer-col">
            <h4>关于</h4>
            <Link href="/#how">怎么工作</Link>
            <Link href="/#trust">平台保障</Link>
            <Link href="/#roles">角色入口</Link>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 台前 TAIQIAN · 黑客松演示版本，页面数据均为虚构</span>
          <span>Next.js · Tailwind · Designed for the stage</span>
        </div>
      </div>
    </footer>
  );
}
