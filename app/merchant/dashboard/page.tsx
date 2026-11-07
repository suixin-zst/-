import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { Tag } from "@/components/ui/tag";
import type { GigStatus } from "@/lib/types";

export const metadata = { title: "商家工作台 · 台前" };

const STATUS_LABEL: Record<GigStatus, string> = {
  open: "招募中",
  matched: "已匹配",
  closed: "已结束",
};

const STATUS_TONE: Record<GigStatus, "outline" | "spotlight" | "gold"> = {
  open: "outline",
  matched: "spotlight",
  closed: "gold",
};

/**
 * 商家工作台 —— 已发布商单 + 报名管理 + 快捷入口
 */
export default async function MerchantDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <EmptyState title="请先登录" hint="登录后即可查看你的商单与报名" />
      </div>
    );
  }

  // 查该商家发布的所有商单
  const { data: gigs } = await supabase
    .from("gigs")
    .select("*")
    .eq("merchant_id", user.id)
    .order("created_at", { ascending: false });

  // 查这些商单的报名数
  const gigIds = (gigs ?? []).map((g) => g.id);
  const { data: apps } = gigIds.length
    ? await supabase
        .from("applications")
        .select("gig_id, host_id, status, profiles!host_id(name)")
        .in("gig_id", gigIds)
    : { data: [] };

  const appCountMap = new Map<string, number>();
  for (const a of apps ?? []) {
    appCountMap.set(a.gig_id, (appCountMap.get(a.gig_id) ?? 0) + 1);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-spotlight">Merchant dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">商家工作台</h1>
          <p className="mt-2 text-ink-soft">管理你的商单、查看报名、联系主持人。</p>
        </div>
        <div className="flex gap-2">
          <Link href="/merchant/gig/new">
            <Button size="sm">发布商单</Button>
          </Link>
          <Link href="/merchant/hosts">
            <Button variant="outline" size="sm">
              浏览主持人
            </Button>
          </Link>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link href="/merchant/gig/new" className="block">
          <Card className="p-5 transition-shadow hover:shadow-md">
            <Icon name="spark" size={20} className="text-spotlight" />
            <p className="mt-3 font-medium">发布商单</p>
            <p className="mt-1 text-sm text-ink-soft">让主持人找到你</p>
          </Card>
        </Link>
        <Link href="/merchant/hosts" className="block">
          <Card className="p-5 transition-shadow hover:shadow-md">
            <Icon name="users" size={20} className="text-spotlight" />
            <p className="mt-3 font-medium">浏览主持人</p>
            <p className="mt-1 text-sm text-ink-soft">主动邀约合适的人选</p>
          </Card>
        </Link>
        <Link href="/chat" className="block">
          <Card className="p-5 transition-shadow hover:shadow-md">
            <Icon name="message" size={20} className="text-spotlight" />
            <p className="mt-3 font-medium">消息</p>
            <p className="mt-1 text-sm text-ink-soft">和主持人直接聊</p>
          </Card>
        </Link>
      </div>

      {/* 我的商单 */}
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">我的商单</h2>
        {(!gigs || gigs.length === 0) ? (
          <div className="mt-4">
            <EmptyState
              title="还没有发布商单"
              hint="发布第一张商单，让合适的主持人找到你"
              action={
                <Link href="/merchant/gig/new">
                  <Button size="sm">发布商单</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {gigs.map((gig) => (
              <Link key={gig.id} href={`/gig/${gig.id}`}>
                <Card className="flex items-center justify-between p-4 transition-shadow hover:shadow-md">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{gig.title}</span>
                      <Tag tone="gold">{gig.type}</Tag>
                    </div>
                    <p className="mt-1 text-sm text-ink-soft">
                      {gig.city} · {gig.event_date} · {gig.duration}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-ink-soft">
                      {appCountMap.get(gig.id) ?? 0} 报名
                    </span>
                    <Badge tone={STATUS_TONE[gig.status]}>
                      {STATUS_LABEL[gig.status]}
                    </Badge>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
