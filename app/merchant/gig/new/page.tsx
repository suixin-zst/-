import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewGigForm } from "./new-gig-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "发布商单 · 台前" };

/**
 * 发布商单页 —— 商家填写活动信息，创建开放商单
 *
 * 未登录或非商家直接跳走
 */
export default async function NewGigPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 确认是商家
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "merchant") redirect("/host/dashboard");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-spotlight">New gig</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">发布新商单</h1>
          <p className="mt-2 text-ink-soft">
            填写活动信息，让合适的主持人找到你。价格写在明面上，减少沟通成本。
          </p>
        </div>
        <Link href="/merchant/dashboard">
          <Button variant="ghost" size="sm">
            返回工作台
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <NewGigForm merchantId={user.id} />
      </div>
    </div>
  );
}
