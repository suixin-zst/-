import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { GigDirectory } from "@/components/gigs/GigDirectory";
import { getGigs } from "@/lib/data";

export const metadata: Metadata = {
  title: "商单大厅 · 台前 TAIQIAN",
  description: "按城市、类型、预算筛选商单，一键报名，直接和商家聊。",
};

export const dynamic = "force-dynamic";

export default async function GigHallPage() {
  const gigs = await getGigs();
  const openCount = gigs.filter((gig) => gig.status === "open").length;

  return (
    <main>
      <section className="page-head">
        <div className="container page-head-row">
          <div>
            <span className="eyebrow">Open calls</span>
            <h1 className="display-lg page-title">商单大厅。</h1>
            <p className="page-sub">
              商家发布的真实需求，价格写在明面上。看到合适的，报名、开聊，不用等群主转发。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="tag tag-jade">
              <span className="status-dot" />
              {openCount} 张正在招募
            </span>
            <Button href="/host/lin-zhiyao" variant="ghost" size="sm">
              主持人主页示例
            </Button>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 72 }}>
        <GigDirectory gigs={gigs} />
      </section>
    </main>
  );
}
