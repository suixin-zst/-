import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * 404 页面 —— 从副手翻译，保留「台前」的剧场感文案
 */
export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-spotlight">404 · Off stage</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">这一幕，还没开场。</h1>
      <p className="mt-4 text-ink-soft">
        你找的页面可能已经下台，或者链接写错了。回首页重新找一条路。
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/">
          <Button>回首页</Button>
        </Link>
        <Link href="/host/gigs">
          <Button variant="ghost">去商单大厅</Button>
        </Link>
      </div>
    </main>
  );
}
