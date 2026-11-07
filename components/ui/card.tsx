import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** 基础卡片容器；标题直接用 h* + font-display，不另设组件 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-line bg-card p-5",
        "shadow-[0_1px_2px_rgba(21,17,14,0.04),0_16px_34px_-28px_rgba(21,17,14,0.28)]",
        "transition-shadow duration-200",
        className
      )}
      {...props}
    />
  );
}
