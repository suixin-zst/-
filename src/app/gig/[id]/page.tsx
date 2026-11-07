import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationActions } from "@/components/applications/ApplicationActions";
import { StatusBadge } from "@/components/applications/StatusBadge";
import { ApplyGigButton } from "@/components/gigs/ApplyGigButton";
import { GigCard } from "@/components/gigs/GigCard";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { Tag } from "@/components/ui/Tag";
import { getGig, getSimilarGigs } from "@/lib/data";
import { listApplications } from "@/lib/server/db";
import { getSessionUser } from "@/lib/session";
import {
  formatBudget,
  formatEventDate,
  formatShortDate,
  gigStatusLabel,
} from "@/lib/format";

export const dynamic = "force-dynamic";

type PageParams = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { id } = await params;
  const gig = await getGig(id);
  return {
    title: gig ? `${gig.title} · 台前 TAIQIAN` : "商单详情 · 台前 TAIQIAN",
    description: gig?.description,
  };
}

export default async function GigDetailPage({ params }: { params: PageParams }) {
  const { id } = await params;
  const gig = await getGig(id);

  if (!gig) notFound();

  const similar = await getSimilarGigs(gig, 3);
  const isOpen = gig.status === "open";
  const user = await getSessionUser();
  const isOwner = Boolean(
    user && gig.merchantId && user.id === gig.merchantId,
  );
  const applications = isOwner && user
    ? (await listApplications({ merchantId: user.id })).filter(
        (row) => row.application.gig_id === gig.id,
      )
    : [];

  return (
    <main>
      <div className="container" style={{ paddingTop: 32 }}>
        <div className="breadcrumb">
          <Link href="/host/gigs">商单大厅</Link>
          <span>/</span>
          <span>{gig.type}</span>
        </div>
      </div>

      <div className="container">
        <div className="detail-grid">
          <div className="detail-main">
            <div className="gig-top">
              <Tag tone="gold">{gig.type}</Tag>
              <span className={`tag ${isOpen ? "tag-jade" : ""}`}>
                {isOpen ? <span className="status-dot" /> : null}
                {gigStatusLabel(gig.status)}
              </span>
              <span style={{ fontSize: 11, color: "var(--muted)" }}>
                发布于 {formatShortDate(gig.postedAt)}
              </span>
            </div>

            <h1 className="detail-title">{gig.title}</h1>
            <div className="detail-company">
              {gig.company} · {gig.city}
            </div>

            <div className="detail-meta-grid">
              <div className="meta-box">
                <span>活动城市</span>
                <b>{gig.city}</b>
              </div>
              <div className="meta-box">
                <span>活动日期</span>
                <b>{formatEventDate(gig.eventDate)}</b>
              </div>
              <div className="meta-box">
                <span>时长</span>
                <b>{gig.duration}</b>
              </div>
              <div className="meta-box">
                <span>预算</span>
                <b>{formatBudget(gig.budgetMin, gig.budgetMax)}</b>
              </div>
            </div>

            <section className="detail-section">
              <h2>活动说明</h2>
              <p>{gig.description}</p>
            </section>

            <section className="detail-section">
              <h2>主持人要求</h2>
              <div className="chip-row" style={{ marginTop: 0 }}>
                {gig.requirements.map((item) => (
                  <Tag key={item} tone="stage">
                    {item}
                  </Tag>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h2>合作说明</h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <div className="panel" style={{ padding: 18 }}>
                  <Icon name="message" size={17} />
                  <h3 style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>
                    报名后直接聊
                  </h3>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                    商家确认报名后，站内会话自动打开。
                  </p>
                </div>
                <div className="panel" style={{ padding: 18 }}>
                  <Icon name="wallet" size={17} />
                  <h3 style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>
                    平台不代收款
                  </h3>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                    报价与结算由双方确认，平台只收 8% 服务费。
                  </p>
                </div>
                <div className="panel" style={{ padding: 18 }}>
                  <Icon name="shield" size={17} />
                  <h3 style={{ fontSize: 13, fontWeight: 700, marginTop: 8 }}>
                    变更留痕
                  </h3>
                  <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                    时间、地点、流程变更都在站内确认。
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="detail-side">
            <div className="apply-card">
              <div className="label">BUDGET</div>
              <div className="budget">
                {formatBudget(gig.budgetMin, gig.budgetMax)}
                <span> / {gig.duration}</span>
              </div>

              <div className="divider" />

              <ul className="side-list">
                <li>
                  <span>活动日期</span>
                  <b>{formatEventDate(gig.eventDate)}</b>
                </li>
                <li>
                  <span>已报名</span>
                  <b>{gig.applicants} 人</b>
                </li>
                <li>
                  <span>状态</span>
                  <b>{gigStatusLabel(gig.status)}</b>
                </li>
              </ul>

              <div className="divider" />

              {isOwner ? (
                <p className="note">
                  这是你发布的商单。报名会出现在下方，接受后商单自动变成「已达成」。
                </p>
              ) : user?.role === "merchant" ? (
                <p className="note">
                  商家账号不能报名商单，请使用主持人账号。
                </p>
              ) : (
                <ApplyGigButton
                  gigId={gig.id}
                  gigTitle={gig.title}
                  disabled={!isOpen}
                />
              )}
              <p className="note">
                报名后可在站内直接沟通。平台不代收款项，合作细节由双方确认。
              </p>
            </div>

            <div className="side-card">
              <h3>商家信息</h3>
              <ul className="side-list">
                <li>
                  <span>发布方</span>
                  <b>{gig.company}</b>
                </li>
                <li>
                  <span>城市</span>
                  <b>{gig.city}</b>
                </li>
                <li>
                  <span>发布方身份</span>
                  <b>企业认证</b>
                </li>
              </ul>
            </div>

            {isOwner ? (
              <div className="side-card">
                <h3>报名情况 · {applications.length}</h3>
                <p
                  style={{
                    fontSize: 10,
                    color: "var(--muted)",
                    marginTop: 2,
                  }}
                >
                  累计 {gig.applicants} 人报名，列表展示最近记录
                </p>
                {applications.length ? (
                  applications.map((row) => (
                    <div className="app-row" key={row.application.id}>
                      <Avatar
                        name={row.host?.name ?? "主持人"}
                        tone="sand"
                        size={36}
                      />
                      <div className="app-main">
                        <div className="app-title">
                          <Link href={`/host/${row.host?.id ?? ""}`}>
                            {row.host?.name ?? "主持人"}
                          </Link>{" "}
                          <StatusBadge status={row.application.status} />
                        </div>
                        <div className="app-sub">{row.application.message}</div>
                        {row.application.status === "pending" ? (
                          <div style={{ marginTop: 8 }}>
                            <ApplicationActions id={row.application.id} />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dash-empty">还没有人报名。</div>
                )}
              </div>
            ) : null}
          </aside>
        </div>
      </div>

      {similar.length ? (
        <section className="container" style={{ paddingBottom: 80 }}>
          <div className="section-head">
            <div>
              <span className="eyebrow">Similar calls</span>
              <h2 className="display-md section-title" style={{ marginTop: 10 }}>
                相似商单
              </h2>
            </div>
          </div>
          <div className="gig-grid">
            {similar.map((item) => (
              <GigCard key={item.id} gig={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
