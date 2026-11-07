import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // dev 与 build 使用不同的缓存目录，避免同时跑时互相污染 worker 池
  distDir: process.env.NEXT_DIST_DIR || ".next",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
