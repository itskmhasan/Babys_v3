import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "ring-offset-background placeholder:text-muted-foreground",
        "focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-70 disabled:border-gray-300",
        // 🌙 Dark mode improvements
        "dark:bg-gray-800 dark:text-gray-100 dark:border-gray-500",
        "dark:placeholder:text-gray-400 dark:focus:ring-blue-400 dark:focus:border-blue-400",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
