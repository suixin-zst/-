import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const metadata = { title: "组件样板 · 台前" };

const swatches = [
  { name: "paper", className: "bg-paper" },
  { name: "card", className: "bg-card" },
  { name: "spotlight", className: "bg-spotlight" },
  { name: "spotlight-tint", className: "bg-spotlight-tint" },
  { name: "gold", className: "bg-gold" },
  { name: "ink", className: "bg-ink" },
  { name: "line", className: "bg-line" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

/**
 * 组件样板页 —— 两个 AI 会话共用的 UI 契约
 * 规则：业务页面只准 import components/ui/ 里出现过的组件；
 * 新组件先加到这页展示，再投入使用。
 */
export default function DevUiPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-12 px-6 py-12">
      <header>
        <h1 className="font-display text-3xl font-semibold">组件样板页</h1>
        <p className="mt-2 text-ink-soft">
          全站唯一允许使用的组件白名单。新增组件必须先上这页展示，再投入使用。
        </p>
      </header>

      <Section title="色板（只许用这些 token）">
        <div className="flex flex-wrap gap-4">
          {swatches.map((s) => (
            <div key={s.name} className="text-center">
              <div className={`h-14 w-20 rounded-card border border-line ${s.className}`} />
              <p className="mt-1.5 text-xs text-ink-soft">{s.name}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="按钮 Button">
        <div className="flex flex-wrap items-center gap-3">
          <Button>主要动作</Button>
          <Button variant="outline">次要动作</Button>
          <Button variant="ghost">幽灵</Button>
          <Button size="sm">小号</Button>
          <Button size="lg">大号（首页入口用）</Button>
          <Button disabled>禁用</Button>
        </div>
      </Section>

      <Section title="徽标 Badge">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>默认</Badge>
          <Badge tone="spotlight">主持人</Badge>
          <Badge tone="gold">★ 4.9</Badge>
          <Badge tone="outline">报名中</Badge>
        </div>
      </Section>

      <Section title="表单 Input / Select / Textarea">
        <div className="grid max-w-2xl gap-5">
          <div>
            <Label htmlFor="demo-input">文本输入</Label>
            <Input id="demo-input" placeholder="如：上海市浦东新区" />
          </div>
          <div>
            <Label htmlFor="demo-select">下拉选择</Label>
            <Select id="demo-select" defaultValue="发布会">
              <option value="年会">年会</option>
              <option value="发布会">发布会</option>
              <option value="路演">路演</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="demo-textarea">多行文本</Label>
            <Textarea id="demo-textarea" placeholder="活动介绍、要求…" />
          </div>
        </div>
      </Section>

      <Section title="头像 Avatar">
        <div className="flex items-end gap-4">
          <Avatar name="林晚秋" size="sm" />
          <Avatar name="林晚秋" size="md" />
          <Avatar name="林晚秋" size="lg" />
          <Avatar name="林晚秋" size="xl" />
        </div>
      </Section>

      <Section title="卡片范式（主持人卡 = 全站门面，副手可抽成 HostCard 组件）">
        <Card className="w-72">
          {/* 图位固定 3:4 竖版 —— UI 硬规则 */}
          <div className="aspect-[3/4] w-full rounded-xl bg-spotlight-tint" />
          <div className="mt-4 flex items-center gap-3">
            <Avatar name="林晚秋" />
            <div>
              <p className="font-display font-semibold">林晚秋</p>
              <p className="text-xs text-ink-soft">上海 · 发布会 / 路演</p>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <Badge tone="gold">★ 4.9 · 12 单</Badge>
            <span className="text-sm text-ink-soft">¥1500/时起</span>
          </div>
        </Card>
      </Section>

      <Section title="空态 EmptyState（不许出现裸文字空态）">
        <EmptyState
          icon="🎙"
          title="还没有报名任何商单"
          hint="去商单大厅看看第一单——筛选城市和档期，一键报名"
          action={<Button size="sm">去商单大厅</Button>}
        />
      </Section>
    </div>
  );
}
