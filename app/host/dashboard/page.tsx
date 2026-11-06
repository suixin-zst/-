import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "主持人工作台 · 台前" };

/**
 * 占位工作台 —— 副手在 h14–17 实现
 * 计划内容：我的报名列表（pending/accepted/rejected 状态）、受邀约、
 * 快捷入口（商单大厅 /chat / 我的资料编辑）
 */
export default async function HostDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold">主持人工作台</h1>
      <p className="mt-2 text-ink-soft">{user?.email}，欢迎。这里将展示你的报名与邀约。</p>
      <div className="mt-8">
        <EmptyState
          title="还没有报名任何商单"
          hint="去商单大厅看看第一单——筛选城市和档期，一键报名"
        />
      </div>
    </div>
  );
}
