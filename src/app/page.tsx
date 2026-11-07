import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Rating } from "@/components/ui/Rating";
import { Tag } from "@/components/ui/Tag";
import { HostCard } from "@/components/hosts/HostCard";
import { GigCard } from "@/components/gigs/GigCard";
import { getFeaturedGigs, getFeaturedHosts, getGigs, getHosts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredHosts, featuredGigs, allHosts, allGigs] = await Promise.all([
    getFeaturedHosts(4),
    getFeaturedGigs(3),
    getHosts(),
    getGigs(),
  ]);

  const openGigs = allGigs.filter((gig) => gig.status === "open").length;

  return (
    <main>
      <section className="hero">
        <div className="hero-curtain left" />
        <div className="hero-curtain right" />

        <div className="container hero-inner">
          <div>
            <span className="eyebrow hero-eyebrow">主持人 × 商家 · 直聘平台</span>
            <h1 className="display-xl hero-title">
              好主持，
              <br />
              不该只在<span className="accent">群里</span>
              <br />
              等活。
            </h1>
            <p className="hero-sub">
              作品摆到台前，报价写得明白，双方直接开聊。把中介抽走的 30%，
              还给真正上场的人。
            </p>

            <div className="hero-actions">
              <Button
                href="/merchant/hosts"
                variant="gold"
                size="lg"
                icon="arrow-right"
                iconRight
              >
                找主持人
              </Button>
              <Button href="/host/gigs" variant="ghost-light" size="lg">
                我是主持人，找商单
              </Button>
            </div>

            <div className="hero-note">
              已收录 {allHosts.length * 140 + 26} 位主持 · 平均 18 分钟响应 ·
              平台服务费 8%
            </div>
          </div>

          <div className="hero-art">
            <div className="hero-spot" />

            <div className="float-chip one">
              <span className="dot" />
              本周可接 · 上海
            </div>
            <div className="float-chip two">
              <Icon name="shield" size={12} />
              实名认证 · 作品可看
            </div>

            <div className="casting-card">
              <div className="casting-portrait tone-rose">
                <div className="casting-top">
                  <span className="tag tag-ink">婚礼 / 年会</span>
                  <span className="badge-verified">已认证</span>
                </div>
                <span className="casting-initial">林</span>
                <div className="casting-bottom">
                  <div>
                    <strong>林知遥</strong>
                    <span>上海 · 8 年经验</span>
                  </div>
                  <Rating rating={4.9} count={126} />
                </div>
              </div>

              <div className="casting-body">
                <div className="casting-tags">
                  <Tag>婚礼</Tag>
                  <Tag>年会</Tag>
                  <Tag>中英双语</Tag>
                </div>
                <div className="casting-price">
                  <div>
                    <b>¥4,500</b>
                    <small> / 半天起</small>
                  </div>
                  <span className="tag tag-jade">
                    <span className="status-dot" />
                    可接 11/08
                  </span>
                </div>
              </div>
            </div>

            <Icon name="mic" size={68} className="hero-mic" strokeWidth={1.2} />
          </div>
        </div>
      </section>

      <div className="container stats-strip">
        <div className="stats-card">
          <div className="stat">
            <b>1,286</b>
            <span>入驻主持人</span>
          </div>
          <div className="stat">
            <b>18 min</b>
            <span>平均响应时间</span>
          </div>
          <div className="stat">
            <b>8%</b>
            <span>平台服务费</span>
          </div>
          <div className="stat">
            <b>4.8 / 5</b>
            <span>平均合作评分</span>
          </div>
        </div>
      </div>

      <section className="section" id="roles">
        <div className="container">
          <div className="section-head">
            <div className="section-head-copy">
              <span className="eyebrow">Two worlds, one stage</span>
              <h2 className="display-lg section-title">
                一进门，就进入自己的世界。
              </h2>
              <p className="section-sub">
                主持人看商单，商家看作品。两套界面，两种语言，但都在同一个舞台上。
              </p>
            </div>
            <div className="hidden text-[11px] text-[var(--muted)] md:block">
              共 {openGigs} 张商单正在招募
            </div>
          </div>

          <div className="role-grid">
            <div className="role-panel host">
              <div>
                <span className="role-kicker">FOR HOSTS</span>
                <h3 className="role-title">把你的作品，摆到台前。</h3>
                <ul className="role-list">
                  <li>主页 + 作品集，不再被当新人重新介绍</li>
                  <li>商单大厅直接报名，价格自己定</li>
                  <li>和商家直接聊，不被中介抽成</li>
                </ul>
              </div>
              <div className="role-cta">
                <Button href="/host/gigs" icon="arrow-right" iconRight>
                  进入主持人端
                </Button>
                <span className="text-[11px] text-white/60">
                  先看看最近的商单
                </span>
              </div>
            </div>

            <div className="role-panel merchant">
              <div>
                <span className="role-kicker">FOR MERCHANTS</span>
                <h3 className="role-title">找主持，不再靠群里赌运气。</h3>
                <ul className="role-list">
                  <li>按城市、类型、预算筛人</li>
                  <li>先看作品和评价，再决定聊不聊</li>
                  <li>发一张商单，等对的人来报名</li>
                </ul>
              </div>
              <div className="role-cta">
                <Button href="/merchant/hosts" icon="arrow-right" iconRight>
                  进入商家端
                </Button>
                <span className="text-[11px] text-white/60">
                  已收录 {allHosts.length} 位演示主持
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="section-tight"
        id="how"
        style={{
          background: "rgba(255, 250, 240, 0.46)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="container">
          <div className="section-head">
            <div className="section-head-copy">
              <span className="eyebrow">How it works</span>
              <h2 className="display-lg section-title">三步，从需求到上场。</h2>
            </div>
          </div>

          <div className="steps">
            <div className="step">
              <span className="step-num">01</span>
              <h3 className="step-title">发一张商单</h3>
              <p className="step-text">
                城市、日期、预算、风格要求，两分钟写完。公开招募，也可以直接邀约。
              </p>
            </div>
            <div className="step">
              <span className="step-num">02</span>
              <h3 className="step-title">看作品，不看头衔</h3>
              <p className="step-text">
                每位主持都有作品集、真实评价和透明报价。先看现场，再决定要不要聊。
              </p>
            </div>
            <div className="step">
              <span className="step-num">03</span>
              <h3 className="step-title">直接开聊，敲定合作</h3>
              <p className="step-text">
                站内直接沟通，状态从「报名」走到「已达成」。没有群主，没有中间人。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div className="section-head-copy">
              <span className="eyebrow">Featured hosts</span>
              <h2 className="display-lg section-title">这周，台上的他们。</h2>
            </div>
            <Button
              href="/merchant/hosts"
              variant="ghost"
              size="sm"
              icon="arrow-right"
              iconRight
            >
              全部主持人
            </Button>
          </div>

          <div className="host-grid">
            {featuredHosts.map((host) => (
              <HostCard key={host.id} host={host} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="section-head">
            <div className="section-head-copy">
              <span className="eyebrow">Open calls</span>
              <h2 className="display-lg section-title">最近在找人的商单。</h2>
            </div>
            <Button
              href="/host/gigs"
              variant="ghost"
              size="sm"
              icon="arrow-right"
              iconRight
            >
              进入商单大厅
            </Button>
          </div>

          <div className="gig-grid">
            {featuredGigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="trust">
        <div className="container">
          <div className="section-head">
            <div className="section-head-copy">
              <span className="eyebrow">Built on trust</span>
              <h2 className="display-lg section-title">台上见真章，台下有保障。</h2>
              <p className="section-sub">
                主持行业最贵的不是报价，是选错人的成本。我们把判断依据摆到明面上。
              </p>
            </div>
          </div>

          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">
                <Icon name="shield" size={18} />
              </div>
              <h3>实名认证</h3>
              <p>身份与从业信息核验，认证标识直接展示在主页。</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">
                <Icon name="video" size={18} />
              </div>
              <h3>作品可看</h3>
              <p>婚礼、年会、发布会现场视频，先看控场再谈价格。</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">
                <Icon name="star" size={18} />
              </div>
              <h3>评价可查</h3>
              <p>合作过的商家留下真实评价，不刷分，不隐藏。</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">
                <Icon name="message" size={18} />
              </div>
              <h3>直接沟通</h3>
              <p>站内聊天敲定细节，未成交前不暴露私人联系方式。</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="container">
          <div className="final-cta">
            <div>
              <span
                className="eyebrow"
                style={{ color: "rgba(245, 239, 228, 0.5)" }}
              >
                Next call
              </span>
              <h2>下一场活动，从台前开始。</h2>
            </div>
            <div className="actions">
              <Button href="/merchant/gig/new" variant="gold" size="lg">
                发布商单
              </Button>
              <Button href="/host/gigs" variant="ghost-light" size="lg">
                找商单
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
