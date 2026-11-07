import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import { Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import type { GigWithMerchant } from "@/lib/hosts";

/**
 * 商单卡片 —— 列表项
 *
 * 信息密度高：类型、城市、日期、时长、预算一目了然
 */
export function GigCard({ gig }: { gig: GigWithMerchant }) {
  return (
    <Link href={`/gig/${gig.id}`} className="group block">
      <Card className="flex h-full flex-col justify-between p-5 transition-shadow hover:shadow-lg">
        <div>
          <div className="flex items-center justify-between">
            <Tag tone="gold">{gig.type}</Tag>
            <Badge tone="outline">{gig.city}</Badge>
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
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-dashed border-line pt-4 text-sm">
          <span className="font-medium text-spotlight">查看详情 →</span>
          <span className="text-ink-soft">
            {new Date(gig.created_at).toLocaleDateString("zh-CN")}
          </span>
        </div>
      </Card>
    </Link>
  );
}
