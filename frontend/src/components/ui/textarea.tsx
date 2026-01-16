import * as React from "react";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>( 
  ({ className = "", ...props }, ref) => {
    const base = "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50";
    const classes = `${base} ${className}`.trim();
    return <textarea ref={ref} className={classes} {...props} />;
  }
);

Textarea.displayName = "Textarea";
