import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Tag } from "@/components/ui/tag";
import { ApplyGigButton } from "@/components/gigs/apply-gig-button";
import { demoGigs } from "@/lib/demo-data";
import type { GigRow, ProfileRow, ApplicationRow } from "@/lib/types";

export const metadata = { title: "商单 · 台前" };

/**
 * 商单详情页 —— 主持人决定是否报名的关键页面
 *
 * 数据源：gigs + profiles (merchant) + applications
 * demo gig id 时渲染静态 demo 数据，不调 Supabase
 */
export default async function GigDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // demo 商单走静态渲染
  if (id.startsWith("demo-gig-")) {
    const demoGig = demoGigs.find((g) => g.id === id);
    if (!demoGig) notFound();

    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Tag tone="gold">{demoGig.type}</Tag>
              <Badge tone="outline">{demoGig.city}</Badge>
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold">{demoGig.title}</h1>
            <p className="mt-2 text-ink-soft">
              发布方：{demoGig.merchantName}
            </p>
          </div>
          <Link href="/host/gigs">
            <Button>报名试试</Button>
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">商单信息</h2>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Icon name="calendar" size={16} className="text-ink-soft" />
                  <span>
                    <span className="text-ink-soft">日期：</span>
                    {demoGig.event_date}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="clock" size={16} className="text-ink-soft" />
                  <span>
                    <span className="text-ink-soft">时长：</span>
                    {demoGig.duration}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="wallet" size={16} className="text-ink-soft" />
                  <span>
                    <span className="text-ink-soft">预算：</span>
                    ¥{demoGig.budget_min} - ¥{demoGig.budget_max}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">详细描述</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft whitespace-pre-wrap">
                {demoGig.description}
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">要求</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft whitespace-pre-wrap">
                {demoGig.requirements}
              </p>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card className="p-5">
              <h3 className="font-display font-semibold">报名情况</h3>
              <p className="mt-2 text-2xl font-semibold">3</p>
              <p className="text-sm text-ink-soft">位主持人已报名</p>
            </Card>

            <Card className="p-5">
              <h3 className="mb-3 font-display font-semibold">报名列表</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>林晚秋</span>
                  <Badge tone="spotlight">已接受</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>陈亦航</span>
                  <Badge tone="outline">待审核</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>苏清漪</span>
                  <Badge tone="outline">待审核</Badge>
                </div>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    );
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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

  const { data: merchant } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", gig.merchant_id)
    .single();

  const applications = appsRes.data ?? [];
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

          {gig.description ? (
            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">详细描述</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft whitespace-pre-wrap">
                {gig.description}
              </p>
            </Card>
          ) : null}

          {gig.requirements ? (
            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold">要求</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft whitespace-pre-wrap">
                {gig.requirements}
              </p>
            </Card>
          ) : null}
        </div>

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
