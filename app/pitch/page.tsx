import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "产品价值 · 台前",
  description: "台前 vs BOSS直聘 / 微信群中介：主持人×商家直聘，砍掉中介 30% 抽成，平台仅 8%。",
};

/**
 * /pitch —— 产品价值说明页（公开，无需登录）
 *
 * 给评委/合作方看的一页纸：主持人价值 / 商家价值 / 为什么不抄 BOSS。
 * 纯静态内容，不查数据库、不依赖登录。
 */
export default function PitchPage() {
  return (
    <main className="overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        {/* Hero */}
        <p className="text-sm font-semibold uppercase tracking-[0.32em] text-spotlight">
          台前 · 产品价值
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.12] tracking-tight md:text-6xl">
          好主持，
          <span className="relative inline-block">
            <span className="relative z-10">不该只在群里等活。</span>
            <span className="absolute bottom-1 left-0 right-0 -z-0 h-3 bg-spotlight-tint" />
          </span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          台前把{" "}
          <b className="text-spotlight-deep">BOSS 直聘「双方直接聊、去掉中间人」的模式</b>
          ，搬到「按场次结算的活动主持」场景——砍掉微信群的混乱和信息不透明，也砍掉中介{" "}
          <b className="text-spotlight-deep">30% 的抽成</b>，平台只收{" "}
          <b className="text-spotlight-deep">8%</b>。
        </p>

        {/* 三张卡 */}
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {/* 卡 1：主持人 */}
          <section className="group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-spotlight" />
            <div className="flex items-center text-xs font-bold uppercase tracking-[0.14em] text-spotlight-deep">
              FOR HOSTS · 主持人价值
              <span className="ml-auto font-display text-[15px] font-bold opacity-40">01</span>
            </div>
            <h2 className="mt-3.5 font-display text-2xl font-bold leading-snug">
              从「被抽成、被动等活」
              <br />
              到「自己定价、主动找活」
            </h2>
            <div className="mt-3 rounded-xl bg-paper-2 px-3 py-2.5 text-sm leading-relaxed text-ink-soft">
              现状：作品散在朋友圈、每次被当新人重介绍，靠群主派单，中介抽走{" "}
              <b className="text-ink-2">30%</b>。
            </div>
            <div className="my-5 h-px bg-line" />
            <ul className="space-y-3.5">
              {[
                <>主页 + 作品集（视频/音频/图片），一次建立专业档案，不再反复自证</>,
                <>自主定价：时薪 / 半天 / 全天自己定，平台仅抽 8%，收入更透明</>,
                <>商单大厅按城市 / 类型 / 档期 / 预算筛选，一键报名</>,
                <>和商家直接聊，谈档期谈价格，越过中间人</>,
                <>评分 + 评价 + 实名认证，信誉沉淀成资产，老客可复购</>,
              ].map((t, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                  <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-spotlight-tint text-xs font-bold text-spotlight-deep">
                    ✓
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 卡 2：商家 */}
          <section className="group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-gold" />
            <div className="flex items-center text-xs font-bold uppercase tracking-[0.14em] text-gold-deep">
              FOR MERCHANTS · 商家价值
              <span className="ml-auto font-display text-[15px] font-bold opacity-40">02</span>
            </div>
            <h2 className="mt-3.5 font-display text-2xl font-bold leading-snug">
              从「群里瞎找、靠赌」
              <br />
              到「看作品评价、精准邀约」
            </h2>
            <div className="mt-3 rounded-xl bg-paper-2 px-3 py-2.5 text-sm leading-relaxed text-ink-soft">
              现状：群里发需求来一堆人、质量参差，靠熟人推荐、选择面窄，还得吃中介加价。
            </div>
            <div className="my-5 h-px bg-line" />
            <ul className="space-y-3.5">
              {[
                <>按城市 / 类型 / 预算 / 评分精准筛人，不用挨个问</>,
                <>先看作品 + 评价 + 认证再决定聊不聊，降低踩坑（放鸽子、现场不行）</>,
                <>双通道：发商单等报名（被动），或个人主页直接邀约（主动）</>,
                <>明码标价、横向对比，快速决策</>,
                <>服务费透明 8%（对比中介 30%），成本可控</>,
              ].map((t, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                  <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-gold-tint text-xs font-bold text-gold-deep">
                    ✓
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 卡 3：场景差异 */}
          <section className="group relative flex flex-col overflow-hidden rounded-[22px] border border-line bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="absolute inset-x-0 top-0 h-1.5 bg-jade" />
            <div className="flex items-center text-xs font-bold uppercase tracking-[0.14em] text-jade-deep">
              WHY NOT JUST BOSS · 场景差异
              <span className="ml-auto font-display text-[15px] font-bold opacity-40">03</span>
            </div>
            <h2 className="mt-3.5 font-display text-2xl font-bold leading-snug">
              不是「抄 BOSS」，
              <br />
              是把范式搬到对的场景
            </h2>
            <div className="mt-3 rounded-xl bg-paper-2 px-3 py-2.5 text-sm leading-relaxed text-ink-soft">
              BOSS 直聘是「全职招聘、按月薪」；台前是「单场活动、按场结」——底层逻辑完全不同。
            </div>
            <div className="my-5 h-px bg-line" />
            <ul className="space-y-3.5">
              {[
                <>按场次不按月薪：一场一结，轻量撮合，不走 offer / 入职流程</>,
                <>作品即简历：主持人的核心竞争力是视频/音频作品，不是文字履历</>,
                <>「档期」是核心维度：找人第一问「这天有空吗」，BOSS 没有档期概念</>,
                <>双角色分流界面：主持人看商单、商家看作品，两套入口，一进门就进自己的世界</>,
                <span className="text-ink-soft">
                  诚实差距：资金担保、风控、规模背书是后期补齐的事，当前靠「闭环走顺 + 场景更贴」取胜
                </span>,
              ].map((t, i) => (
                <li key={i} className="flex gap-3 text-[15px] leading-relaxed text-ink-2">
                  <span className="mt-0.5 grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-jade-soft text-xs font-bold text-jade-deep">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* 定位带 */}
        <div className="mt-12 flex flex-wrap items-center gap-8 rounded-[22px] bg-gradient-to-br from-[#1c1712] via-[#2a211a] to-[#3a2a20] px-9 py-9 text-[#f3ead9] shadow-2xl">
          <div className="font-display text-2xl font-bold leading-snug md:text-3xl">
            把中介抽走的 30%，
            <br />
            <em className="not-italic text-[#e8b960]">还给真正上场的人。</em>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs tracking-wider text-[#c8b9a4]">平台服务费</div>
            <div className="font-display text-3xl font-bold text-[#e8b960]">
              8%
              <span className="text-sm font-normal text-[#c8b9a4]"> / 单</span>
            </div>
            <div className="text-xs text-[#c8b9a4]">中介现状：30%</div>
          </div>
        </div>

        <p className="mt-7 text-center text-xs tracking-wide text-ink-soft">
          台前 · <b className="text-ink-2">主持人 × 商家直聘平台</b> &nbsp;|&nbsp; 砍掉微信群，砍掉中介抽成
        </p>
      </div>
    </main>
  );
}
