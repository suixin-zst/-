/**
 * 骨架屏 —— 加载占位
 *
 * 提供基础 Skeleton 和两个预组装变体（主持人卡/商单卡骨架）
 */

import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("animate-pulse rounded bg-line", className)}
      aria-hidden="true"
    />
  );
}

export function HostCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-card">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="mt-2 h-3 w-16" />
        <div className="mt-3 flex gap-1.5">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
        <div className="mt-6 flex items-end justify-between">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-7 w-7 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function GigCardSkeleton() {
  return (
    <div className="rounded-card border border-line bg-card p-5">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-6 w-3/4" />
      <Skeleton className="mt-2 h-3 w-1/2" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
      </div>
      <div className="mt-5 flex justify-between border-t border-dashed border-line pt-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
