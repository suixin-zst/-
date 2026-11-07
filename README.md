# 台前 TAIQIAN · 主持人 × 商家直聘平台

> 商家发单、主持人接单、双方直接聊。作品说话，砍掉中介抽成。

这是可以完整跑通核心闭环的黑客松 demo：注册登录 → 商家发单 → 主持人报名 → 双方站内聊天 → 商家接受 → 商单达成。前端是副手交付的舞台视觉体系，后端目前用本地 JSON 存储，Supabase schema 已准备好，拿到 key 后可切换。

## 本地启动

```bash
npm install
npm run dev        # 3000
# 或
npm run dev:3200   # demo 用的 3200
```

打开 http://localhost:3000（或 `:3200`）。

不需要环境变量就能跑 demo。生产环境请设置 `AUTH_SECRET`（见 `.env.example`）。

开发缓存说明：

- `dev` 用 `.next-dev`，`build` 用 `.next`，两个目录分离，避免 dev 与 build 同时跑时 worker 池互相污染；
- 如果遇到 `Jest worker encountered child process exceptions`，执行 `npm run dev:clean`，清掉 `.next-dev` 后重启；
- `npm run clean` 会同时清 `.next` 和 `.next-dev`。

重置演示数据：`npm run db:reset`，然后重启 dev，会重新 seed。

## 演示账号

| 角色 | 邮箱 | 密码 |
|---|---|---|
| 商家 | `merchant@taiqian.demo` | `demo1234` |
| 主持人 | `lin-zhiyao@taiqian.demo` | `demo1234` |

`/auth` 页面有「商家演示 / 主持人演示」一键登录。种子数据里还有 8 位主持人，邮箱格式 `<host-id>@taiqian.demo`，密码同样是 `demo1234`。

## 已实现

| 模块 | 路由 | 状态 |
|---|---|---|
| 首页 / 角色分流 | `/` | 完成 |
| 登录 / 注册 / 选角色 | `/auth` | 完成 |
| 主持人工作台 | `/host/dashboard` | 完成 |
| 主持人资料 + 作品上传 | `/host/profile/edit` | 完成 |
| 主持人公开主页 | `/host/[id]` | 完成 |
| 商单大厅 + 筛选 | `/host/gigs` | 完成 |
| 商单详情 + 报名 | `/gig/[id]` | 完成 |
| 商家工作台 | `/merchant/dashboard` | 完成 |
| 商家发单 | `/merchant/gig/new` | 完成 |
| 主持人列表 + 筛选 | `/merchant/hosts` | 完成 |
| 站内会话（2 秒轮询） | `/chat` | 完成 |
| 设计系统样板 | `/dev/ui` | 完成 |
| 10 页路演幻灯 | `/slides.html` | 完成 |

核心闭环：

```
商家发布商单 → 主持人报名 → 自动建会话 → 双方聊天
→ 商家接受 → 商单状态变 matched → 工作台同步
```

商家也可以从主持人主页直接发起邀约（`applications.initiator = merchant`）。

## 后端现状（重要）

本地 demo 使用 `data/db.json`，首次请求自动 seed：

- 9 位主持 + 2 个商家
- 6 张商单
- 3 条报名 / 邀约
- 3 个会话 + 示例消息

`data/db.json` 和 `public/uploads/` 已加入 `.gitignore`，不会进仓库。

API：

| 方法 | 路径 | 作用 |
|---|---|---|
| POST | `/api/auth/register` | 注册并登录 |
| POST | `/api/auth/login` | 登录 |
| POST | `/api/auth/logout` | 退出 |
| GET | `/api/auth/me` | 当前用户 + 资料 |
| PUT | `/api/host/profile` | 保存主持人资料 |
| POST | `/api/host/works` | 添加作品 |
| POST | `/api/upload` | 上传图片 / 视频 / 音频（≤25MB） |
| POST | `/api/gigs` | 商家发布商单 |
| POST | `/api/applications` | 报名 / 邀约，自动建会话 |
| PATCH | `/api/applications/[id]` | 商家接受 / 拒绝 |
| GET | `/api/conversations` | 会话列表 |
| GET/POST | `/api/conversations/[id]/messages` | 拉取 / 发送消息 |

安全与限制：

- 密码 `scrypt` 加盐，会话为 HMAC 签名的 httpOnly cookie；
- 聊天是 **2 秒轮询**（计划里 Realtime 做不完时的降级方案），不是 Supabase Realtime；
- 上传写本地 `public/uploads`，Vercel 文件系统不可持久化，线上必须换 Storage；
- 生产环境必须设置 `AUTH_SECRET`，并使用 HTTPS。

## 切换 Supabase

1. Supabase 新建项目；
2. SQL Editor 执行 `supabase/schema.sql`（含表、索引、RLS、Storage bucket）；
3. `.env.local` 填 `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `AUTH_SECRET`；
4. 把 `src/lib/server/db.ts` 与 `src/lib/session.ts` 替换为 Supabase 查询 / `@supabase/ssr`；
5. API 路由和页面不需要改；
6. 上传改为 `supabase.storage.from("works").upload(...)`，作品 URL 用公开 URL 或签名 URL。

## 设计系统

- 概念：**台前**。深色舞台、聚光灯、衬线标题、暖纸底色。
- 主持人端主色：Stage 红 `#B23A2F`
- 商家端主色：Jade 绿 `#2E5E4E`
- 强调 / 评分：Gold `#C9953C`
- 标题：Noto Serif / Songti 回退；正文：系统无衬线
- 组件样板：`/dev/ui`

新增页面前先去 `/dev/ui` 找现成组件和 class，不要另起一套。

## Demo 物料

- `demo/DEMO_SCRIPT.md` — 3 分钟现场脚本（含翻车降级表、Q&A）
- `demo/REHEARSAL.md` — 排练清单与时间卡点
- `demo/SLIDES_OUTLINE.md` — 10 页幻灯文案底稿
- `/slides.html` — 可直接放映的网页幻灯（`←` `→` 翻页，`?s=7` 直达第 7 页）

发单表单顶部有「填入示例」按钮，演示时一键填好「新能源新车发布会」。

## 目录

```
src/
├── app/
│   ├── api/…                 # auth / gigs / applications / chat / upload
│   ├── auth/                 # 登录注册
│   ├── host/
│   │   ├── dashboard/        # 主持人工作台
│   │   ├── profile/edit/     # 资料 + 作品
│   │   ├── gigs/             # 商单大厅
│   │   └── [id]/             # 公开主页
│   ├── merchant/
│   │   ├── dashboard/        # 商家工作台
│   │   ├── gig/new/          # 发单
│   │   └── hosts/            # 主持人列表
│   ├── gig/[id]/             # 商单详情 / 报名 / 处理报名
│   ├── chat/                 # 站内会话
│   ├── dev/ui/               # 组件样板
│   └── globals.css           # 设计系统
├── components/
│   ├── auth/ chat/ hosts/ gigs/ applications/ forms/ ui/ site/
└── lib/
    ├── data.ts               # 页面数据出口
    ├── session.ts            # 当前用户 / 角色守卫
    ├── server/
    │   ├── db.ts             # 本地 JSON 存储 + seed
    │   ├── auth.ts           # scrypt + 签名会话
    │   └── http.ts           # API 响应
    └── types.ts / mock-data.ts / format.ts
supabase/schema.sql           # 切 Supabase 的表 + RLS
demo/                          # 剧本 / 排练 / 幻灯底稿
```

## 已知限制

- 本地 JSON 后端适合单机 demo，不适合多实例部署；
- 聊天是轮询，不是长连接；消息延迟最多约 2 秒；
- 上传只落本地磁盘，线上需 Storage；
- 评价系统是种子数据展示，P1 的互评写入还没做；
- 通知红点、档期日历、关键词搜索属于 P1，未做；
- 演示账号密码是公开的，仅用于本地 / demo，上线前删除或改密码。
