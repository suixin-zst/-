const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export function formatEventDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return `${month}月${day}日 ${WEEKDAYS[date.getUTCDay()]}`;
}

export function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-").map(Number);
  return `${month}月${day}日`;
}

export function formatNumber(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatBudget(min: number, max: number): string {
  return `¥${formatNumber(min)}–${formatNumber(max)}`;
}

export function priceFrom(host: { priceHalfDay: number }): string {
  return `¥${formatNumber(host.priceHalfDay)}`;
}

export function gigStatusLabel(status: "open" | "matched" | "closed"): string {
  if (status === "open") return "招募中";
  if (status === "matched") return "已达成";
  return "已关闭";
}
