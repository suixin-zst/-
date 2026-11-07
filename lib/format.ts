/**
 * 时间显示工具
 *
 * 时区固定为 Asia/Shanghai：会话列表在服务端渲染、聊天窗在客户端渲染，
 * 若用运行环境本地时区，两端算出的日期可能不同 → React 水合报错。
 */

const TZ = "Asia/Shanghai";

const clockFmt = new Intl.DateTimeFormat("zh-CN", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const monthDayFmt = new Intl.DateTimeFormat("zh-CN", {
  timeZone: TZ,
  month: "numeric",
  day: "numeric",
});

/** 拆出「上海时区」的年月日，用于判断是不是同一天 */
function ymd(d: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

/** 会话列表用：今天给时刻，昨天给「昨天」，更早给月/日 */
export function formatListTime(iso: string, now: Date): string {
  const d = new Date(iso);
  const today = ymd(now);
  const that = ymd(d);
  if (that === today) return clockFmt.format(d);

  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (that === ymd(yesterday)) return "昨天";

  return monthDayFmt.format(d);
}

/** 消息气泡旁的时刻 */
export function formatClock(iso: string): string {
  return clockFmt.format(new Date(iso));
}

/**
 * 两条消息之间的日期分隔条文案。返回 null 表示同一天、不用显示。
 */
export function formatDayDivider(iso: string, prevIso: string | null, now: Date): string | null {
  const d = new Date(iso);
  const today = ymd(d);
  if (prevIso && ymd(new Date(prevIso)) === today) return null;

  if (today === ymd(now)) return "今天";
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  if (today === ymd(yesterday)) return "昨天";
  return monthDayFmt.format(d);
}
