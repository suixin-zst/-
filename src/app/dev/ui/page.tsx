import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { Rating } from "@/components/ui/Rating";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/EmptyState";
import { GigCardSkeleton, HostCardSkeleton, Skeleton } from "@/components/ui/Skeleton";
import { HostCard } from "@/components/hosts/HostCard";
import { GigCard } from "@/components/gigs/GigCard";
import { gigs, hosts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "组件库 · 台前 TAIQIAN",
  description: "台前设计系统与组件样板页。",
};

const COLORS = [
  { name: "Ink", value: "#15110E", note: "主文字 / 深色区块" },
  { name: "Paper", value: "#F5EFE4", note: "页面底色" },
  { name: "Card", value: "#FFFAF0", note: "卡片表面" },
  { name: "Stage", value: "#B23A2F", note: "主持人端主色" },
  { name: "Gold", value: "#C9953C", note: "强调 / 评分" },
  { name: "Jade", value: "#2E5E4E", note: "商家端主色" },
  { name: "Muted", value: "#7B7062", note: "次要文字" },
  { name: "Line", value: "#DDD2BF", note: "分割线 / 边框" },
];

export default function DevUiPage() {
  const host = hosts[0];
  const gig = gigs[0];

  return (
    <main className="dev-shell">
      <div className="container">
        <span className="eyebrow">Design system · v0.1</span>
        <h1 className="display-lg" style={{ marginTop: 12 }}>
          台前组件库
        </h1>
        <p className="lead" style={{ marginTop: 10, maxWidth: 640 }}>
          主持人端与商家端共用一套组件，用主色和语气区分身份。这个页面是给队友的样板间：
          新增页面时先来这里找现成样式，不要另起一套。
        </p>

        <section className="dev-section">
          <h2>01 · 色彩</h2>
          <div className="dev-grid">
            {COLORS.map((color) => (
              <div className="swatch" key={color.name}>
                <div
                  className="swatch-color"
                  style={{ background: color.value }}
                />
                <div className="swatch-meta">
                  <b>{color.name}</b>
                  <span>{color.value}</span>
                  <div style={{ marginTop: 3 }}>{color.note}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="dev-section">
          <h2>02 · 字体层级</h2>
          <div className="type-stack">
            <div className="type-row">
              <span className="label">DISPLAY XL</span>
              <span className="display-xl">台前，见真章。</span>
            </div>
            <div className="type-row">
              <span className="label">DISPLAY LG</span>
              <span className="display-lg">好主持，不该只在群里等活。</span>
            </div>
            <div className="type-row">
              <span className="label">DISPLAY MD</span>
              <span className="display-md">这周，台上的他们。</span>
            </div>
            <div className="type-row">
              <span className="label">LEAD</span>
              <span className="lead">
                作品摆到台前，报价写得明白，双方直接开聊。
              </span>
            </div>
            <div className="type-row">
              <span className="label">BODY</span>
              <span>
                正文使用系统无衬线，15px / 1.7。用于说明、表单与列表。
              </span>
            </div>
            <div className="type-row">
              <span className="label">EYEBROW</span>
              <span className="eyebrow">Featured hosts</span>
            </div>
            <div className="type-row">
              <span className="label">MONO / 数字</span>
              <span className="mono" style={{ fontSize: 20 }}>
                ¥4,500 / HALF DAY
              </span>
            </div>
          </div>
        </section>

        <section className="dev-section">
          <h2>03 · 按钮</h2>
          <div className="demo-row">
            <Button>Primary</Button>
            <Button variant="stage">Stage</Button>
            <Button variant="gold">Gold</Button>
            <Button variant="jade">Jade</Button>
            <Button variant="ghost">Ghost</Button>
            <Button disabled>Disabled</Button>
          </div>
          <div className="demo-row">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button icon="arrow-right" iconRight>
              Arrow right
            </Button>
          </div>
        </section>

        <section className="dev-section">
          <h2>04 · 标签与认证</h2>
          <div className="demo-row">
            <Tag>默认标签</Tag>
            <Tag tone="stage">婚礼</Tag>
            <Tag tone="gold">发布会</Tag>
            <Tag tone="jade">可接</Tag>
            <Tag tone="ink">上海</Tag>
            <span className="badge-verified">
              <Icon name="check" size={10} strokeWidth={3} />
              已认证
            </span>
            <span className="tag tag-jade">
              <span className="status-dot" />
              招募中
            </span>
          </div>
        </section>

        <section className="dev-section">
          <h2>05 · 表单</h2>
          <div className="demo-stack">
            <div className="field" style={{ marginTop: 0 }}>
              <label>
                活动名称 <em>必填</em>
              </label>
              <input className="input" placeholder="例：新车发布会 · 主会场" />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>
                活动类型 <em>必填</em>
              </label>
              <select className="select" defaultValue="发布会">
                <option>婚礼</option>
                <option>年会</option>
                <option>发布会</option>
                <option>路演</option>
                <option>展会</option>
                <option>直播</option>
              </select>
            </div>
            <div className="field-row" style={{ marginTop: 0 }}>
              <div className="field" style={{ marginTop: 0 }}>
                <label>预算下限</label>
                <input className="input" placeholder="¥4,000" />
              </div>
              <div className="field" style={{ marginTop: 0 }}>
                <label>预算上限</label>
                <input className="input" placeholder="¥6,000" />
              </div>
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>补充说明</label>
              <textarea
                className="textarea"
                placeholder="活动流程、场地情况、特殊要求……"
              />
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>风格标签</label>
              <div className="chip-row" style={{ marginTop: 0 }}>
                <button type="button" className="chip">
                  婚礼
                </button>
                <button type="button" className="chip on">
                  发布会
                </button>
                <button type="button" className="chip">
                  中英双语
                </button>
                <button type="button" className="chip">
                  可彩排
                </button>
              </div>
            </div>
            <div className="field" style={{ marginTop: 0 }}>
              <label>出错状态</label>
              <input className="input" defaultValue="未填写城市" />
              <div className="error-text">请选择活动城市</div>
            </div>
          </div>
        </section>

        <section className="dev-section">
          <h2>06 · 头像与评分</h2>
          <div className="demo-row">
            <Avatar name="林知遥" tone="rose" size={52} verified />
            <Avatar name="陈默" tone="ink" size={52} verified />
            <Avatar name="苏晚" tone="gold" size={52} />
            <Avatar name="周予安" tone="jade" size={52} />
            <Avatar name="顾言" tone="blue" size={52} />
            <Avatar name="白露" tone="plum" size={52} />
          </div>
          <div className="demo-row">
            <Rating rating={4.9} count={126} />
            <Rating rating={4.7} count={74} />
            <Rating rating={5} count={312} />
          </div>
        </section>

        <section className="dev-section">
          <h2>07 · 主持人卡 / 商单卡</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <HostCard host={host} />
            <HostCard host={hosts[1]} />
            <HostCard host={hosts[2]} />
            <HostCard host={hosts[3]} />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3" style={{ marginTop: 16 }}>
            <GigCard gig={gig} />
            <GigCard gig={gigs[1]} />
            <GigCard gig={gigs[2]} />
          </div>
        </section>

        <section className="dev-section">
          <h2>08 · 报价卡 / 评价卡</h2>
          <div className="pricing-grid">
            <div className="price-card">
              <span className="label">按小时</span>
              <b>¥1,200</b>
              <span>2 小时起订</span>
            </div>
            <div className="price-card featured">
              <span className="label">半天（推荐）</span>
              <b>¥4,500</b>
              <span>4 小时以内</span>
            </div>
            <div className="price-card">
              <span className="label">全天</span>
              <b>¥8,000</b>
              <span>8 小时以内</span>
            </div>
          </div>
          <div className="review-grid" style={{ marginTop: 14 }}>
            <div className="review-card">
              <Rating rating={5} hideCount />
              <p>控场很稳，临时加了颁奖环节也接得住。</p>
              <div className="review-meta">
                <span>上海某公关公司</span>
                <span>2026-10</span>
              </div>
            </div>
            <div className="review-card">
              <Rating rating={5} hideCount />
              <p>提前一天对了流程，现场比预期还顺。</p>
              <div className="review-meta">
                <span>某科技公司</span>
                <span>2026-09</span>
              </div>
            </div>
            <div className="review-card">
              <Rating rating={4.8} hideCount />
              <p>声音条件和镜头感都很好，客户当场要了联系方式。</p>
              <div className="review-meta">
                <span>婚礼策划工作室</span>
                <span>2026-08</span>
              </div>
            </div>
          </div>
        </section>

        <section className="dev-section">
          <h2>09 · 空态与加载态</h2>
          <EmptyState
            icon="search"
            title="没有找到匹配的主持人"
            description="试试放宽城市或价格区间，或者直接发布一张商单，让主持人来报名。"
            action={
              <Button href="/merchant/gig/new" variant="ghost" size="sm">
                发布商单
              </Button>
            }
          />
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
            style={{ marginTop: 18 }}
          >
            <HostCardSkeleton />
            <HostCardSkeleton />
            <HostCardSkeleton />
            <HostCardSkeleton />
          </div>
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-3"
            style={{ marginTop: 18 }}
          >
            <GigCardSkeleton />
            <GigCardSkeleton />
            <GigCardSkeleton />
          </div>
          <div className="demo-stack" style={{ marginTop: 18 }}>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </section>

        <section className="dev-section">
          <h2>10 · 使用规则</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2" style={{ marginTop: 18 }}>
            <div className="panel" style={{ padding: 22 }}>
              <h3 className="display-md" style={{ fontSize: 20 }}>
                主色分工
              </h3>
              <p className="section-sub" style={{ marginTop: 8 }}>
                主持人端用 Stage 红，商家端用 Jade 绿。Gold 只用于强调、评分和关键 CTA，
                不要大面积铺。
              </p>
            </div>
            <div className="panel" style={{ padding: 22 }}>
              <h3 className="display-md" style={{ fontSize: 20 }}>
                字体分工
              </h3>
              <p className="section-sub" style={{ marginTop: 8 }}>
                标题、名字、数字用衬线体（display）；正文、表单、按钮用系统无衬线。
                数字统一等宽，避免跳动。
              </p>
            </div>
            <div className="panel" style={{ padding: 22 }}>
              <h3 className="display-md" style={{ fontSize: 20 }}>
                数据边界
              </h3>
              <p className="section-sub" style={{ marginTop: 8 }}>
                页面只从 <code>src/lib/data.ts</code> 取数。副手不直接 import
                mock-data，主力替换 Supabase 时页面零改动。
              </p>
            </div>
            <div className="panel" style={{ padding: 22 }}>
              <h3 className="display-md" style={{ fontSize: 20 }}>
                状态规范
              </h3>
              <p className="section-sub" style={{ marginTop: 8 }}>
                每个列表页必须有空态；每个异步页面必须有骨架屏。空态要说清楚
                「为什么空」和「下一步做什么」。
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
