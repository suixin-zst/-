import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-spotlight to-spotlight-deep text-white shadow-[0_8px_20px_-8px_rgba(142,43,35,0.65)] hover:shadow-[0_14px_30px_-10px_rgba(142,43,35,0.7)] hover:-translate-y-0.5 active:translate-y-0",
  outline:
    "border border-line-strong bg-card text-ink shadow-[0_1px_2px_rgba(21,17,14,0.04)] hover:border-spotlight hover:text-spotlight hover:shadow-[0_8px_20px_-12px_rgba(21,17,14,0.35)]",
  ghost: "text-ink-soft hover:bg-spotlight-tint hover:text-spotlight",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-spotlight",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = "Button";
