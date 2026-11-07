import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 生成自包含的 .next/standalone，供容器化部署（腾讯云云托管）使用。
  // Vercel 会自动忽略该产物，不影响现有部署。
  output: "standalone",
};

export default nextConfig;
