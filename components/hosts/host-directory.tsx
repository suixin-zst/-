import { HostCard } from "./host-card";
import { EmptyState } from "@/components/ui/empty-state";
import type { HostListItem } from "@/lib/hosts";

/** 主持人列表网格；空态走 EmptyState 契约 */
export function HostDirectory({ hosts }: { hosts: HostListItem[] }) {
  if (hosts.length === 0) {
    return <EmptyState title="暂无主持人" hint="平台正在招募优秀主持人" />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {hosts.map((h) => (
        <HostCard key={h.id} host={h} />
      ))}
    </div>
  );
}
