import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "placeholder:text-muted-foreground focus:outline-none",
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
Input.displayName = "Input";

export { Input };
