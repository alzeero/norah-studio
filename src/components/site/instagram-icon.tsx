/** Instagram glyph (rounded square + lens + flash dot), drawn with basic
 *  shapes rather than a traced path — this is the standard monochrome
 *  line-art form of the mark, matching how it's used everywhere a single
 *  brand color (not the multicolor gradient) is called for. */
export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" focusable="false">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.6" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.6" cy="6.4" r="1.15" fill="currentColor" />
    </svg>
  );
}
