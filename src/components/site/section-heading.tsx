import { cn, isArabicText } from "@/lib/utils";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  heading: string;
  align?: "center" | "start";
  className?: string;
};

export function SectionHeading({ eyebrow, heading, align = "center", className }: SectionHeadingProps) {
  return (
    <Reveal className={cn(align === "center" ? "text-center" : "text-start", className)}>
      <span
        className={cn(
          "text-eyebrow font-medium uppercase text-gold",
          isArabicText(eyebrow) ? "font-arabic" : "font-sans tracking-widest2"
        )}
      >
        {eyebrow}
      </span>
      <h2 className={cn("mt-4 text-heading-lg font-medium text-fg text-balance")}>{heading}</h2>
    </Reveal>
  );
}
