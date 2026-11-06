import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 className 并解决 Tailwind 冲突，全站唯一入口 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
