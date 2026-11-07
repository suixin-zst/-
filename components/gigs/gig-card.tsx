import Link from "next/link";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import type { GigWithMerchant } from "@/lib/hosts";

/**
 * 商单卡片 —— 小房子造型
 *
 * 红色屋顶 + 米色墙体 + 屋檐，信息写在墙面上。
 * 整个卡片可点击，hover 有抬升与描边反馈。
 */
export function GigCard({ gig }: { gig: GigWithMerchant }) {
  return (
    <Link href={`/gig/${gig.id}`} className="group flex h-full flex-col items-center">
      {/* 红色屋顶（更高更陡） */}
      <div className="relative h-28 w-full">
        <div
          className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-spotlight to-spotlight-deep shadow-[0_12px_26px_-16px_rgba(142,43,35,0.85)]"
          style={{ clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)" }}
        />
        {/* 屋脊高光 */}
        <div className="absolute left-1/2 top-2 h-16 w-px -translate-x-1/2 bg-white/25" />
        {/* 烟囱：上红下白 + 灰边，高度到屋顶尖 */}
        <div className="absolute right-[24%] top-0 flex h-[58%] w-4 flex-col overflow-hidden rounded-[3px] border-2 border-[#c9c4ba] shadow-sm">
          <div className="flex-1 bg-spotlight-deep" />
          <div className="flex-1 bg-[#fbf7ef]" />
        </div>
      </div>
      {/* 屋檐 */}
      <div className="h-1.5 w-full rounded-full bg-spotlight-deep/85 shadow-sm" />

      {/* 浅米色墙体（贴近背景略深） */}
      <div className="relative flex w-[86%] flex-1 flex-col rounded-b-2xl border border-line bg-[#f4ece0] p-5 shadow-[0_18px_34px_-26px_rgba(21,17,14,0.4)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-lg">
        <div className="flex items-center justify-between">
          <Tag tone="spotlight">{gig.type}</Tag>
          <span className="text-xs text-ink-soft">{gig.city}</span>
        </div>

        <h3 className="mt-3 font-display text-lg font-semibold group-hover:text-spotlight">
          {gig.title}
        </h3>
        <p className="mt-1 text-sm text-ink-soft">发布方：{gig.merchantName}</p>

        <div className="mt-4 space-y-2 text-sm text-ink-2">
          <div className="flex items-center gap-2">
            <Icon name="calendar" size={14} className="text-ink-soft" />
            <span>
              {gig.event_date} · {gig.duration}
            </span>
          </div>
          {gig.budget_min || gig.budget_max ? (
            <div className="flex items-center gap-2">
              <Icon name="wallet" size={14} className="text-ink-soft" />
              <span>
                {gig.budget_min && gig.budget_max
                  ? `¥${gig.budget_min} - ¥${gig.budget_max}`
                  : gig.budget_min
                    ? `¥${gig.budget_min} 起`
                    : `最高 ¥${gig.budget_max}`}
              </span>
            </div>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-dashed border-line/80 pt-4 text-sm">
          <span className="font-medium text-spotlight group-hover:underline">查看详情 →</span>
          <span className="text-ink-soft">
            {new Date(gig.created_at).toLocaleDateString("zh-CN")}
          </span>
        </div>
      </div>
    </Link>
  );
}
