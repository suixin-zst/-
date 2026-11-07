import { rmSync } from "node:fs";

rmSync(".next", { recursive: true, force: true });
rmSync(".next-dev", { recursive: true, force: true });

console.log("已清理 .next 与 .next-dev。");
