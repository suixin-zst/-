import { GigCardSkeleton, Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main>
      <section className="page-head">
        <div className="container">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="mt-4 h-12 w-64" />
          <Skeleton className="mt-4 h-4 w-[520px] max-w-full" />
        </div>
      </section>
      <section className="container" style={{ paddingBottom: 72 }}>
        <div className="filter-card">
          <div className="filter-row">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
        <div className="gig-grid" style={{ marginTop: 24 }}>
          <GigCardSkeleton />
          <GigCardSkeleton />
          <GigCardSkeleton />
          <GigCardSkeleton />
          <GigCardSkeleton />
          <GigCardSkeleton />
        </div>
      </section>
    </main>
  );
}
