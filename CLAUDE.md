# 台前 · AI 协作契约

> 本文件给两个 AI 会话看，也给人看。两位开发者均为 vibe coding，
> 本文件是两个 AI 的统一口径 —— 改这里 = 改契约，需两人确认后由地基执笔人执行。

## 开会话第一句（必做）

用户会先声明身份：**「我是主力」** 或 **「我是副手」**。据此执行领地规则。

## 领地表（本仓库最重要的一张表）

| 路径 | 负责人 |
|---|---|
| `app/page.tsx`（首页·签名交互） | 主力 |
| `app/merchant/**` | 主力 |
| `app/chat/**` | 主力 |
| `app/host/**`、`app/gig/**` | 副手 |
| `supabase/schema.sql`、`lib/types.ts`、`lib/api.ts`、`components/ui/**`、`app/globals.css`、`middleware.ts`、`lib/supabase/**` | **冻结契约**（见下） |

**AI 规则：你的会话负责人只能改其领地内的文件。任务涉及领地外文件时，
停下来向负责人说明需要谁配合，不要动手。**

## 冻结契约（h3 起生效）

- `supabase/schema.sql`：只加不改。要改 → 群里喊 + 由地基执笔人在 SQL Editor 执行并同步文件
- `lib/types.ts`：schema 的 TS 镜像，随 schema 变更由执笔人同步
- `lib/api.ts`：跨领地的三个函数（getMyProfile / applyToGig / startConversation），签名不许动
- `components/ui/**`：组件白名单。要新组件 → 先加到 `app/dev/ui` 展示，再投入使用
- `app/globals.css`：设计 tokens 唯一来源。颜色/字体/圆角只用 token 派生的工具类
  （`bg-paper` `text-ink` `text-spotlight` `font-display` `rounded-card` …），禁止散落硬编码色值

## 代码约定

- Next.js App Router：默认 Server Component，仅交互组件加 `"use client"`
- 数据访问一律走 `lib/supabase/` 的 `createClient()`，不要自建 client
- DB 类型从 `lib/types.ts` 导入；**禁 `any`、禁 `@ts-ignore`**，类型报错就修类型
- 主持人图片位固定 3:4 竖版；空态一律用 `EmptyState`，不许裸文字
- 注释用中文，写「为什么」不写「是什么」
- 提交信息：`feat/fix/docs/chore: 中文描述`，分支名 `feat/xxx`

## 环境事实（不要在代码里重新发明这些）

- Supabase 已**关闭 Confirm email**：注册即登录，session 立即返回
- `messages` / `conversations` 两张表已加入 `supabase_realtime` publication，
  聊天用 `postgres_changes` 订阅 insert 事件；订阅不灵时可降级 3 秒轮询
- `middleware.ts` 守卫 `/host` `/merchant` `/chat` `/gig`；公开路由：`/`、`/auth/*`、`/dev/ui`
- Storage：`works` 公开桶，上传路径约定 `auth.uid()/文件名`
- 注册即建档：`signUp` 时把 `name`/`role` 放进 `options.data`，触发器自动落库
- 环境变量：`.env.local`（不进 git），见 `.env.example`

## 完整作战计划

见 `docs/作战计划.md`（24h 时间表、红线、demo 脚本、评委 Q&A 预案）。
