# Design System Strategy: The Sentinel Aesthetic

## 1. Overview & Creative North Star
This design system is built for high-stakes blockchain security environments where authority, precision, and technical sophistication are paramount. We move away from the "startup blue" templates toward a **"Digital Fortress"** Creative North Star. 

The aesthetic is characterized by deep, cinematic blacks, high-contrast typography, and vibrant "phosphor" accents that mimic high-end terminal interfaces and elite security dashboards. Rather than a flat, boxy layout, this system utilizes intentional asymmetry and tonal layering to create a sense of three-dimensional depth, guiding the user's eye toward critical security insights.

## 2. Colors
Our palette is rooted in the darkness of the terminal. We treat color not as a decoration, but as a signal.

### Surface & Hierarchy
*   **Background (`#0e0e0e`):** The absolute foundation. 
*   **The "No-Line" Rule:** Explicitly prohibit 1px solid borders for sectioning. Structural separation is achieved through background shifts. A section requiring focus should transition from `background` to `surface-container-low` (`#131313`) or `surface-container` (`#1a1a1a`).
*   **Surface Hierarchy & Nesting:** Treat the UI as layers of fine material. To lift a card, place a `surface-container-highest` (`#262626`) element on top of a `surface-container-low` section.

### Accents & Signage
*   **Primary (`#8bbbff`):** Used for "Hardened Security" and primary actions. It represents trust and the "Shield."
*   **Secondary (`#91f78e`):** Used for "Active Status" and success metrics. It represents the "Go" signal in a security audit.
*   **Signature Textures:** For high-impact areas like Hero CTAs, use a subtle gradient transition from `primary` (`#8bbbff`) to `primary-container` (`#72a3e5`) at a 135-degree angle.

### The Glass Rule
Floating elements (modals, tooltips, or detached navigation bars) should use a semi-transparent `surface-variant` (`#262626` at 80% opacity) with a `20px` backdrop blur to create a "frosted glass" effect that maintains context with the content beneath.

## 3. Typography
We use **Plus Jakarta Sans** as our sole typeface. Its wide stance and geometric clarity provide an "Editorial Tech" feel that balances readability with a modern, high-end edge.

*   **Display Scale (`display-lg` to `display-sm`):** Reserved for hero value propositions. Use `tight` letter-spacing (-0.02em) to give headings an authoritative, punchy feel.
*   **Headline Scale:** Used for section titles. These should lead the eye and establish the "editorial" grid.
*   **Title Scale:** Used for card titles and sub-sections.
*   **Body Scale (`body-lg` to `body-sm`):** High readability is key. Use `on-surface-variant` (`#adaaaa`) for secondary body text to reduce visual noise.
*   **Label Scale:** For technical metadata and micro-copy. Always uppercase with a `+0.05em` letter-spacing for a technical, "scanned" look.

## 4. Elevation & Depth
Depth in this system is a measure of importance, not just a shadow.

*   **The Layering Principle:** Avoid shadows for static content. Instead, use "Tonal Layering." A card is "lifted" by being 2-3 shades lighter than its parent container.
*   **Ambient Shadows:** For elements that truly float (e.g., the "Accuracy Rate" badge in the reference), use an extra-diffused shadow: `box-shadow: 0 20px 40px rgba(0,0,0,0.4)`. The shadow should feel like a soft glow of darkness.
*   **The "Ghost Border" Fallback:** If accessibility requires a border, use the `outline-variant` (`#484847`) at **20% opacity**. It should be a suggestion of a boundary, not a hard line.
*   **Glassmorphism:** Use `surface-container-high` at 70% opacity with a blur to signify temporary, interactive surfaces that exist above the primary content plane.

## 5. Components

### Buttons
*   **Primary:** Fill with the Primary-to-Primary-Container gradient. Text color: `on-primary` (`#003768`). Shape: `md` (`0.375rem`) roundedness.
*   **Secondary:** `surface-container-highest` background with a `Ghost Border`. This ensures the primary CTA is the undisputed hero.
*   **Tertiary:** Ghost style; no background, only text in `primary` color with a `label-md` weight.

### Cards & Lists
*   **The No-Divider Rule:** Forbid the use of divider lines. Separate list items using `spacing-4` (1rem) of vertical white space or by alternating background tones between `surface-container-low` and `surface-container`.
*   **Security Insight Cards:** Use a vertical accent bar on the left (2px width) using the `secondary` (`#91f78e`) token to denote "Active" or "Secure" status.

### Input Fields
*   **Base State:** `surface-container-lowest` background with a subtle `outline-variant` border.
*   **Active State:** Border shifts to `primary` with a subtle `2px` outer glow (0% spread) of the same color.
*   **Error State:** Use the `error` (`#ff716c`) token for both border and helper text.

### High-Tech Accents (Context Specific)
*   **Code Snippets:** Use `surface-container-highest` with a mono-space font.
*   **Progress Indicators:** Use the `secondary` green for "Safe" zones and `primary` blue for "Audit in Progress."

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts. Let a heading hang to the left while the body text is indented.
*   **Do** use extreme vertical breathing room. The `spacing-24` (6rem) scale is your friend between major sections.
*   **Do** use the ChainShield logo as a watermark or a small, repeating pattern in `surface-container-lowest` to add brand depth.

### Don't
*   **Don't** use pure white (`#ffffff`) for long-form body text; use `on-surface-variant` to prevent eye strain on dark backgrounds.
*   **Don't** use 100% opaque borders. They clutter the technical "cleanliness" of the interface.
*   **Don't** use standard "Drop Shadows" with high opacity. They feel "Web 2.0" and undermine the premium, high-tech nature of the firm.