import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Tag } from "@/components/ui/tag";
import { ApplyGigButton } from "@/components/gigs/apply-gig-button";
import type { GigRow, ProfileRow, ApplicationRow } from "@/lib/types";

export const metadata = { title: "商单 · 台前" };

/**
 * 商单详情页 —— 主持人决定是否报名的关键页面
 *
 * 数据源：gigs + profiles (merchant) + applications
 */
export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 查商单 + 商家信息 + 报名列表（三方并发）
  const [gigRes, appsRes] = await Promise.all([
    supabase.from("gigs").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("applications")
      .select("*, profiles!host_id(name)")
      .eq("gig_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const gig = gigRes.data;
  if (!gig) notFound();

  // 查商家 profile
  const { data: merchant } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", gig.merchant_id)
    .single();

  const applications = appsRes.data ?? [];

  // 检查当前用户是否已报名
  const hasApplied = user ? applications.some((a) => a.host_id === user.id) : false;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Tag tone="gold">{gig.type}</Tag>
            <Badge tone="outline">{gig.city}</Badge>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold">{gig.title}</h1>
          <p className="mt-2 text-ink-soft">
            发布方：{merchant?.name ?? "商家"}
          </p>
        </div>
        {user ? (
          hasApplied ? (
            <Badge tone="spotlight">已报名</Badge>
          ) : (
            <ApplyGigButton gigId={gig.id} />
          )
        ) : null}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          {/* 基本信息 */}
          <Card className="p-6">
            <h2 className="font-display text-lg font-semibold">商单信息</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Icon name="calendar" size={16} className="text-ink-soft" />
                <span>
                  <span className="text-ink-soft">日期：</span>
                  {gig.event_date}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Icon name="clock" size={16} className="text-ink-soft" />
                <span>
                  <span className="text-ink-soft">时长：</span>
                  {gig.duration}
                </span>
              </div>
              {gig.budget_min || gig.budget_max ? (
                <div className="flex items-center gap-3">
                  <Icon name="wallet" size={16} className="text-ink-soft" />
                  <span>
                    <span className="text-ink-soft">预算：</span>
                    {gig.budget_min && gig.budget_max
                      ? `¥${gig.budget_min} - ¥${gig.budget_max}`
                      : gig.budget_min
                        ? `¥${gig.budget_min} 起`
                        : `最高 ¥${gig.budget_max}`}
                  </span>
                </div>
              ) : null}
            </div>
          </Card>

          {/* 详细描述 */}
          {gig.description ? (
            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">详细描述</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft whitespace-pre-wrap">
                {gig.description}
              </p>
            </Card>
          ) : null}

          {/* 要求 */}
          {gig.requirements ? (
            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">要求</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft whitespace-pre-wrap">
                {gig.requirements}
              </p>
            </Card>
          ) : null}
        </div>

        {/* 侧边栏 */}
        <aside className="space-y-4">
          <Card className="p-5">
            <h3 className="font-display font-semibold">报名情况</h3>
            <p className="mt-2 text-2xl font-semibold">{applications.length}</p>
            <p className="text-sm text-ink-soft">位主持人已报名</p>
          </Card>

          {applications.length > 0 ? (
            <Card className="p-5">
              <h3 className="mb-3 font-display font-semibold">报名列表</h3>
              <div className="space-y-2">
                {applications.map((app) => {
                  const host = app.profiles as { name?: string } | null;
                  return (
                    <div key={app.id} className="flex items-center justify-between text-sm">
                      <span>{host?.name ?? "主持人"}</span>
                      <Badge tone={app.status === "accepted" ? "spotlight" : "outline"}>
                        {app.status === "pending" ? "待审核" : app.status === "accepted" ? "已接受" : "未通过"}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
