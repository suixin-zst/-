import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loadHost, loadHostReviews, loadHosts } from "@/lib/hosts";
import { demoHosts, DEMO_HOST_ID } from "@/lib/demo-data";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Rating } from "@/components/ui/rating";
import { Tag } from "@/components/ui/tag";
import { ScrollToButton } from "@/components/ui/scroll-to-button";
import { InviteHostButton } from "@/components/hosts/invite-host-button";
import type { HostDetail, HostListItem } from "@/lib/hosts";
import type { WorkRow } from "@/lib/types";

export const metadata = { title: "主持人 · 台前" };

/**
 * 主持人档案详情页 —— 商家决定是否合作的关键页面
 *
 * 数据源：profiles + host_profiles + works + reviews（四表联查）
 * 数据库空时用 demo 数据兜底
 */
export default async function HostProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 先查数据库，没有就用 demo 数据
  let host: HostDetail | null = null;
  let reviews: (import("@/lib/types").ReviewRow & { reviewerName: string })[] = [];
  let similar: HostListItem[] = [];

  const dbHost = await loadHost(supabase, id);

  if (dbHost) {
    host = dbHost;
    [reviews] = await Promise.all([
      loadHostReviews(supabase, id),
      loadHosts(supabase),
    ]);
    const allHosts = await loadHosts(supabase);
    similar = allHosts
      .filter((h) => h.id !== id && h.styles.some((s) => host!.styles.includes(s)))
      .slice(0, 3);
  } else {
    // 数据库没有，用 demo 数据兜底
    const demoHost = demoHosts.find((h) => h.id === id) || demoHosts[0];
    host = {
      id: demoHost.id,
      name: demoHost.name,
      avatarUrl: demoHost.avatarUrl,
      city: demoHost.city,
      styles: demoHost.styles,
      bio: demoHost.bio,
      priceHourly: demoHost.priceHourly,
      priceHalfDay: demoHost.priceHalfDay,
      priceFullDay: demoHost.priceFullDay,
      experienceYears: demoHost.experienceYears,
      isVerified: demoHost.isVerified,
      rating: demoHost.rating,
      ratingCount: demoHost.ratingCount,
      works: demoHost.works.map((w) => ({
        id: w.id,
        host_id: demoHost.id,
        type: w.type as "video" | "image" | "audio",
        url: w.url,
        title: w.title,
        sort: 0,
        created_at: "",
      })) as WorkRow[],
    };

    // demo 评价
    reviews = [
      {
        id: "r1",
        gig_id: "demo-gig-1",
        reviewer_id: "demo-merchant-1",
        reviewee_id: demoHost.id,
        rating: 5,
        content: "非常专业，控场能力强，现场气氛调动得很好。",
        created_at: "2026-10-15T10:00:00Z",
        reviewerName: "某科技公司",
      },
      {
        id: "r2",
        gig_id: "demo-gig-2",
        reviewer_id: "demo-merchant-2",
        reviewee_id: demoHost.id,
        rating: 5,
        content: "台风稳健，临场反应快，合作很愉快。",
        created_at: "2026-09-20T10:00:00Z",
        reviewerName: "某汽车品牌",
      },
    ];

    // demo 相似主持人
    similar = demoHosts
      .filter((h) => h.id !== demoHost.id && h.styles.some((s) => demoHost.styles.includes(s)))
      .slice(0, 3)
      .map((h) => ({
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

  if (!host) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Hero 区域 */}
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <div className="shrink-0">
          <div className="aspect-[3/4] w-48 overflow-hidden rounded-card bg-spotlight-tint md:w-56">
            {host.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={host.avatarUrl} alt={host.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-6xl font-semibold text-spotlight/30">
                {host.name.slice(0, 1)}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold">{host.name}</h1>
            {host.isVerified ? (
              <Badge tone="spotlight">
                <Icon name="check" size={10} strokeWidth={3} />
                已认证
              </Badge>
            ) : (
              <Tag>未认证</Tag>
            )}
            {host.city ? <Tag tone="gold">{host.city}</Tag> : null}
          </div>

          {host.styles.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {host.styles.map((s) => (
                <Tag key={s}>{s}</Tag>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex gap-8">
            <div>
              <p className="font-display text-2xl font-semibold">
                {host.rating.toFixed(1)}
                <span className="text-sm text-ink-soft"> / 5</span>
              </p>
              <p className="text-xs text-ink-soft">{host.ratingCount} 条评价</p>
            </div>
            {host.experienceYears ? (
              <div>
                <p className="font-display text-2xl font-semibold">{host.experienceYears} 年</p>
                <p className="text-xs text-ink-soft">从业经验</p>
              </div>
            ) : null}
          </div>

          <div className="mt-6 flex gap-3">
            {host.id.startsWith("demo-") ? (
              <Link href="/merchant/dashboard">
                <button
                  type="button"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-spotlight px-5 text-sm font-medium text-white transition-colors hover:bg-spotlight-deep"
                >
                  立即合作
                </button>
              </Link>
            ) : (
              <InviteHostButton hostId={host.id} hostName={host.name} />
            )}
            <ScrollToButton targetId="works">先看作品</ScrollToButton>
          </div>
        </div>
      </div>

      {/* 关于我 */}
      {host.bio ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">关于我</h2>
          <p className="mt-3 text-ink-soft leading-relaxed">{host.bio}</p>
        </section>
      ) : null}

      {/* 作品集 */}
      <section className="mt-12" id="works">
        <h2 className="font-display text-xl font-semibold">作品集</h2>
        {host.works.length === 0 ? (
          <p className="mt-4 text-sm text-ink-soft">暂未上传作品</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {host.works.map((w) => (
              <Card key={w.id} className="overflow-hidden">
                <div className="aspect-video bg-paper-2">
                  {w.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={w.url} alt={w.title ?? ""} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink-soft">
                      <Icon name="play" size={24} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium">{w.title ?? "作品"}</p>
                  <p className="text-xs text-ink-soft">
                    {w.type === "video" ? "视频" : w.type === "image" ? "图片" : "音频"}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 报价 */}
      {(host.priceHourly || host.priceHalfDay || host.priceFullDay) ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">报价</h2>
          <p className="mt-1 text-sm text-ink-soft">透明报价 · 不含差旅</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {host.priceHourly ? (
              <Card className="p-5 text-center">
                <p className="text-sm text-ink-soft">按小时</p>
                <p className="mt-2 font-display text-2xl font-semibold">¥{host.priceHourly}</p>
                <p className="mt-1 text-xs text-ink-soft">2 小时起订</p>
              </Card>
            ) : null}
            {host.priceHalfDay ? (
              <Card className="border-spotlight p-5 text-center">
                <p className="text-sm text-ink-soft">半天 · 最常订</p>
                <p className="mt-2 font-display text-2xl font-semibold">¥{host.priceHalfDay}</p>
                <p className="mt-1 text-xs text-ink-soft">4 小时以内</p>
              </Card>
            ) : null}
            {host.priceFullDay ? (
              <Card className="p-5 text-center">
                <p className="text-sm text-ink-soft">全天</p>
                <p className="mt-2 font-display text-2xl font-semibold">¥{host.priceFullDay}</p>
                <p className="mt-1 text-xs text-ink-soft">8 小时以内</p>
              </Card>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* 评价 */}
      {reviews.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">
            合作评价
            <span className="ml-2 text-sm font-normal text-ink-soft">{reviews.length} 条</span>
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <Card key={r.id} className="p-4">
                <Rating rating={r.rating} hideCount />
                <p className="mt-2 text-sm">{r.content ?? "好评"}</p>
                <p className="mt-2 text-xs text-ink-soft">
                  {r.reviewerName} · {new Date(r.created_at).toLocaleDateString("zh-CN")}
                </p>
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* 相似主持人推荐 */}
      {similar.length > 0 ? (
        <section className="mt-12">
          <h2 className="font-display text-xl font-semibold">相似主持人</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {similar.map((h) => (
              <Link key={h.id} href={`/host/${h.id}`} className="flex items-center gap-3 rounded-card border border-line bg-card p-3 transition-colors hover:border-spotlight/50">
                <Avatar name={h.name} size="md" />
                <div>
                  <p className="font-medium">{h.name}</p>
                  <p className="text-xs text-ink-soft">
                    {h.city ?? "综合"} · {h.styles.slice(0, 2).join(" / ") || "综合"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
