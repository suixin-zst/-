/**
 * 标签 Tag —— 比 Badge 更轻量，多色调
 *
 * 和 Badge 的区别：Tag 用于列表项内的小标签（如「婚礼」「路演」），
 * Badge 用于状态/角色等语义更重的场景
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TagTone = "default" | "spotlight" | "gold" | "jade" | "ink";

export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: TagTone;
  className?: string;
}) {
  const toneClasses: Record<TagTone, string> = {
    default: "bg-paper-2 text-ink-soft",
    spotlight: "bg-spotlight-tint text-spotlight-deep",
    gold: "bg-gold-tint text-gold-deep",
    jade: "bg-jade-soft text-jade-deep",
    ink: "bg-line text-ink",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
