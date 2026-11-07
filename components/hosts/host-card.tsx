import Link from "next/link";
import { Rating } from "@/components/ui/rating";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import type { HostListItem } from "@/lib/hosts";

/**
 * 主持人卡片 —— 话筒造型
 *
 * 顶部是青铜金属话筒头（金色网孔），信息区作话筒手柄（略收窄），底部接支架。
 * 没有头像时用姓名首字铺在网孔上兜底。
 */
export function HostCard({ host }: { host: HostListItem }) {
  return (
    <Link href={`/host/${host.id}`} className="group flex flex-col items-center">
      {/* 话筒头 */}
      <div className="mic-head relative flex h-48 w-full items-center justify-center overflow-hidden rounded-t-[150px] rounded-b-2xl shadow-[0_18px_40px_-24px_rgba(21,17,14,0.6)] ring-1 ring-black/20">
        {host.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={host.avatarUrl}
            alt={host.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="font-display text-7xl font-bold text-[#f3ead9]/85">
            {host.name.slice(0, 1)}
          </span>
        )}

        <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[#f0d6a0]/60">
          <Icon name="mic" size={16} strokeWidth={2} />
        </span>
        {host.isVerified ? (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-0.5 text-[10px] font-semibold text-[#f0d6a0] backdrop-blur">
            <Icon name="check" size={10} strokeWidth={3} /> 已认证
          </span>
        ) : null}
      </div>

      {/* 话筒手柄（信息区） */}
      <div className="relative -mt-3 w-[88%] rounded-2xl border border-line bg-card p-4 shadow-[0_16px_30px_-26px_rgba(21,17,14,0.4)] transition-shadow duration-200 group-hover:shadow-lg">
        <span className="font-display font-semibold group-hover:text-spotlight">
          {host.name}
        </span>

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

      {/* 话筒支架 */}
      <div className="h-4 w-px bg-line-strong" />
      <div className="h-1 w-10 rounded-full bg-line-strong" />
    </Link>
  );
}
