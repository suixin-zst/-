import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { loadHosts, loadOpenGigs } from "@/lib/hosts";
import { demoHosts, demoGigs } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Rating } from "@/components/ui/rating";
import { Tag } from "@/components/ui/tag";

/**
 * 首页 —— 双角色分流入口 + 平台数据展示
 *
 * 从副手版本翻译：保留核心信息架构（hero + 数据统计 + 角色面板），
 * 用 Tailwind utility 重写样式，数据从 Supabase 实时读取
 */
export default async function HomePage() {
  const supabase = await createClient();
  const [hosts, openGigs] = await Promise.all([
    loadHosts(supabase),
    loadOpenGigs(supabase),
  ]);

  // 库空时用 demo 数量兜底，避免首页显示 0
  const hostCount = hosts.length > 0 ? hosts.length : demoHosts.length;
  const gigCount = openGigs.length > 0 ? openGigs.length : demoGigs.length;

  // 统计数据（初期用固定值，后续可改为实时聚合）
  const stats = [
    { value: hostCount.toString(), label: "入驻主持人" },
    { value: "18 min", label: "平均响应时间" },
    { value: "8%", label: "平台服务费" },
    { value: "4.8 / 5", label: "平均合作评分" },
  ];

  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)]">
        {/* 舞台灯光背景：顶部聚光锥 + 中轴暖光 + 舞台地板 */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="stage-cone absolute -top-28 left-1/2 h-[72vh] w-[560px] -translate-x-[72%] rotate-6" />
          <div className="stage-cone absolute -top-28 left-1/2 h-[72vh] w-[560px] -translate-x-[28%] -rotate-6 opacity-50" />
          <div className="absolute left-1/2 top-0 h-[62vh] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_top,rgba(201,149,60,0.12),transparent_70%)]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-paper-2/70 to-transparent" />
          {/* 舞台顶灯 */}
          <div className="absolute left-1/2 top-6 flex -translate-x-1/2 gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-gold/40"
                style={{ opacity: 0.25 + i * 0.12 }}
              />
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
            {/* 左侧：文案 + CTA */}
            <div className="flex flex-col justify-center">
              <p className="mb-6 text-sm uppercase tracking-[0.3em] text-spotlight">
                主持人 × 商家 · 直聘平台
              </p>

              <h1 className="font-display text-5xl font-bold leading-[1.12] md:text-6xl">
                好主持，
                <br />
                值得一个更好的
                <span className="relative inline-block">
                  <span className="relative z-10">台前</span>
                  <span className="absolute bottom-1 left-0 right-0 h-3 bg-spotlight-tint" />
                </span>
                。
              </h1>

              <p className="mt-8 max-w-lg text-lg text-ink-2">
                作品摆到台前，报价写得明白，双方直接开聊。把中介抽走的 30%，还给真正上场的人。
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/merchant/hosts">
                  <Button variant="primary" size="lg" className="gap-2">
                    找主持人
                    <Icon name="arrow-right" size={16} />
                  </Button>
                </Link>
                <Link href="/host/gigs">
                  <Button variant="outline" size="lg">
                    我是主持人，找商单
                  </Button>
                </Link>
              </div>

              <p className="mt-8 text-sm text-ink-soft">
                已收录 {hostCount} 位主持 · 平均 18 分钟响应 · 平台服务费 8%
              </p>
            </div>

            {/* 右侧：主持人卡片示意 */}
            <div className="relative flex items-center justify-center lg:justify-end">
              {/* 卡片背后的聚光光晕 */}
              <div className="pointer-events-none absolute h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(178,58,47,0.32),rgba(201,149,60,0.12)_55%,transparent_72%)] blur-2xl" />
              {/* 浮动装饰元素 */}
              <div className="absolute top-8 left-8 rounded-card border border-line bg-card px-4 py-2 shadow-lg md:left-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="h-2 w-2 rounded-full bg-jade" />
                  <span>本周可接 · 上海</span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 rounded-card border border-line bg-card px-4 py-2 shadow-lg md:right-0">
                <div className="flex items-center gap-2 text-sm">
                  <Icon name="shield" size={14} />
                  <span>实名认证 · 作品可看</span>
                </div>
              </div>

              {/* 主卡片：话筒造型 */}
              <div className="relative w-full max-w-sm">
                {/* 话筒头 */}
                <div className="mic-head relative mx-auto flex h-72 w-[88%] items-center justify-center overflow-hidden rounded-t-[220px] rounded-b-3xl shadow-[0_30px_70px_-30px_rgba(21,17,14,0.7)] ring-1 ring-black/25">
                  <span className="absolute top-5 text-[#f0d6a0]/60">
                    <Icon name="mic" size={18} strokeWidth={2} />
                  </span>
                  <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-[11px] font-semibold text-[#f0d6a0] backdrop-blur">
                    <Icon name="check" size={11} strokeWidth={3} /> 已认证
                  </span>
                  <span className="relative font-display text-[7rem] font-bold leading-none text-[#f3ead9]/85">
                    林
                  </span>
                  <span className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-black/45 text-[#f3ead9] shadow-lg backdrop-blur">
                    <Icon name="play" size={15} />
                  </span>
                </div>

                {/* 话筒手柄（信息） */}
                <div className="relative -mt-4 mx-auto w-[88%] rounded-3xl border border-line bg-card p-6 shadow-2xl">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="font-display text-xl font-semibold">林知遥</h3>
                  </div>
                  <p className="mb-3 text-sm text-ink-soft">上海 · 8 年经验</p>

                  <Rating rating={4.9} count={126} />

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Tag>婚礼</Tag>
                    <Tag>年会</Tag>
                    <Tag>中英双语</Tag>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
                    <p className="font-display text-2xl font-bold">
                      ¥4,500
                      <span className="text-sm font-normal text-ink-soft"> / 半天起</span>
                    </p>
                    <span className="flex items-center gap-1.5 rounded-full bg-jade-soft px-3 py-1 text-xs font-medium text-jade-deep">
                      <span className="h-1.5 w-1.5 rounded-full bg-jade" />
                      可接 11/08
                    </span>
                  </div>
                </div>

                {/* 话筒支架 */}
                <div className="mx-auto mt-3 h-5 w-px bg-line-strong" />
                <div className="mx-auto h-1.5 w-20 rounded-full bg-line-strong" />
              </div>

              {/* 麦克风图标 */}
              <Icon
                name="mic"
                size={80}
                className="absolute -right-4 -bottom-4 rotate-12 text-spotlight/10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 数据统计条 */}
      <section className="border-y border-line bg-card">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-bold md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-ink-soft">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 双角色面板 */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.3em] text-spotlight">
            Two worlds, one stage
          </p>
          <h2 className="font-display text-4xl font-bold md:text-5xl">
            一进门，就进入自己的世界。
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-2">
            主持人看商单，商家看作品。两套界面，两种语言，但都在同一个舞台上。
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 主持人面板 */}
          <div className="group relative overflow-hidden rounded-2xl border-2 border-spotlight bg-gradient-to-br from-spotlight-tint to-card p-8 transition-all hover:shadow-xl">
            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-spotlight">
                FOR HOSTS
              </p>
              <h3 className="font-display text-3xl font-bold">
                把你的作品，摆到台前。
              </h3>
            </div>

            <ul className="mb-8 space-y-3 text-ink-2">
              <li className="flex items-start gap-3">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-spotlight" />
                <span>主页 + 作品集，不再被当新人重新介绍</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-spotlight" />
                <span>商单大厅直接报名，价格自己定</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-spotlight" />
                <span>和商家直接聊，不被中介抽成</span>
              </li>
            </ul>

            <div className="flex items-center gap-4">
              <Link href="/host/gigs">
                <Button className="gap-2">
                  进入主持人端
                  <Icon name="arrow-right" size={16} />
                </Button>
              </Link>
              <span className="text-sm text-ink-soft">先看看最近的商单</span>
            </div>
          </div>

          {/* 商家面板 */}
          <div className="group relative overflow-hidden rounded-2xl border-2 border-gold bg-gradient-to-br from-gold-tint to-card p-8 transition-all hover:shadow-xl">
            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-gold-deep">
                FOR MERCHANTS
              </p>
              <h3 className="font-display text-3xl font-bold">
                找主持，不再靠群里赌运气。
              </h3>
            </div>

            <ul className="mb-8 space-y-3 text-ink-2">
              <li className="flex items-start gap-3">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>按城市、类型、预算筛人</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>先看作品和评价，再决定聊不聊</span>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="check" size={18} className="mt-0.5 shrink-0 text-gold" />
                <span>发一张商单，等对的人来报名</span>
              </li>
            </ul>

            <div className="flex items-center gap-4">
              <Link href="/merchant/hosts">
                <Button variant="outline" size="md" className="gap-2 border-gold bg-gold-tint text-gold-deep hover:bg-gold/10">
                  进入商家端
                  <Icon name="arrow-right" size={16} />
                </Button>
              </Link>
              <span className="text-sm text-ink-soft">已收录 {hostCount} 位主持</span>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-ink-soft">
          共 {gigCount} 张商单正在招募
        </p>
      </section>
    </main>
  );
}
