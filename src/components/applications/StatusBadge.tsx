const LABELS = {
  pending: "待处理",
  accepted: "已接受",
  rejected: "已拒绝",
} as const;

export function StatusBadge({
  status,
}: {
  status: keyof typeof LABELS;
}) {
  return (
    <span className={`status-badge ${status}`}>{LABELS[status]}</span>
  );
}
