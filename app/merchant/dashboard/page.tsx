import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "商家工作台 · 台前" };

/**
 * 占位工作台 —— 主力在 h14–17 实现
 * 计划内容：我发布的商单（含报名列表 / 受理）、发单入口、
 * 快捷入口（主持人列表 /chat）
 */
export default async function MerchantDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold">商家工作台</h1>
      <p className="mt-2 text-ink-soft">{user?.email}，欢迎。这里将展示你的商单与报名。</p>
      <div className="mt-8">
        <EmptyState
          title="还没有发布商单"
          hint="发布第一张商单，让合适的主持人找到你"
        />
      </div>
    </div>
  );
}
