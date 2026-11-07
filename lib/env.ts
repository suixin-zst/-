/**
 * 读取必需环境变量；缺失时给出可操作的报错（README 有配置步骤）。
 *
 * 为什么写成查表而不是 process.env[name]：
 * Next/webpack 只在「静态成员访问」处把 process.env.NEXT_PUBLIC_* 替换成字面值。
 * process.env[name] 的 key 是变量，构建期无法求值，会被原样保留进客户端 bundle；
 * 浏览器里没有 process，取值就变成 undefined[name] 直接抛错——表现为调用方
 * 一律落到 catch，前端报「网络错误」而后端其实完全正常。
 */
const REQUIRED_ENV = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const;

export type RequiredEnvName = keyof typeof REQUIRED_ENV;

export function env(name: RequiredEnvName): string {
  const value = REQUIRED_ENV[name];
  if (!value) {
    throw new Error(
      `缺少环境变量 ${name}：复制 .env.example 为 .env.local 并填写（步骤见 README）`
    );
  }
  return value;
}
