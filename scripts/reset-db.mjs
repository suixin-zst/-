import { rmSync } from "node:fs";

rmSync("data/db.json", { force: true });
rmSync("public/uploads", { recursive: true, force: true });

console.log("本地演示数据已清空。重启 npm run dev 后会自动重新 seed。");
