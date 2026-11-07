# syntax=docker/dockerfile:1
# 腾讯云云托管（容器）部署用。Next.js standalone 多阶段构建。

# ---- 1. 安装依赖 ----
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- 2. 构建 ----
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# .env.production 会被 next build 自动加载，用于把 NEXT_PUBLIC_* 内联进产物
RUN npm run build

# ---- 3. 运行 ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# 必须绑 0.0.0.0，否则容器内只监听 localhost，云托管探活会失败
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
