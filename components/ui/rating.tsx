/**
 * 评分显示 —— 星星 + 数字 + 可选计数
 */

import { Icon } from "./icon";

export function Rating({
  rating,
  count,
  hideCount,
}: {
  rating: number;
  count?: number;
  hideCount?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-gold">
      <Icon name="star" size={11} className="fill-gold" />
      {rating.toFixed(1)}
      {!hideCount && count != null ? (
        <span className="text-ink-soft">（{count}）</span>
      ) : null}
    </span>
  );
}
