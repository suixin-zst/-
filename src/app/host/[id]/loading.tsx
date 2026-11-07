import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <main>
      <section className="profile-hero">
        <div className="container profile-hero-inner">
          <Skeleton className="h-[200px] w-[160px] rounded-[18px] md:h-[240px] md:w-[200px]" />
          <div>
            <Skeleton className="h-12 w-64 max-w-full" />
            <Skeleton className="mt-3 h-4 w-80 max-w-full" />
            <div className="mt-4 flex gap-2">
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-14 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="mt-6 flex gap-8">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-20" />
            </div>
          </div>
        </div>
      </section>

      <div className="container profile-body">
        <div>
          <Skeleton className="h-7 w-24" />
          <Skeleton className="mt-4 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <div className="work-grid" style={{ marginTop: 32 }}>
            <Skeleton className="h-[214px] rounded-[14px]" />
            <Skeleton className="h-[214px] rounded-[14px]" />
            <Skeleton className="h-[214px] rounded-[14px]" />
          </div>
        </div>
        <aside className="profile-side">
          <Skeleton className="h-[200px] rounded-[16px]" />
          <Skeleton className="h-[150px] rounded-[16px]" />
        </aside>
      </div>
    </main>
  );
}
