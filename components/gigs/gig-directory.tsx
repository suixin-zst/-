import { GigCard } from "./gig-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { GigWithMerchant } from "@/lib/hosts";

/** 商单列表网格；空态走 EmptyState 契约 */
export function GigDirectory({ gigs }: { gigs: GigWithMerchant[] }) {
  if (gigs.length === 0) {
    return <EmptyState title="暂无开放商单" hint="商家正在准备中，稍后再来" />;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {gigs.map((g) => (
        <GigCard key={g.id} gig={g} />
      ))}
    </div>
  );
}
