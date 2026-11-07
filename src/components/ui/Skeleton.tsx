import { cn } from "@/lib/cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton", className)} aria-hidden="true" />;
}

export function HostCardSkeleton() {
  return (
    <div className="host-card">
      <Skeleton className="h-[176px] rounded-none" />
      <div className="host-body">
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
    <div className="gig-card">
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
      <div className="mt-5 flex justify-between border-t border-dashed border-[var(--line)] pt-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  );
}
