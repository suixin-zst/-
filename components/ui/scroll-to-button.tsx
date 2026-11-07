"use client";

/**
 * 滚动到页面锚点按钮 —— 从 Server Component 抽出来的交互组件
 */
export function ScrollToButton({
  targetId,
  children,
}: {
  targetId: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-line bg-card px-5 text-sm font-medium text-ink transition-colors hover:border-spotlight hover:text-spotlight"
    >
      {children}
    </button>
  );
}
