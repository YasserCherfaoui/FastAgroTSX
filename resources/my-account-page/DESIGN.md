# Design System Specification: Industrial Harvest

## 1. Overview & Creative North Star
**The Creative North Star: "The Architectural Greenhouse"**

This design system rejects the "cluttered marketplace" aesthetic in favor of a high-end, industrial-editorial experience. We are merging the raw efficiency of logistics with the premium freshness of high-grade agriculture. The visual language is defined by structural integrity, intentional negative space, and a rejection of decorative fluff. 

To move beyond a "template" look, we employ **Industrial Asymmetry**: use wide margins and staggered grid placements to create a sense of scale. The interface should feel like a premium broadsheet newspaper met a modern architectural blueprint—authoritative, efficient, and impeccably organized.

---

## 2. Colors: Tonal Depth & The "No-Line" Rule
We use color to define structure. By moving away from lines, we create an interface that feels more like an expansive physical environment and less like a series of boxes.

### Palette Strategy
*   **Primary (`#1B5E20`):** Use for high-authority moments. This isn't just "green"; it's a deep forest tone representing growth and stability.
*   **Secondary/Accent (`#F57F17`):** Use sparingly for "Velocity Triggers"—CTAs, urgent stock alerts, and speed-related metrics.
*   **Neutral Background (`#FAFAF5`):** A warm, gallery-white that prevents the "clinical" feel of pure #FFFFFF, providing a sophisticated backdrop for produce photography.

### The "No-Line" Rule
**Explicit Instruction:** Do not use 1px solid borders to section content.
Boundaries are created through **Background Color Shifts**. A `surface-container-low` card sitting on a `surface` background is the only "border" you need. This creates a seamless, modern flow that guides the eye without visual "stuttering."

### Signature Textures & Glassmorphism
For floating navigation or high-level overlays, utilize **Glassmorphism**. Use `surface-container-lowest` with a 20px backdrop blur and 85% opacity. This allows the vibrant colors of the agriculture imagery to bleed through subtly, maintaining the "Industrial-Fresh" vibe.

---

## 3. Typography: Editorial Authority
The contrast between the geometric rigor of **Plus Jakarta Sans** and the Swiss-style utility of **Inter** creates a professional, B2B hierarchy.

*   **Display & Headlines (Plus Jakarta Sans):** These are your structural beams. Use `display-lg` for hero pricing and `headline-md` for category sections. The tight letter-spacing and bold weights convey "Wholesale Authority."
*   **Body & Labels (Inter):** This is your data layer. Inter is used for all "hard" information—SKUs, logistics data, and pricing tiers. It is optimized for high-speed scanning.

**Hierarchy Tip:** Always pair a `headline-sm` with a `label-md` in all-caps (using the `secondary` color) for a sophisticated, editorial tag look.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often too "digital." In this system, we use **Tonal Layering** to create hierarchy.

*   **The Layering Principle:** 
    *   Base: `surface`
    *   Sectioning: `surface-container-low`
    *   Interactive Components: `surface-container-lowest` (the "White" lift)
*   **Ambient Shadows:** If an element must float (e.g., a wholesale pricing calculator), use a shadow tinted with `on-surface` at 6% opacity with a 32px blur. It should look like a soft shadow cast on a concrete floor, not a "drop shadow" effect.
*   **The Ghost Border Fallback:** If accessibility requires a border, use `outline-variant` at 15% opacity. It should be barely perceptible.

---

## 5. Components

### Wholesale Pricing Tiers
*   **Structure:** Vertical stack, no borders. Use `surface-container-high` for the "Active" tier.
*   **Typography:** The price should use `headline-lg` (Plus Jakarta Sans) to dominate the card.
*   **Context:** Include a `label-sm` for "Price per unit" directly under the main price.

### Professional Form Inputs
*   **Dimensions:** Height: 44px | Radius: 8px (the `DEFAULT` scale).
*   **Visuals:** Background: `surface-container-lowest`. 
*   **States:** On Focus, transition the background to `surface-container-highest` and add a 2px `primary` bottom-bar only. No full-box strokes.

### Status Indicators
*   **Stock Dots:** A 6px solid circle. Green (`primary`) for In Stock, Amber (`secondary`) for Low Stock, and `on-surface-variant` for Out of Stock.
*   **Category Pills:** High-contrast `label-md` text on `surface-container-highest`. No radius; use a strict 4px radius for an industrial "tag" feel.

### Buttons
*   **Primary:** `primary` background with `on-primary` text. No rounded-full; use the `DEFAULT` (8px) radius to maintain the industrial language. 
*   **Secondary:** `surface-container-highest` background with `on-surface` text.
*   **The "Action" Gradient:** For the main "Complete Order" button, use a subtle linear gradient from `primary` to `primary-container`. This adds a "premium" depth.

---

## 6. Do's and Don'ts

### Do:
*   **Do** use extreme vertical whitespace (e.g., 80px or 120px) between major sections to let the design breathe.
*   **Do** use "Surface Stacking" (putting a light card on a slightly darker section) to define focus.
*   **Do** use Plus Jakarta Sans for any text that is meant to be "Read" and Inter for any text meant to be "Processed."

### Don't:
*   **Don't** use icons with rounded, bubbly ends. Use sharp, industrial, geometric iconography.
*   **Don't** use standard "Grey" shadows. Always tint shadows with the background tone.
*   **Don't** use 1px dividers between list items. Use 12px of `surface-container-low` space instead.
*   **Don't** use "Playful" animations. All transitions must be functional (e.g., 200ms linear ease-out). No bounciness.

---
**Director’s Note:** This system is about the "Power of the Grid." When you align a large `display-lg` headline with the edge of a data table, the alignment itself creates the beauty. You don't need lines or boxes when your architecture is sound. Use the tones, let the type speak, and keep the commerce efficient.