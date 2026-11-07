import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { loadHostApplications } from "@/lib/hosts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { Tag } from "@/components/ui/tag";
import type { ApplicationStatus } from "@/lib/types";

export const metadata = { title: "主持人工作台 · 台前" };

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  pending: "待审核",
  accepted: "已接受",
  rejected: "未通过",
};

const STATUS_TONE: Record<ApplicationStatus, "outline" | "spotlight" | "gold"> = {
  pending: "outline",
  accepted: "spotlight",
  rejected: "gold",
};

/**
 * 主持人工作台 —— 报名列表 + 快捷入口
 *
 * 主持人登录后看到自己所有报名的商单及状态
 */
export default async function HostDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <EmptyState title="请先登录" hint="登录后即可查看你的报名与邀约" />
      </div>
    );
  }

  const applications = await loadHostApplications(supabase, user.id);

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-spotlight">Host dashboard</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">主持人工作台</h1>
          <p className="mt-2 text-ink-soft">管理你的报名、查看邀约、编辑资料。</p>
        </div>
        <div className="flex gap-2">
          <Link href="/host/gigs">
            <Button variant="outline" size="sm">
              商单大厅
            </Button>
          </Link>
          <Link href="/host/profile/edit">
            <Button variant="ghost" size="sm">
              编辑资料
            </Button>
          </Link>
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <Icon name="search" size={20} className="text-spotlight" />
          <p className="mt-3 font-medium">商单大厅</p>
          <p className="mt-1 text-sm text-ink-soft">浏览开放商单，一键报名</p>
        </Card>
        <Card className="p-5">
          <Link href="/chat" className="block">
            <Icon name="message" size={20} className="text-spotlight" />
            <p className="mt-3 font-medium">消息</p>
            <p className="mt-1 text-sm text-ink-soft">和商家直接聊</p>
          </Link>
        </Card>
        <Card className="p-5">
          <Link href={`/host/${user.id}`} className="block">
            <Icon name="users" size={20} className="text-spotlight" />
            <p className="mt-3 font-medium">我的主页</p>
            <p className="mt-1 text-sm text-ink-soft">查看商家看到的样子</p>
          </Link>
        </Card>
      </div>

      {/* 报名列表 */}
      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold">我的报名</h2>
        {applications.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="还没有报名任何商单"
              hint="去商单大厅看看第一单——筛选城市和档期，一键报名"
              action={
                <Link href="/host/gigs">
                  <Button size="sm">去商单大厅</Button>
                </Link>
              }
            />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {applications.map((app) => {
              const gig = app.gigs as { title?: string; city?: string; type?: string } | null;
              return (
                <Card key={app.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{gig?.title ?? "商单"}</p>
                      <p className="mt-0.5 text-sm text-ink-soft">
                        {gig?.city} · {gig?.type}
                      </p>
                    </div>
                  </div>
                  <Badge tone={STATUS_TONE[app.status]}>
                    {STATUS_LABEL[app.status]}
                  </Badge>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
