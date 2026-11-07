import { createClient } from "@/lib/supabase/server";
import { loadHosts } from "@/lib/hosts";
import { HostDirectory } from "@/components/hosts/host-directory";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { demoHosts } from "@/lib/demo-data";
import type { HostListItem } from "@/lib/hosts";

export const metadata = { title: "主持人列表 · 台前" };

/**
 * 商家浏览主持人 —— 主动邀约主持人
 *
 * 和 /host/gigs 对称：主持人找商单 vs 商家找主持人
 */
export default async function MerchantHostsPage() {
  const supabase = await createClient();
  let hosts = await loadHosts(supabase);

  // 数据库空时用 demo 主持人兜底
  if (hosts.length === 0) {
    hosts = demoHosts.map((h) => ({
      id: h.id,
      name: h.name,
      avatarUrl: h.avatarUrl,
      city: h.city,
      styles: h.styles,
      priceHourly: h.priceHourly,
      priceHalfDay: h.priceHalfDay,
      rating: h.rating,
      ratingCount: h.ratingCount,
      isVerified: h.isVerified,
    }));
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm uppercase tracking-widest text-spotlight">Host directory</p>
          <h1 className="mt-2 font-display text-4xl font-semibold">主持人列表</h1>
          <p className="mt-3 max-w-xl text-ink-soft">
            浏览平台主持人，找到适合你活动的那一位。直接邀约，不用等群主转发。
          </p>
        </div>
        <Link href="/merchant/gig/new">
          <Button variant="outline" size="sm">
            发布商单
          </Button>
        </Link>
      </div>

      <div className="mt-8">
        <HostDirectory hosts={hosts} />
      </div>
    </div>
  );
}
