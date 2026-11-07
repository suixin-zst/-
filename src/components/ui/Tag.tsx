import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "default" | "stage" | "gold" | "jade" | "ink";

export function Tag({
  children,
  tone = "default",
  className,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={cn("tag", tone !== "default" && `tag-${tone}`, className)}>
      {children}
    </span>
  );
}
