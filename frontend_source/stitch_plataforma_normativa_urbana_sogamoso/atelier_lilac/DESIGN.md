---
name: Atelier Lilac
colors:
  surface: '#fef7ff'
  surface-dim: '#e1d5ee'
  surface-bright: '#fef7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf0ff'
  surface-container: '#f5eaff'
  surface-container-high: '#f0e3fc'
  surface-container-highest: '#eadef6'
  on-surface: '#1f182a'
  on-surface-variant: '#49454f'
  inverse-surface: '#342d3f'
  inverse-on-surface: '#f7edff'
  outline: '#7a7580'
  outline-variant: '#cbc4d0'
  surface-tint: '#685393'
  primary: '#655090'
  on-primary: '#ffffff'
  primary-container: '#7e69ab'
  on-primary-container: '#fffbff'
  inverse-primary: '#d2bcff'
  secondary: '#67548f'
  on-secondary: '#ffffff'
  secondary-container: '#d2bcfe'
  on-secondary-container: '#5b4882'
  tertiary: '#5c5b64'
  on-tertiary: '#ffffff'
  tertiary-container: '#75737d'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#eaddff'
  primary-fixed-dim: '#d2bcff'
  on-primary-fixed: '#230c4c'
  on-primary-fixed-variant: '#4f3b7a'
  secondary-fixed: '#eaddff'
  secondary-fixed-dim: '#d2bcfe'
  on-secondary-fixed: '#220f47'
  on-secondary-fixed-variant: '#4f3d75'
  tertiary-fixed: '#e4e1ed'
  tertiary-fixed-dim: '#c8c5d0'
  on-tertiary-fixed: '#1b1b23'
  on-tertiary-fixed-variant: '#47464f'
  background: '#fef7ff'
  on-background: '#1f182a'
  surface-variant: '#eadef6'
typography:
  display:
    fontFamily: Outfit
    fontSize: 4.5rem
    fontWeight: '400'
    lineHeight: '1.05'
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Outfit
    fontSize: 2.75rem
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 3rem
    fontWeight: '400'
    lineHeight: '1.15'
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Outfit
    fontSize: 2rem
    fontWeight: '500'
    lineHeight: '1.25'
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Outfit
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: '1.35'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.65'
    letterSpacing: -0.005em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: 0.005em
  label-lg:
    fontFamily: Outfit
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: '1.2'
    letterSpacing: 0.06em
  label-md:
    fontFamily: Outfit
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Outfit
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: 0.1em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3.5rem
  margin-mobile: 1.25rem
  space-xs: 0.375rem
  space-sm: 0.75rem
  space-md: 1.25rem
  space-lg: 2.25rem
  space-xl: 4rem
---

## Brand & Style

This design system embodies a high-end editorial digital studio aesthetic: curated, confident, serene, and deeply intentional. Crafted for luxury portfolios, boutique creative agencies, and strategic design consultancies, it bridges warm editorial refinement with contemporary digital precision.

The visual tone relies on an artful equilibrium:
- **Atmospheric Warmth**: Warm off-white and soft cream foundations replace sterile clinical whites, lending physical paper tactility to digital screens.
- **Poetic Accents**: Subtle lilac and muted wisteria tones inject calm intelligence, sophistication, and thoughtful restraint without aggressive neon intensity.
- **Architectural Structure**: Razor-thin, whisper-light hairline borders (`1px` solid muted dividers) segment modular content blocks, evoking the rhythm of an independent art publication.
- **Expressive Typographic Contrast**: High-contrast geometric headlines accented with fluid italics and refined micro-labels convey bespoke craft and authority.

## Colors

The palette establishes an intimate, luxury editorial environment through muted purple harmonies balanced against warm, natural surfaces:

- **Primary (`#7E69AB`)**: Rich studio lilac used for hero callouts, key buttons, and active interactive triggers.
- **Secondary (`#9A86C4`)**: Soft wisteria used for badge fills, secondary actions, and gentle gradient endpoints.
- **Tertiary (`#EFEBF7`)**: Whisper lilac used for light surface fills, active list item backgrounds, and soft accent badges.
- **Neutral Deep (`#2D2638`)**: Deep plum-charcoal serving as primary typography, dark feature blocks, and assertive tactile buttons. It maintains softer, richer contrast than pure `#000000`.
- **Canvas & Surface Tones**: Primary canvas sits on warm cream (`#FAF8F5`), with secondary containers and cards resting on warm paper parchment (`#F5F3EF`).
- **Dividers & Hairlines**: Borders leverage low-contrast slate-purple tints (`rgba(45, 38, 56, 0.08)` to `rgba(45, 38, 56, 0.12)`), providing structure without visual clutter.

## Typography

The typographic hierarchy creates an editorial dialogue between the geometric authority of **Outfit** and the human warmth of **Plus Jakarta Sans**:

- **Headline Styling**: Display and large headlines are rendered predominantly in uppercase or capitalized sentence case, frequently utilizing a contrasting script/italic accent word in a secondary lilac hue (`#7E69AB`) to create an editorial signature flourish.
- **Section Eyebrows & Metadata**: Set strictly in `label-sm` or `label-md` with uppercase transformations, high letter spacing (`0.08em` - `0.1em`), paired with minimalist symbols (such as an eight-pointed asterisk `✦` or `✱`).
- **Body Text**: Clean, open, and relaxed line heights ensure frictionless legibility against cream backgrounds.

## Layout & Spacing

The layout is governed by a 12-column editorial fluid grid rooted in generous breathing room, modular hairline divisions, and deliberate vertical rhythm.

- **Desktop (1024px+)**: 12 columns with `1.5rem` gutters and `3.5rem` outer canvas padding. Maximum content container width capped at `1320px` to maintain optimal line lengths.
- **Tablet (768px - 1023px)**: 8 columns with `1.25rem` gutters and `2rem` outer margin. Section splits transition to single or 2-column balanced pairs.
- **Mobile (< 768px)**: 4 columns with `1rem` gutters and `1.25rem` outer margins. Complex horizontal interactive sequences (such as multi-step process rows) convert into vertical stacked cards or horizontally swipeable ribbons.
- **Modular Dividers**: Content sections do not rely on heavy colored blocks; instead, structural thin lines (`1px` width) separate adjacent regions cleanly.

## Elevation & Depth

Visual hierarchy and spatial depth are communicated through tonal layering and refined, barely-there ambient shadows rather than stark elevation drops:

- **Surface Tiers**:
  - `Base`: Primary canvas `#FAF8F5`.
  - `Layer 1`: Inset modules, card backgrounds, and process steps `#F5F3EF` or `#EFEBF7`.
  - `Layer 2 (Accent High-Contrast)`: Deep charcoal-plum `#2D2638` used for impact blocks (metrics panels, floating tooltips, dark hero overlays).
- **Ambient Shadows**: Shadows are soft, atmospheric, and tinted with the base neutral tone:
  - *Subtle Floating Elements*: `0 8px 32px -4px rgba(45, 38, 56, 0.06)`
  - *Interactive Overlays / Menus*: `0 16px 48px -8px rgba(45, 38, 56, 0.12)`
- **Hairline Outlines**: Elements and containers feature delicate outlines: `1px solid rgba(45, 38, 56, 0.08)`.

## Shapes

The shape system blends sculptural pill containers with softly rounded architectural frames:

- **Pill Radius (`rounded-full` / `9999px`)**: Reserved for action buttons, status badges, circular icon trays, and floating category pills.
- **Modular Containers (`rounded-xl` / `1.5rem` - `2rem`)**: Applied to cards, showcase media masks, and dark metric strips.
- **Arched Hero Cutouts**: Signature editorial photography containers employ distinct architectural arch treatments (e.g., pill-top border radii with flat bottoms, or fully rounded asymmetric organic curves) echoing the studio portrait layout.

## Components

### Buttons
- **Primary Studio Button**: Pill-shaped (`rounded-full`), filled with `#7E69AB` or `#2D2638`, with white typography in `label-lg`. Padding: `0.875rem 1.75rem`. Accompanied by a subtle upward-right arrow (`↗`) icon.
- **Secondary / Ghost Button**: Pill-shaped, transparent background with a `1px solid rgba(45, 38, 56, 0.2)` border. On hover, transitions smoothly to `#EFEBF7`.
- **Circular Action Icon**: Pill circular button (`40px` × `40px` or `48px` × `48px`) holding directional navigation arrows (`↗`, `→`), styled in solid deep neutral with white glyphs.

### Chips & Badges
- **Editorial Eyebrow Badge**: Pill-shaped, `#EFEBF7` background, text in `#7E69AB`, `label-sm` tracking. Often paired with a preceding micro star or dot.
- **Status Indicator**: Small circular badge with rotating or stamp text formatting (e.g., "AVAILABLE FOR FREELANCE •").

### Interactive Service & Process Lists
- **Editorial List Row**: Flat list separated by top and bottom `1px solid rgba(45, 38, 56, 0.1)` rules. Contains icon on the left, primary service title, secondary description, and right-aligned arrow (`→`).
- **Interactive State**: On hover, background shifts to a faint tint of `#EFEBF7` while the right arrow shifts right by `4px`.
- **Step / Process Cards**: Horizontal track with speech-bubble or circular node headers in `#EFEBF7` connected by delicate dotted or solid indicator lines.

### Cards & Media Frames
- **Portfolio Showcase Card**: Warm neutral container (`#F5F3EF`), subtle border, image nested with `rounded-lg` corners. Title in `headline-sm` with subcategory in uppercase tracking. Features a floating circular arrow trigger positioned over the preview.
- **Dark Metric Bar**: Deep charcoal-plum (`#2D2638`) card with high-contrast lilac data points (`#9A86C4`), clean white body metadata, and segmented column dividers.

### Form Inputs & Checkboxes
- **Text Inputs**: Flat bottom hairline rule (`1.5px solid rgba(45, 38, 56, 0.2)`) on `#FAF8F5`, transitioning to `#7E69AB` upon focus, or fully enclosed pill-shaped search inputs with muted lilac placeholder text.
- **Checkboxes & Radios**: Minimalist `18px` circles with `1.5px` border in `#7E69AB`. When selected, fills with solid `#7E69AB` hosting a white geometric checkmark.