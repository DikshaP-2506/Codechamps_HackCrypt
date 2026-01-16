import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold";
  const variants: Record<string, string> = {
    default: "bg-emerald-600 text-white",
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-300 text-gray-800",
  };
  const classes = `${base} ${variants[variant] || variants.default} ${className}`.trim();
  return <span className={classes} {...props} />;
}
