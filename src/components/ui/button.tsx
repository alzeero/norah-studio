import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-tight transition-all duration-300 ease-premium disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  // Fixed dark text on purpose: the gold fill stays roughly the same
  // lightness in both themes, so text-fg (which flips to soft white in
  // dark mode) would lose contrast against it.
  solid: "bg-gold text-black hover:bg-gold-deep hover:text-bg shadow-gold",
  outline: "border border-gold/70 text-current hover:border-gold hover:bg-gold/10",
  ghost: "text-current hover:text-gold",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-6 text-[0.9375rem]",
  lg: "h-14 px-9 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "solid", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
