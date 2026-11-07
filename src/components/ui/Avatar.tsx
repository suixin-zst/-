import { cn } from "@/lib/cn";
import type { Tone } from "@/lib/types";
import { Icon } from "./Icon";

export function Avatar({
  name,
  tone,
  size = 48,
  verified = false,
}: {
  name: string;
  tone: Tone;
  size?: number;
  verified?: boolean;
}) {
  return (
    <span
      className={cn("avatar", `tone-${tone}`)}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
    >
      <span>{name.slice(0, 1)}</span>
      {verified ? (
        <span className="avatar-badge">
          <Icon name="check" size={9} strokeWidth={3} />
        </span>
      ) : null}
    </span>
  );
}
