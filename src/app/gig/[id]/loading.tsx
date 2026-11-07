import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main>
      <div className="container" style={{ paddingTop: 32 }}>
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="container">
        <div className="detail-grid">
          <div>
            <div className="flex gap-2">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="mt-5 h-12 w-4/5" />
            <Skeleton className="mt-3 h-4 w-40" />
            <div className="detail-meta-grid">
              <Skeleton className="h-[68px] rounded-[12px]" />
              <Skeleton className="h-[68px] rounded-[12px]" />
              <Skeleton className="h-[68px] rounded-[12px]" />
              <Skeleton className="h-[68px] rounded-[12px]" />
            </div>
            <Skeleton className="mt-10 h-6 w-24" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
          <aside className="detail-side">
            <Skeleton className="h-[300px] rounded-[18px]" />
            <Skeleton className="h-[130px] rounded-[16px]" />
          </aside>
        </div>
      </div>
    </main>
  );
}
