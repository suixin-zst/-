import { Icon } from "./Icon";

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
    <span className="rating">
      <Icon name="star" size={11} />
      {rating.toFixed(1)}
      {!hideCount && count != null ? <span>（{count}）</span> : null}
    </span>
  );
}
