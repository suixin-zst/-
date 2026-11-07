import { spawn } from "node:child_process";
import { rmSync } from "node:fs";
import net from "node:net";
import path from "node:path";

const args = process.argv.slice(2);
const clean = args.includes("--clean");
const portArg = args.find((arg) => /^\d+$/.test(arg));
const port = Number(portArg || process.env.PORT || "3000");

if (clean) {
  rmSync(".next-dev", { recursive: true, force: true });
  console.log("[台前] 已清理 .next-dev 缓存");
}

const portFree = await new Promise((resolve) => {
  const server = net.createServer();
  server.once("error", () => resolve(false));
  server.once("listening", () => server.close(() => resolve(true)));
  server.listen(port);
});

if (!portFree) {
  console.error(
    `[台前] 端口 ${port} 已被占用。\n` +
      `  先结束旧的 dev server，或换端口：npm run dev:3200\n` +
      `  如果是缓存问题：npm run dev:clean`,
  );
  process.exit(1);
}

const nextBin = path.join("node_modules", "next", "dist", "bin", "next");
const child = spawn(process.execPath, [nextBin, "dev", "--port", String(port)], {
  stdio: "inherit",
  env: { ...process.env, NEXT_DIST_DIR: ".next-dev" },
});

child.on("exit", (code) => process.exit(code ?? 0));
