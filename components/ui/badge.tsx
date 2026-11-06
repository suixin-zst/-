import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "spotlight" | "gold" | "outline";

const tones: Record<Tone, string> = {
  default: "border-line bg-paper text-ink-soft",
  spotlight: "border-transparent bg-spotlight-tint text-spotlight-deep",
  gold: "border-transparent bg-gold-tint text-gold-deep",
  outline: "border-line bg-transparent text-ink",
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
}

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}
