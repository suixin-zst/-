import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
  className?: string;
}

/** 全站空态统一组件：不许出现裸文字空态（UI 底线） */
export function EmptyState({ icon, title, hint, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-line bg-card px-6 py-16 text-center",
        className
      )}
    >
      {icon ? <div className="mb-4 text-3xl text-spotlight">{icon}</div> : null}
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {hint ? <p className="mt-2 max-w-sm text-sm text-ink-soft">{hint}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
