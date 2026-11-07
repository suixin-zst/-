import { createClient } from "@/lib/supabase/server";
import { loadOpenGigs } from "@/lib/hosts";
import { demoGigs } from "@/lib/demo-data";
import { GigDirectory } from "@/components/gigs/gig-directory";
import { Badge } from "@/components/ui/badge";
import type { GigWithMerchant } from "@/lib/hosts";

export const metadata = { title: "商单大厅 · 台前" };

/**
 * 商单大厅 —— 主持人浏览开放商单，一键报名
 *
 * 只展示 status=open 的商单；按创建时间倒序
 * 数据库空时用 demo 数据兜底
 */
export default async function GigHallPage() {
  const supabase = await createClient();
  let gigs = await loadOpenGigs(supabase);

  // 数据库空时用 demo 数据兜底
  if (gigs.length === 0) {
    gigs = demoGigs.map(
      (g): GigWithMerchant => ({
        id: g.id,
        merchant_id: g.merchant_id,
        title: g.title,
        type: g.type as GigWithMerchant["type"],
        city: g.city,
        event_date: g.event_date,
        duration: g.duration,
        budget_min: g.budget_min,
        budget_max: g.budget_max,
        requirements: g.requirements,
        description: g.description,
        status: g.status,
        created_at: g.created_at,
        merchantName: g.merchantName,
      })
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-spotlight">Open calls</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">商单大厅</h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            商家发布的真实需求，价格写在明面上。看到合适的，报名、开聊，不用等群主转发。
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone="outline">{gigs.length} 张正在招募</Badge>
        </div>
      </div>

      <div className="mt-8">
        <GigDirectory gigs={gigs} />
      </div>
    </div>
  );
}
