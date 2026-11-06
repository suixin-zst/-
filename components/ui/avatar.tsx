import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
  xl: "h-20 w-20 text-2xl",
};

export interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: Size;
  className?: string;
}

/** 圆形头像：无图时显示姓名首字。接入 Supabase Storage 后可换 next/image */
export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name && name.trim() ? name.trim().charAt(0) : "?";

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name ?? "头像"}
        className={cn("rounded-full object-cover", sizes[size], className)}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center rounded-full bg-spotlight-tint font-display font-semibold text-spotlight-deep",
        sizes[size],
        className
      )}
    >
      {initials}
    </span>
  );
}
