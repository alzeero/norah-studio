/** TikTok glyph (musical note over a disc), drawn inline — no new icon
 *  package dependency needed. Renders in currentColor to match the site's
 *  own palette. */
export function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M16.6 2h-3.2v13.9c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3c.28 0 .55.04.8.11V9.7a6.3 6.3 0 0 0-.8-.05A6.25 6.25 0 0 0 4.15 21.9a6.25 6.25 0 0 0 10.65-4.4V8.75a8.1 8.1 0 0 0 4.75 1.53V7.06a4.9 4.9 0 0 1-2.84-1.4A4.86 4.86 0 0 1 16.6 2Z" />
    </svg>
  );
}
