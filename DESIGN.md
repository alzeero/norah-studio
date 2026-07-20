# Design system — Norah Studio

## Color

Extracted by sampling actual pixels from the provided logo files (not eyeballed) — see the values below used verbatim as CSS custom properties in `src/app/globals.css`.

**Light mode**
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#FAF7F1` | warm white background |
| `--fg` | `#15130F` | near-black type |
| `--gold` | `#C6A25C` | accent — measured average of the logo's gold foil across all three files |
| `--gold-deep` | `#9C7C3E` | hover/pressed states |
| `--border` | `#E9E2D2` | hairlines |

**Dark mode**
| Token | Hex | Use |
|---|---|---|
| `--bg` | `#141D16` | the logo's exact deep greenish-black (sampled, not a generic near-black) |
| `--fg` | `#F2EFE6` | soft white type |
| `--gold` | `#D3B274` | accent, brightened slightly for contrast against the dark background |

Dark mode isn't an inverted palette — background, elevated surfaces, and gold are each tuned independently so cards and hairlines read as genuine depth rather than a CSS filter.

## Typography

- **Latin:** Geist Sans (Vercel's own package, not next/font/google) — clean, tight tracking on display sizes, matching the "clean Vercel-style typography" brief.
- **Arabic:** Noto Kufi Arabic. Kufi letterforms are geometric and architectural rather than calligraphic/decorative, which is what makes them read as premium and modern in branding rather than ornamental — and they pair naturally with the logo's own angular geometry. Full 400–800 weight range, so the same hierarchy system (eyebrow / display / heading / body) works identically in both scripts.
- **Direction handling:** the site defaults to Arabic (RTL) with an EN toggle, mirroring the Seven Store reference site's own pattern. Independently of that toggle, any admin-entered free text (testimonials, hero title/subtitle) is auto-detected per-string and rendered with the matching font + direction — so a testimonial pasted verbatim from a real Arabic WhatsApp message always renders correctly in Kufi/RTL even when a visitor has the UI set to English.
- The logo wordmark itself is used as an image asset everywhere the brand mark appears, exactly as designed — it was intentionally never redrawn in a web font, per the brief.

## Signature motif: viewfinder corners

Rather than a generic decorative flourish, the one recurring signature element is a pair of thin gold corner brackets — literally the vocabulary of a camera viewfinder / autofocus frame — that fade in on hover over gallery images, category tiles, and around the lightbox. It's drawn from the subject itself (photography) rather than applied as decoration, and echoes the logo's own angular linework.

## Layout

- Editorial CSS grid for the gallery (not a uniform square grid or a column-masonry): a repeating span pattern creates intentional size variation while preserving the admin's chosen `sort_order` reading sequence — masonry libraries reflow top-to-bottom per column, which would break curated ordering.
- Section rhythm: eyebrow label → heading → content, consistently, so structure signals "you are here" rather than decorating.
- No numbered markers (01/02/03) anywhere — the portfolio categories aren't a sequence, so a step-style treatment would encode information that isn't true.

## Motion

Framer Motion throughout, deliberately restrained:
- One orchestrated hero load sequence (staggered fade/rise), not scattered effects.
- Scroll reveals fire once per section (`whileInView`, `once: true`).
- The WhatsApp button carries the one "living" element on the page — a slow, soft pulsing ring — as the single spent piece of boldness on that section.
- `prefers-reduced-motion` is respected everywhere (Reveal falls back to a static wrapper; global CSS collapses all durations).

## What was and wasn't reverse-engineered from Seven Store

`sevenstore7.vercel.app` was fetched and reviewed in full. Its rendered CSS (exact font-family, spacing scale, shadow/blur values) isn't accessible through automated fetching — it does confirm, though, that Seven Store is itself Arabic-first with an English toggle, structured as sections on one scrollable page (hero → products → why-us → customer reviews → FAQ → contact), which directly informed Norah Studio's own bilingual approach and section rhythm. The specific type scale, spacing, radii, and shadows here were built from the brief's explicit instructions (Geist Sans, "clean Vercel-style," Apple/Leica/Hasselblad-level restraint) rather than pixel-matched, since that level of detail wasn't retrievable. Send screenshots of anything on Seven Store you want matched more closely and it can be tightened.
