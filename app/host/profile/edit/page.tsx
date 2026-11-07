import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadHostProfile } from "@/lib/hosts";
import { HostProfileForm } from "@/components/hosts/host-profile-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata = { title: "编辑资料 · 台前" };

/**
 * 主持人资料编辑页 —— 补全城市、风格、报价
 *
 * 未登录或非主持人直接跳走
 */
export default async function HostProfileEditPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 确认是主持人
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "host") redirect("/merchant/dashboard");

  const hostProfile = await loadHostProfile(supabase, user.id);
  // 不 redirect —— 首次创建资料的用户也需要填这个表单

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-spotlight">Host profile</p>
          <h1 className="mt-2 font-display text-3xl font-semibold">
            {hostProfile ? "编辑你的主页" : "完善你的主页"}
          </h1>
          <p className="mt-2 text-ink-soft">作品、报价、一句话定位。商家先看这些，再决定要不要聊。</p>
        </div>
        <div className="flex gap-2">
          <Link href="/host/dashboard">
            <Button variant="ghost" size="sm">返回工作台</Button>
          </Link>
          <Link href={`/host/${user.id}`}>
            <Button variant="ghost" size="sm">查看公开主页</Button>
          </Link>
        </div>
      </div>

      <div className="mt-8">
        <HostProfileForm hostId={user.id} profile={hostProfile} />
      </div>
    </div>
  );
}
