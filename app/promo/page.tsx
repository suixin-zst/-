import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "台前 · 主持人 × 商家直聘平台",
  description:
    "台前把 BOSS 直聘「双方直接聊、去掉中间人」的模式搬到按场次结算的活动主持场景，砍掉中介 30% 抽成，平台只收 8%。",
};

/**
 * /promo —— 宣传落地页（公开，无需登录）
 *
 * 内容取自 docs/promo.html。纯静态，不查库、不依赖登录。
 */
export default function PromoPage() {
  return (
    <main className="overflow-hidden">
      <div className="mx-auto max-w-6xl px-6">
        {/* 顶栏 */}
        <div className="flex items-center gap-3 py-6">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-spotlight font-display text-xl font-black text-white shadow-lg shadow-spotlight/30">
            台
          </div>
          <div className="font-display text-xl font-bold">台前</div>
          <div className="ml-auto rounded-full bg-spotlight-tint px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-spotlight-deep">
            Host × Merchant · 直聘
          </div>
        </div>

        {/* Hero */}
        <header className="grid items-center gap-10 py-10 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.3em] text-spotlight">
              主持人 × 商家 · 直聘平台
            </div>
            <h1 className="mt-4 font-display text-4xl font-black leading-[1.12] tracking-tight md:text-6xl">
              好主持，
              <br />
              不该只在
              <span className="relative inline-block">
                <span className="relative z-10">群里等活</span>
                <span className="absolute bottom-1 left-0 right-0 -z-0 h-3 bg-spotlight-tint" />
              </span>
              。
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
              把{" "}
              <b className="text-spotlight-deep">BOSS 直聘「双方直接聊、去掉中间人」</b>
              的模式，搬到「按场次结算的活动主持」场景——砍掉微信群的混乱和不透明，也砍掉中介{" "}
              <b className="text-spotlight-deep">30% 的抽成</b>，平台只收{" "}
              <b className="text-spotlight-deep">8%</b>。
            </p>
          </div>

          {/* 费用卡 */}
          <div className="rounded-3xl border border-line bg-card p-6 shadow-2xl shadow-ink/10">
            <div className="flex items-stretch gap-3">
              <div className="flex-1 rounded-2xl border border-line bg-paper-2 px-4 py-4">
                <div className="text-xs tracking-wider text-ink-soft">中介 / 群主</div>
                <div className="mt-2 font-display text-4xl font-black text-ink-soft line-through decoration-spotlight decoration-2">
                  30%
                </div>
                <div className="mt-1.5 text-xs text-ink-soft">层层抽成，价格不透明</div>
              </div>
              <div className="self-center font-black text-spotlight">→</div>
              <div className="flex-1 rounded-2xl bg-gradient-to-br from-[#1c1712] to-[#33261c] px-4 py-4 text-[#f3ead9]">
                <div className="text-xs tracking-wider text-[#c8b9a4]">台前平台</div>
                <div className="mt-2 font-display text-4xl font-black text-[#e8b960]">
                  8%<span className="text-sm font-semibold text-[#c8b9a4]"> / 单</span>
                </div>
                <div className="mt-1.5 text-xs text-[#c8b9a4]">透明服务费，一场一结</div>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-ink-soft">同样的活，多到手的钱。</div>
          </div>
        </header>

        {/* 主持人 */}
        <section className="py-14">
          <span className="inline-flex rounded-full bg-spotlight-tint px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-spotlight-deep">
            FOR HOSTS · 主持人价值
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-snug md:text-4xl">
            从「被抽成、被动等活」
            <br />
            到「自己定价、主动找活」
          </h2>
          <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            现状：作品散在朋友圈、每次被当新人重介绍，靠群主派单，中介抽走{" "}
            <b className="text-ink-2">30%</b>。
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              <><b>主页 + 作品集</b>（视频/音频/图片），一次建立专业档案，不再反复自证</>,
              <><b>自主定价</b>：时薪 / 半天 / 全天自己定，平台仅抽 <b>8%</b>，收入更透明</>,
              <><b>商单大厅</b>按城市 / 类型 / 档期 / 预算筛选，<b>一键报名</b></>,
              <>和商家<b>直接聊</b>，谈档期谈价格，越过中间人</>,
              <>评分 + 评价 + 实名认证，<b>信誉沉淀成资产</b>，老客可复购</>,
            ].map((t, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-2xl border border-line bg-card px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-spotlight-tint text-[13px] font-extrabold text-spotlight-deep">
                  ✓
                </span>
                <span className="text-[15px] leading-relaxed text-ink-2">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 商家 */}
        <section className="py-14">
          <span className="inline-flex rounded-full bg-gold-tint px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-gold-deep">
            FOR MERCHANTS · 商家价值
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-snug md:text-4xl">
            从「群里瞎找、靠赌」
            <br />
            到「看作品评价、精准邀约」
          </h2>
          <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            现状：群里发需求来一堆人、质量参差，靠熟人推荐、选择面窄，还得吃中介加价。
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              <>按城市 / 类型 / 预算 / <b>评分</b>精准筛人，不用挨个问</>,
              <>先看<b>作品 + 评价 + 认证</b>再决定聊不聊，降低踩坑（放鸽子、现场不行）</>,
              <><b>双通道</b>：发商单等报名（被动），或个人主页直接邀约（主动）</>,
              <>明码标价、横向对比，<b>快速决策</b></>,
              <>服务费透明 <b>8%</b>（对比中介 30%），成本可控</>,
            ].map((t, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-2xl border border-line bg-card px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-tint text-[13px] font-extrabold text-gold-deep">
                  ✓
                </span>
                <span className="text-[15px] leading-relaxed text-ink-2">{t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 场景差异 */}
        <section className="py-14">
          <span className="inline-flex rounded-full bg-jade-soft px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] text-jade-deep">
            WHY NOT JUST BOSS · 场景差异
          </span>
          <h2 className="mt-4 font-display text-3xl font-extrabold leading-snug md:text-4xl">
            不是「抄 BOSS」，
            <br />
            是把范式搬到对的场景
          </h2>
          <p className="mt-3.5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            BOSS 直聘是「全职招聘、按月薪」；台前是「单场活动、按场结」——底层逻辑完全不同。
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              <><b>按场次不按月薪</b>：一场一结，轻量撮合，不走 offer / 入职流程</>,
              <><b>作品即简历</b>：主持人的核心竞争力是视频/音频作品，不是文字履历</>,
              <><b>「档期」是核心维度</b>：找人第一问「这天有空吗」，BOSS 没有档期概念</>,
              <><b>双角色分流界面</b>：主持人看商单、商家看作品，两套入口，一进门就进自己的世界</>,
            ].map((t, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-2xl border border-line bg-card px-4 py-4 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-jade-soft text-[13px] font-extrabold text-jade-deep">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed text-ink-2">{t}</span>
              </div>
            ))}
            <div className="flex gap-3 rounded-2xl border border-line bg-card px-4 py-4">
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-jade-soft text-[13px] font-extrabold text-jade-deep">
                5
              </span>
              <span className="text-[15px] leading-relaxed text-ink-soft">
                诚实差距：资金担保、风控、规模背书是后期补齐的事，当前靠「闭环走顺 + 场景更贴」取胜
              </span>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="my-6 flex flex-wrap items-center gap-6 rounded-[28px] bg-gradient-to-br from-[#1c1712] via-[#2a211a] to-[#3f2c20] px-11 py-12 text-[#f3ead9] shadow-2xl">
          <div className="font-display text-2xl font-extrabold leading-snug md:text-4xl">
            把中介抽走的 30%，
            <br />
            <em className="not-italic text-[#e8b960]">还给真正上场的人。</em>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs tracking-wider text-[#c8b9a4]">平台服务费</div>
            <div className="font-display text-5xl font-black text-[#e8b960]">8%</div>
            <div className="mt-1 text-xs text-[#c8b9a4]">中介现状：30%</div>
          </div>
        </div>

        <p className="pb-16 pt-4 text-center text-xs tracking-wide text-ink-soft">
          台前 · <b className="text-ink-2">主持人 × 商家直聘平台</b> &nbsp;|&nbsp; 砍掉微信群，砍掉中介抽成
        </p>
      </div>
    </main>
  );
}
