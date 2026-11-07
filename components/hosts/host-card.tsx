import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { Tag } from "@/components/ui/tag";
import { Card } from "@/components/ui/card";
import type { HostListItem } from "@/lib/hosts";

/**
 * 主持人卡片 —— 商单大厅 / 商家浏览页的列表项
 *
 * 图位固定 3:4 竖版（UI 硬规则）；没有头像时用姓名首字+聚光底色兜底
 */
export function HostCard({ host }: { host: HostListItem }) {
  return (
    <Link href={`/host/${host.id}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-spotlight-tint">
          {host.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={host.avatarUrl}
              alt={host.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-display text-6xl font-semibold text-spotlight/30">
              {host.name.slice(0, 1)}
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2">
            <span className="font-display font-semibold group-hover:text-spotlight">
              {host.name}
            </span>
            {host.isVerified ? <Badge tone="spotlight">已认证</Badge> : null}
          </div>

          <p className="mt-1 text-xs text-ink-soft">
            {host.city ?? "未知城市"} · {host.styles.slice(0, 2).join(" / ") || "综合"}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <Rating rating={host.rating} count={host.ratingCount} />
            <span className="text-sm text-ink-soft">
              {host.priceHourly ? `¥${host.priceHourly}/时` : "报价面议"}
            </span>
          </div>

          {host.styles.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {host.styles.slice(0, 3).map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
