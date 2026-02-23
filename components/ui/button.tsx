import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva("inline-flex items-center justify-center rounded-md text-sm font-medium", {
  variants: {
    variant: {
      default: "bg-slate-900 text-white hover:bg-slate-700",
      outline: "border border-slate-300 bg-white"
    }
  },
  defaultVariants: { variant: "default" }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, ...props }, ref) => (
  <button className={cn(buttonVariants({ variant }), className)} ref={ref} {...props} />
));
Button.displayName = "Button";

export { Button, buttonVariants };
