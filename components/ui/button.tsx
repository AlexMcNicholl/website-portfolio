import React from "react";
import { Slot } from "@radix-ui/react-slot"; // Import Slot for asChild functionality
import { cn } from "@/lib/utils"; // Utility for conditional classNames

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  asChild?: boolean; // Add asChild prop
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"; // Use Slot if asChild is true
    return (
      <Comp
        ref={ref}
        className={cn(
          "px-4 py-2 rounded",
          variant === "outline" && "border border-gray-300",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
