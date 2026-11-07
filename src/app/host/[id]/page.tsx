import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rating } from "@/components/ui/Rating";
import { Avatar } from "@/components/ui/Avatar";
import { InviteHostButton } from "@/components/hosts/InviteHostButton";
import { getHost, getHosts } from "@/lib/data";
import { getSessionUser } from "@/lib/session";
import { formatNumber } from "@/lib/format";

export const dynamic = "force-dynamic";

type PageParams = Promise<{ id: string }>;

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { id } = await params;
  const host = await getHost(id);
  return {
    title: host ? `${host.name} · 台前 TAIQIAN` : "主持人 · 台前 TAIQIAN",
    description: host?.tagline,
  };
}

export default async function HostProfilePage({
  params,
}: {
  params: PageParams;
}) {
  const { id } = await params;
  const host = await getHost(id);

  if (!host) notFound();

  const allHosts = await getHosts();
  const viewer = await getSessionUser();
  const canInvite = viewer?.role !== "host";
  const similar = allHosts
    .filter(
      (item) =>
        item.id !== host.id &&
        item.styles.some((style) => host.styles.includes(style)),
    )
    .slice(0, 2);

  return (
    <main>
      <section className="profile-hero">
        <div className="container profile-hero-inner">
          <div className={`profile-portrait tone-${host.tone}`}>
            <span className="initial">{host.name.slice(0, 1)}</span>
          </div>

          <div>
            <div className="profile-name">
              <h1>{host.name}</h1>
              {host.verified ? (
                <span className="badge-verified">
                  <Icon name="check" size={10} strokeWidth={3} />
                  已认证
                </span>
              ) : (
                <span className="tag">未认证</span>
              )}
              <span className="tag tag-gold">{host.city}</span>
            </div>

            <p className="profile-tagline">{host.tagline}</p>

            <div className="profile-tags">
              {host.styles.map((style) => (
                <span className="tag" key={style}>
                  {style}
                </span>
              ))}
              <span className="tag">普通话一级甲等</span>
              <span className="tag">可中英双语</span>
            </div>

            <div className="profile-stats">
              <div className="profile-stat">
                <b>
                  {host.rating.toFixed(1)}
                  <span style={{ fontSize: 12 }}> / 5</span>
                </b>
                <span>{host.ratingCount} 条合作评价</span>
              </div>
              <div className="profile-stat">
                <b>{host.experienceYears} 年</b>
                <span>从业经验</span>
              </div>
              <div className="profile-stat">
                <b>{host.responseMinutes} 分钟</b>
                <span>平均响应</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            {canInvite ? (
              <InviteHostButton hostId={host.id} hostName={host.name} />
            ) : (
              <Button href="/host/dashboard" variant="gold">
                进入我的工作台
              </Button>
            )}
            <Button href="#works" variant="ghost-light" icon="play">
              先看作品
            </Button>
          </div>
        </div>
      </section>

      <div className="container profile-body">
        <div>
          <section className="profile-section">
            <div className="profile-section-head">
              <h2>关于我</h2>
              <span>HOST PROFILE</span>
            </div>
            <p className="lead" style={{ fontSize: 14 }}>
              {host.bio}
            </p>
          </section>

          <section className="profile-section" id="works">
            <div className="profile-section-head">
              <h2>作品集</h2>
              <span>现场片段 · 演示占位</span>
            </div>
            <div className="work-grid">
              {host.works.map((work) => (
                <div className="work-card" key={work.id}>
                  <div className={`work-thumb tone-${work.tone}`}>
                    {work.url && work.type === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        className="work-media"
                        src={work.url}
                        alt={work.title}
                      />
                    ) : null}
                    {work.url && work.type === "video" ? (
                      <video
                        className="work-media"
                        src={work.url}
                        muted
                        loop
                        playsInline
                      />
                    ) : null}
                    {work.type === "video" || work.type === "audio" ? (
                      <span className="play-btn">
                        <Icon name="play" size={15} />
                      </span>
                    ) : null}
                    {work.url ? (
                      <a
                        className="work-open"
                        href={work.url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`打开作品 ${work.title}`}
                      />
                    ) : null}
                  </div>
                  <div className="work-body">
                    <b>{work.title}</b>
                    <span>
                      {work.type === "video"
                        ? "视频"
                        : work.type === "image"
                          ? "图片"
                          : "音频"}{" "}
                      · {work.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-head">
              <h2>报价</h2>
              <span>透明报价 · 不含差旅</span>
            </div>
            <div className="pricing-grid">
              <div className="price-card">
                <span className="label">按小时</span>
                <b>¥{formatNumber(host.priceHourly)}</b>
                <span>2 小时起订</span>
              </div>
              <div className="price-card featured">
                <span className="label">半天 · 最常订</span>
                <b>¥{formatNumber(host.priceHalfDay)}</b>
                <span>4 小时以内</span>
              </div>
              <div className="price-card">
                <span className="label">全天</span>
                <b>¥{formatNumber(host.priceFullDay)}</b>
                <span>8 小时以内</span>
              </div>
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-head">
              <h2>可接档期</h2>
              <span>未来 30 天</span>
            </div>
            <div className="availability">
              {host.availability.map((day) => (
                <div
                  className={`avail-day ${day.open ? "open" : ""}`}
                  key={day.date}
                >
                  <b>{day.date}</b>
                  <span>{day.open ? "可接" : "已满"}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="profile-section">
            <div className="profile-section-head">
              <h2>合作评价</h2>
              <span>{host.ratingCount} 条真实评价</span>
            </div>
            <div className="review-grid">
              {host.reviews.map((review) => (
                <div className="review-card" key={review.id}>
                  <Rating rating={review.rating} hideCount />
                  <p>{review.content}</p>
                  <div className="review-meta">
                    <span>{review.merchant}</span>
                    <span>{review.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="profile-side">
          <div className="side-card">
            <h3>合作流程</h3>
            <ul className="side-list">
              <li>
                <span>01 发起邀约</span>
                <b>站内信</b>
              </li>
              <li>
                <span>02 确认档期</span>
                <b>直接聊</b>
              </li>
              <li>
                <span>03 线下执行</span>
                <b>平台留痕</b>
              </li>
            </ul>
            {canInvite ? (
              <div style={{ marginTop: 16 }}>
                <InviteHostButton
                  hostId={host.id}
                  hostName={host.name}
                  variant="stage"
                  size="md"
                />
              </div>
            ) : null}
          </div>

          <div className="side-card">
            <h3>平台保障</h3>
            <ul className="side-list">
              <li>
                <span>
                  <Icon name="shield" size={12} /> 身份与作品核验
                </span>
                <b>已通过</b>
              </li>
              <li>
                <span>
                  <Icon name="star" size={12} /> 合作评价
                </span>
                <b>{host.rating.toFixed(1)} 分</b>
              </li>
              <li>
                <span>
                  <Icon name="message" size={12} /> 未成交保护
                </span>
                <b>不露手机号</b>
              </li>
            </ul>
          </div>

          <div className="side-card">
            <h3>相似主持人</h3>
            <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
              {similar.map((item) => (
                <Link
                  href={`/host/${item.id}`}
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Avatar name={item.name} tone={item.tone} size={38} />
                  <span style={{ flex: 1 }}>
                    <b style={{ fontSize: 13, display: "block" }}>
                      {item.name}
                    </b>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>
                      {item.city} · {item.styles.join(" / ")}
                    </span>
                  </span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>
                    ¥{formatNumber(item.priceHalfDay)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
