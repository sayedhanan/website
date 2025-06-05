"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

/** Define variant-driven styles, including CSS-first focus ring **/
const inputVariants = cva(
  "w-full px-4 border rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-[--color-accent]   // focus ring from CSS token :contentReference[oaicite:12]{index=12}",
  {
    variants: {
      inputSize: {
        sm: "h-8 text-sm",
        default: "h-9 text-base",
        lg: "h-10 text-lg",
      },
    },
    defaultVariants: { inputSize: "default" },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, className, inputSize, ...props }, ref) => (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-[--color-primary-text] dark:text-[--color-surface] mb-1"  // label color token :contentReference[oaicite:13]{index=13}
        >
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          inputVariants({ inputSize }),
          "bg-[--color-surface] border-[--color-border] text-[--color-primary-text] dark:bg-[--color-surface] dark:border-[--color-border] dark:text-[--color-primary-text]"  // background, border, text tokens :contentReference[oaicite:14]{index=14}
        )}
        {...props}
      />
    </div>
  )
);

Input.displayName = "Input";
