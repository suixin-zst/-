import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** 基础卡片容器；标题直接用 h* + font-display，不另设组件 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-card border border-line bg-card p-5", className)}
      {...props}
    />
  );
}
