# 台前 TAIQIAN

> 主持人 × 商家 直聘式撮合平台：商家发单、主持人接单、双方直接聊。
> 黑客松 24h · 2 人 vibe coding 作战，完整计划见 `docs/作战计划.md`。

**技术栈**：Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Supabase（Auth / Postgres / Storage / Realtime）· Vercel

---

## 队员首次上手（clone 后 10 分钟）

1. `npm install`
2. `cp .env.example .env.local`，填入 Supabase 的两个值（群里要，绝不提交）
3. 验证一下数据库（正常情况队长已建好，跳过即可）：
   Supabase Dashboard → SQL Editor → 粘贴 `supabase/schema.sql` 整段执行
4. **必须做**：Authentication → Providers → Email → 关闭 **Confirm email**
   （不关的话现场注册收不到验证邮件，demo 直接翻车）
5. `npm run dev` → http://localhost:3000
6. 注册一个账号试试：选角色 → 应直接跳进对应工作台占位页

组件长什么样：http://localhost:3000/dev/ui（全站组件白名单）

## 队长：推到 GitHub + 部署上线

```bash
cd taiqian
git init
git add .
git commit -m "chore: 地基骨架（契约冻结版）"
git branch -M main
git remote add origin https://github.com/<你的用户名>/taiqian.git
git push -u origin main
```

（GitHub 上先建一个**空仓库**，不要勾选自动生成 README）

Vercel 部署（做一次，之后全自动）：

1. vercel.com → Add New Project → Import 本仓库
2. Environment Variables 添加 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy

之后：push main 自动更新线上；**每个 PR 自动生成预览链接**（review 就靠它，不读代码）。
演示当天用 main 的线上链接，别用 localhost。

## 种子数据（副手负责，demo 的脸）

1. 在线上链接用下表账号注册（关了邮箱验证后每号 30 秒；别在排练时狂注册，Auth 有限速）
2. Supabase SQL Editor 执行 `supabase/seed.sql`（按 email 匹配，可重复执行）
3. 照文件里的 TODO 补满到 **8 主持人 / 6 商单**；作品视频用 30–60 秒外链；头像用统一风格的职业感真人照

| 邮箱 | 密码 | 角色 | 人设 |
|---|---|---|---|
| lin@taiqian.dev | demo1234 | 主持人 | 林晚秋 · 上海 · 发布会/路演 |
| chen@taiqian.dev | demo1234 | 主持人 | 陈亦航 · 北京 · 年会/婚礼 |
| auto@taiqian.dev | demo1234 | 商家 | 星驰汽车市场部 |
| expo@taiqian.dev | demo1234 | 商家 | 申城会展 |

（演示账号：两个浏览器 Profile 分别保持一个主持人、一个商家登录）

## 协作速览

细节和 24h 时间表看 `CLAUDE.md` 和 `docs/作战计划.md`，核心五律：

1. **按路由切，不按层切**：主力只动 `/`、`/merchant/*`、`/chat/*`；副手只动 `/host/*`、`/gig/*`
2. **每轮 AI 会话完 `git status` 扫一眼**：领地外的改动当场 revert
3. **地基只加不改**：schema / types / api / ui 组件要改 → 群里喊 + 地基执笔人执行
4. **Review 靠 PR 预览链接点功能**，点过没毛病就 merge 自己的 PR
5. **两个 AI 的口径由 CLAUDE.md 统一**，开会话第一句声明领地

## 红线（到点执行，不看情面）

- **h3 契约冻结** · **h12 双侧中检** · **h17 闭环走通**（注册→发单→报名→聊天→达成）· **h20 录屏备份**
- 骨架当天就部署上线，之后每 2h 推一次 main
- Realtime 聊天 h9 还没通 → 当场降 3 秒轮询，不恋战