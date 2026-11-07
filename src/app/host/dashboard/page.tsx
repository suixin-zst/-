import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { GigCard } from "@/components/gigs/GigCard";
import { getGigs } from "@/lib/data";
import {
  getHostProfile,
  listApplications,
  listConversationsForUser,
  listWorks,
} from "@/lib/server/db";
import { requireRole } from "@/lib/session";
import { formatBudget, formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "主持人工作台 · 台前 TAIQIAN",
  description: "管理你的报名、会话和主页。",
};

export default async function HostDashboardPage() {
  const user = await requireRole("host");

  const [profile, applications, conversations, works, gigs] = await Promise.all([
    getHostProfile(user.id),
    listApplications({ hostId: user.id }),
    listConversationsForUser(user.id),
    listWorks(user.id),
    getGigs(),
  ]);

  const openGigs = gigs.filter((gig) => gig.status === "open");
  let recommended = profile
    ? openGigs.filter(
        (gig) =>
          profile.styles.includes(gig.type) || gig.city === profile.city,
      )
    : [];
  if (!recommended.length) recommended = openGigs.slice(0, 3);
  recommended = recommended.slice(0, 3);

  const pending = applications.filter(
    (row) => row.application.status === "pending",
  ).length;

  const completenessItems = [
    Boolean(profile?.city),
    Boolean(profile?.styles.length),
    Boolean(profile?.bio),
    Boolean(profile?.price_half_day),
    works.length > 0,
  ];
  const completeness = Math.round(
    (completenessItems.filter(Boolean).length / completenessItems.length) * 100,
  );

  return (
    <main>
      <section className="container dashboard-head">
        <div>
          <span className="eyebrow">Host dashboard</span>
          <h1 className="display-lg dashboard-title">欢迎回来，{user.name}</h1>
          <p className="page-sub">
            你的报名、会话和主页都在这里。先去商单大厅看看，或者把主页补完整。
          </p>
        </div>
        <div className="action-row">
          <Button href="/host/profile/edit" variant="stage">
            编辑资料
          </Button>
          <Button href="/host/gigs" variant="ghost">
            逛商单
          </Button>
        </div>
      </section>

      <div className="container">
        <div className="dash-stats">
          <div className="dash-stat">
            <b>{pending}</b>
            <span>待处理报名</span>
          </div>
          <div className="dash-stat">
            <b>{conversations.length}</b>
            <span>进行中会话</span>
          </div>
          <div className="dash-stat">
            <b>{works.length}</b>
            <span>主页作品</span>
          </div>
        </div>

        <div className="dashboard-grid">
          <div>
            <div className="dash-card">
              <div className="dash-card-head">
                <h2>我的报名</h2>
                <span>{applications.length} 条记录</span>
              </div>

              {applications.length ? (
                applications.map(({ application, gig }) => {
                  const conversation = conversations.find(
                    (row) => row.conversation.gig_id === application.gig_id,
                  );
                  return (
                    <div className="app-row" key={application.id}>
                      <div className="app-main">
                        <div className="app-title">
                          {gig?.title ?? "商家直接邀约"}{" "}
                          <StatusBadge status={application.status} />
                        </div>
                        <div className="app-sub">
                          {gig
                            ? `${gig.city} · ${formatEventDate(gig.event_date)} · ${formatBudget(gig.budget_min, gig.budget_max)}`
                            : application.message}
                        </div>
                      </div>
                      <div className="app-actions">
                        {conversation ? (
                          <Button
                            href={`/chat?c=${conversation.conversation.id}`}
                            size="sm"
                            variant="ghost"
                          >
                            去聊天
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="dash-empty">
                  还没有报名。去商单大厅找一张合适的商单。
                </div>
              )}
            </div>

            <div className="dash-card">
              <div className="dash-card-head">
                <h2>推荐商单</h2>
                <span>按你的城市和风格匹配</span>
              </div>
              {recommended.length ? (
                <div className="gig-grid">
                  {recommended.map((gig) => (
                    <GigCard key={gig.id} gig={gig} />
                  ))}
                </div>
              ) : (
                <div className="dash-empty">暂时没有匹配的商单。</div>
              )}
            </div>
          </div>

          <aside>
            <div className="side-card">
              <h3>主页完整度</h3>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                <b className="display-md">{completeness}%</b>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  {completeness === 100 ? "可以接单了" : "再补几项"}
                </span>
              </div>
              <div className="bar-track" style={{ marginTop: 10 }}>
                <div
                  className="bar-fill"
                  style={{ width: `${completeness}%` }}
                />
              </div>
              <ul className="dash-list" style={{ marginTop: 14 }}>
                <li>
                  <span>城市</span>
                  <b>{profile?.city || "待填"}</b>
                </li>
                <li>
                  <span>风格</span>
                  <b>{profile?.styles.length ? profile.styles.join(" / ") : "待填"}</b>
                </li>
                <li>
                  <span>半天报价</span>
                  <b>
                    {profile?.price_half_day
                      ? `¥${profile.price_half_day}`
                      : "待填"}
                  </b>
                </li>
                <li>
                  <span>作品</span>
                  <b>{works.length} 个</b>
                </li>
              </ul>
              <div style={{ marginTop: 16 }}>
                <Button
                  href="/host/profile/edit"
                  variant="ghost"
                  size="sm"
                  block
                >
                  完善资料
                </Button>
              </div>
            </div>

            <div className="side-card">
              <h3>最近会话</h3>
              {conversations.length ? (
                conversations.slice(0, 5).map((row) => (
                  <Link
                    href={`/chat?c=${row.conversation.id}`}
                    className="dash-link"
                    key={row.conversation.id}
                  >
                    <span>
                      {row.merchant.name}
                      <span style={{ color: "var(--muted)" }}>
                        {" "}
                        · {row.gig?.title ?? "直接沟通"}
                      </span>
                    </span>
                    <Icon name="arrow-right" size={12} />
                  </Link>
                ))
              ) : (
                <div className="dash-empty">还没有会话。</div>
              )}
            </div>

            <div className="side-card">
              <h3>快速入口</h3>
              <ul className="dash-list" style={{ marginTop: 12 }}>
                <li>
                  <Link href="/host/gigs">商单大厅</Link>
                  <Icon name="arrow-right" size={12} />
                </li>
                <li>
                  <Link href="/host/profile/edit">编辑主页</Link>
                  <Icon name="arrow-right" size={12} />
                </li>
                <li>
                  <Link href="/chat">站内会话</Link>
                  <Icon name="arrow-right" size={12} />
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
