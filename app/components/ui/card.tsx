import React from "react";
<<<<<<< HEAD
import { cn } from "@/lib/utils"; // Ensure you have a utility for merging classNames
=======
import { cn } from "../../lib/utils"; // Ensure you have a utility for merging classNames
>>>>>>> fd03747 (Finance Viz Project)

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("bg-gray-900 shadow-md rounded-lg p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }: CardProps) {
  return (
    <div className={cn("border-t border-gray-700 p-4", className)} {...props}>
      {children}
    </div>
  );
}
