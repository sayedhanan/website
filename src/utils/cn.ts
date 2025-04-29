import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with conflict resolution and conditional logic.
 */
export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(...inputs));
}
