import type { Metadata } from "next";
import Link from "next/link";
import { ApplicationActions } from "@/components/applications/ApplicationActions";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getGigsForMerchant } from "@/lib/data";
import {
  getMerchantProfile,
  listApplications,
  listConversationsForUser,
} from "@/lib/server/db";
import { requireRole } from "@/lib/session";
import {
  formatEventDate,
  gigStatusLabel,
} from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "商家工作台 · 台前 TAIQIAN",
  description: "发布商单、查看报名、直接和主持人聊。",
};

export default async function MerchantDashboardPage() {
  const user = await requireRole("merchant");

  const [profile, gigs, applications, conversations] = await Promise.all([
    getMerchantProfile(user.id),
    getGigsForMerchant(user.id),
    listApplications({ merchantId: user.id }),
    listConversationsForUser(user.id),
  ]);

  const openGigs = gigs.filter((gig) => gig.status === "open").length;
  const pending = applications.filter(
    (row) => row.application.status === "pending",
  ).length;

  return (
    <main>
      <section className="container dashboard-head">
        <div>
          <span className="eyebrow">Merchant dashboard</span>
          <h1 className="display-lg dashboard-title">
            {profile?.company || user.name}
          </h1>
          <p className="page-sub">
            发一张商单，等对的主持人来；或者直接去主持人列表挑人。
          </p>
        </div>
        <div className="action-row">
          <Button href="/merchant/gig/new" variant="jade">
            发布商单
          </Button>
          <Button href="/merchant/hosts" variant="ghost">
            找主持人
          </Button>
        </div>
      </section>

      <div className="container">
        <div className="dash-stats">
          <div className="dash-stat">
            <b>{openGigs}</b>
            <span>在招商单</span>
          </div>
          <div className="dash-stat">
            <b>{pending}</b>
            <span>待处理报名</span>
          </div>
          <div className="dash-stat">
            <b>{conversations.length}</b>
            <span>进行中会话</span>
          </div>
        </div>

        <div className="dashboard-grid">
          <div>
            <div className="dash-card">
              <div className="dash-card-head">
                <h2>我发布的商单</h2>
                <span>{gigs.length} 张</span>
              </div>

              {gigs.length ? (
                gigs.map((gig) => (
                  <div className="app-row" key={gig.id}>
                    <div className="app-main">
                      <div className="app-title">
                        <Link href={`/gig/${gig.id}`}>{gig.title}</Link>{" "}
                        <span
                          className={`tag ${
                            gig.status === "open" ? "tag-jade" : ""
                          }`}
                        >
                          {gigStatusLabel(gig.status)}
                        </span>
                      </div>
                      <div className="app-sub">
                        {gig.city} · {formatEventDate(gig.eventDate)} ·{" "}
                        {gig.applicants} 人报名
                      </div>
                    </div>
                    <div className="app-actions">
                      <Button
                        href={`/gig/${gig.id}`}
                        size="sm"
                        variant="ghost"
                      >
                        查看
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="dash-empty">
                  还没有发布商单。发一张，主持人会来报名。
                </div>
              )}
            </div>

            <div className="dash-card">
              <div className="dash-card-head">
                <h2>报名与邀约</h2>
                <span>{applications.length} 条记录</span>
              </div>

              {applications.length ? (
                applications.map(({ application, host, gig }) => (
                  <div className="app-row" key={application.id}>
                    <Avatar
                      name={host?.name ?? "主持人"}
                      tone="sand"
                      size={38}
                    />
                    <div className="app-main">
                      <div className="app-title">
                        <Link href={`/host/${host?.id ?? ""}`}>
                          {host?.name ?? "主持人"}
                        </Link>{" "}
                        <StatusBadge status={application.status} />
                      </div>
                      <div className="app-sub">
                        {gig ? gig.title : "商家直接邀约"} ·{" "}
                        {application.message}
                      </div>
                      {application.status === "pending" ? (
                        <div style={{ marginTop: 8 }}>
                          <ApplicationActions id={application.id} />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="dash-empty">
                  还没有报名或邀约。去主持人列表看看。
                </div>
              )}
            </div>
          </div>

          <aside>
            <div className="side-card">
              <h3>企业信息</h3>
              <ul className="side-list">
                <li>
                  <span>公司</span>
                  <b>{profile?.company || user.name}</b>
                </li>
                <li>
                  <span>行业</span>
                  <b>{profile?.industry || "待填"}</b>
                </li>
                <li>
                  <span>认证</span>
                  <b>{profile?.verified ? "已认证" : "未认证"}</b>
                </li>
              </ul>
              {profile?.intro ? (
                <p
                  style={{
                    marginTop: 12,
                    fontSize: 12,
                    lineHeight: 1.8,
                    color: "var(--muted)",
                  }}
                >
                  {profile.intro}
                </p>
              ) : null}
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
                      {row.host.name}
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
                  <Link href="/merchant/gig/new">发布商单</Link>
                  <Icon name="arrow-right" size={12} />
                </li>
                <li>
                  <Link href="/merchant/hosts">主持人列表</Link>
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
