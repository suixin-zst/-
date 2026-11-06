/** 读取必需环境变量；缺失时给出可操作的报错（README 有配置步骤） */
export function env(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `缺少环境变量 ${name}：复制 .env.example 为 .env.local 并填写（步骤见 README）`
    );
  }
  return value;
}
