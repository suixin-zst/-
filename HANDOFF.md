# 副手 → 主力 交接清单

## 1. 先看哪里

1. `/dev/ui` — 全部组件、颜色、字体、空态、骨架屏；
2. `src/lib/data.ts` — 唯一数据出口；
3. `src/lib/types.ts` — 与 schema 对齐的类型；
4. `src/app/` — 门面页路由。

## 2. 替换数据层（不改页面）

把 `src/lib/data.ts` 的函数换成 Supabase 查询，保持返回类型：

```ts
getHosts(): Promise<Host[]>
getHost(id): Promise<Host | undefined>
getFeaturedHosts(limit): Promise<Host[]>
getGigs(): Promise<Gig[]>
getGig(id): Promise<Gig | undefined>
getFeaturedGigs(limit): Promise<Gig[]>
getSimilarGigs(gig, limit): Promise<Gig[]>
```

`Host` / `Gig` 字段见 `src/lib/types.ts`，与计划文档里的 `host_profiles` / `gigs` 对齐；`works` / `reviews` / `availability` 目前是嵌套 mock，接真实数据时可拆表或聚合。

## 3. 需要接真实逻辑的三处交互

| 组件 | 现在 | 要接 |
|---|---|---|
| `components/hosts/InviteHostButton.tsx` | 弹窗 → 成功态 | `applications` insert（initiator=merchant）+ 创建 conversation |
| `components/gigs/ApplyGigButton.tsx` | 弹窗 → 成功态 | `applications` insert（initiator=host）+ 通知商家 |
| `components/forms/NewGigForm.tsx` | 前端校验 → 成功态 | `gigs` insert，成功后跳 `/gig/[id]` |

表单字段已经是受控状态，直接换成 server action / API route 即可。

## 4. Auth 与路由守卫

副手没有做登录。接 Auth 后建议：

- `/host/*` 只允许 `role=host`；`/merchant/*` 只允许 `role=merchant`；
- 首页两个角色入口按登录角色高亮；
- 未登录点击「发布商单 / 发起邀约」跳 `/auth`。

## 5. 聊天入口

详情页和主页目前是演示弹窗。接聊天后把成功态替换为：

```ts
router.push(`/chat?gig=${gig.id}&host=${host.id}`)
```

或由 server action 创建 conversation 后返回 id。

## 6. 组件清单（可直接复用）

- `ui/Button`：6 variants × 3 sizes，支持 href / disabled / icon
- `ui/Tag`：default / stage / gold / jade / ink
- `ui/Rating`、`ui/Avatar`、`ui/EmptyState`、`ui/Skeleton`
- `hosts/HostCard`、`gigs/GigCard`
- `site/SiteHeader`、`site/SiteFooter`

## 7. 样式约定

- 颜色/字体/圆角/阴影全部走 `src/app/globals.css` 的 CSS 变量；
- 主持人端用 `.role-panel.host` / `.btn-stage`，商家端用 `.role-panel.merchant` / `.btn-jade`；
- Gold 只用于关键 CTA、评分、强调，不大面积铺；
- 标题用 `.display-*`（衬线），正文用 `.lead` / 默认无衬线；
- 不要新增第二套卡片/按钮样式，先扩展组件。

## 8. 已知限制

- 作品缩略图是渐变占位，非真实视频封面；
- 筛选是客户端过滤，适合 10 条 demo 数据；
- 移动端已适配，但还没做真机回归；
- 表单的日期/预算校验是前端演示，后端仍需 Zod / SQL 校验。

## 9. 合并建议

如果主力已有仓库，按以下顺序搬：

1. `src/app/globals.css`；
2. `src/components/ui/*`、`src/components/site/*`；
3. `src/lib/types.ts`、`src/lib/format.ts`、`src/lib/cn.ts`；
4. `src/components/hosts/*`、`src/components/gigs/*`、`src/components/forms/*`；
5. `src/app` 下的门面页路由；
6. 最后把 `src/lib/data.ts` 换成真实实现。

冲突高发文件：`globals.css`、`src/app/layout.tsx`。搬之前先和主力对一次布局。

## 10. 版本注意

本原型是 Next 16 + Tailwind 4（`@import "tailwindcss";` + `@tailwindcss/turbopack`）。

如果主仓库是 Next 15 + Tailwind 3：

1. 保留主仓库的 `tailwind.config` 和 PostCSS 配置；
2. 把 `globals.css` 第一行换成 `@tailwind base; @tailwind components; @tailwind utilities;`；
3. 删掉 `next.config.ts` 里的 `turbopack.rules`；
4. 组件代码不用改（只用了 Tailwind 工具类和自定义 CSS）。

## 11. 主力部分（本地版已补齐）

当前仓库已经不是纯前端原型，主力的 P0 链路在本地 JSON 后端上跑通了：

| 模块 | 状态 | 位置 |
|---|---|---|
| 注册 / 登录 / 退出 / 当前用户 | 完成（scrypt + 签名 cookie） | `src/app/api/auth/*`、`src/lib/server/auth.ts` |
| 角色守卫 | 完成（`requireRole`） | `src/lib/session.ts` |
| 数据存储 + seed | 完成（9 主持 / 2 商家 / 6 商单 / 3 报名 / 3 会话） | `src/lib/server/db.ts`、`data/db.json` |
| 商家发单 | 完成 | `POST /api/gigs` |
| 主持人报名 / 商家邀约 | 完成，自动建会话 | `POST /api/applications` |
| 站内聊天 | 完成（2 秒轮询，计划里的降级方案） | `/chat`、`/api/conversations/*` |
| 接受 / 拒绝 → 商单达成 | 完成 | `PATCH /api/applications/[id]` |
| 作品上传 | 完成（本地 `public/uploads`，≤25MB） | `POST /api/upload` |
| 双端工作台 | 完成 | `/host/dashboard`、`/merchant/dashboard` |
| Supabase schema + RLS | 完成（未执行） | `supabase/schema.sql` |

演示账号：

- 商家：`merchant@taiqian.demo` / `demo1234`
- 主持人：`lin-zhiyao@taiqian.demo` / `demo1234`

本地 JSON 后端只适合单机 demo；Vercel 上要切成 Supabase（或其它托管 DB + Storage）。切换步骤见 README「切换 Supabase」，页面和 API 路由不用重写，主要替换 `src/lib/server/db.ts` 与 `src/lib/session.ts`。

聊天目前是 2 秒轮询，不是 Supabase Realtime；评价写入、通知红点、档期日历属于 P1，尚未实现。
