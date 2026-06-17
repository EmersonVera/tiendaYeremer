---
name: Libreta de Confianza
colors:
  surface: '#fbf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#fbf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ef'
  surface-container: '#efeeea'
  surface-container-high: '#eae8e4'
  surface-container-highest: '#e4e2de'
  on-surface: '#1b1c1a'
  on-surface-variant: '#41474e'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f0ed'
  outline: '#72787f'
  outline-variant: '#c1c7cf'
  surface-tint: '#316289'
  primary: '#074469'
  on-primary: '#ffffff'
  primary-container: '#2a5c82'
  on-primary-container: '#a5d4ff'
  inverse-primary: '#9ccbf7'
  secondary: '#376847'
  on-secondary: '#ffffff'
  secondary-container: '#b6edc2'
  on-secondary-container: '#3b6d4b'
  tertiary: '#821218'
  on-tertiary: '#ffffff'
  tertiary-container: '#a32c2c'
  on-tertiary-container: '#ffbfba'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cde5ff'
  primary-fixed-dim: '#9ccbf7'
  on-primary-fixed: '#001d32'
  on-primary-fixed-variant: '#124a6f'
  secondary-fixed: '#b9efc5'
  secondary-fixed-dim: '#9dd3aa'
  on-secondary-fixed: '#00210e'
  on-secondary-fixed-variant: '#1e5031'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ae'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#8b191d'
  background: '#fbf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2de'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  display-md-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1.6'
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  amount-lg:
    fontFamily: Work Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: -0.01em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  container-margin: 16px
  gutter: 16px
---

## Brand & Style
The brand personality is grounded in the neighborhood spirit: reliable, approachable, and human. The design system prioritizes a **Modern-Tactile** style that mimics the familiarity of a physical ledger or notebook while maintaining the efficiency of a digital tool. It aims to evoke a sense of clarity and "honest commerce" (trato justo).

The target audience consists of small shop owners and their local customers. The UI must feel as welcoming as a storefront, using soft textures and a warm palette to reduce the stress often associated with debt management. Minimalism is employed to keep the focus on clarity and ease of use for people on the go.

## Colors
This design system utilizes a palette inspired by natural paper and traditional storefront signage.

- **Primary (Storefront Blue):** Used for navigation, primary actions, and branding. It conveys stability and professionalism.
- **Secondary (Growth Green):** Reserved exclusively for positive financial movements—payments received and credit balances.
- **Tertiary (Alert Red):** Used strictly for outstanding debts and "fiados" to ensure immediate recognition of amounts owed.
- **Neutral (Warm Paper):** The background is not a harsh white but a warm cream (`#FDFBF7`), reducing eye strain and providing a tactile, organic feel reminiscent of a quality notebook.

## Typography
The typography system balances the friendly, rounded nature of **Plus Jakarta Sans** for headings with the high legibility and professional structure of **Work Sans** for data and numbers.

- **Headlines:** Use Plus Jakarta Sans to maintain an optimistic and modern tone.
- **Financial Data:** All currency amounts must use Work Sans with Medium or Bold weights to ensure numbers are never misread. 
- **Spanish Localization:** Ensure all character sets support Spanish accents (tildes) and the "ñ".
- **Scale:** On mobile, display sizes are slightly reduced to prioritize content density while maintaining large touch targets.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a heavy emphasis on mobile-first ergonomics. 

- **Mobile (Default):** 4-column grid. Single column for list items. Margins are fixed at 16px to maximize horizontal space for names and amounts.
- **Tablet/Desktop:** 12-column grid. Content is contained within a max-width of 800px to maintain the "notebook" feel and prevent line lengths from becoming illegible.
- **Touch Targets:** All interactive elements (buttons, list items) have a minimum height of 48px to accommodate quick use behind a counter or on the move.

## Elevation & Depth
This design system avoids heavy shadows in favor of **Tonal Layers** and subtle physical metaphors.

- **The "Paper" Base:** The lowest layer is the warm background.
- **Cards:** Content is grouped into cards with a 1px solid border (`#E5E0D5`). No shadow is used for static cards.
- **Active Elements:** Buttons and active input fields use a very soft, low-opacity "ambient" shadow (4px blur, 10% opacity) to suggest they can be pressed.
- **Depth Hierarchy:** Modals and "sticky" action bars use a slightly darker border and a backdrop blur to separate them from the ledger list.

## Shapes
Shapes are intentionally rounded to feel "soft" and friendly, mirroring the rounded corners of a handheld notebook. 

- **Standard Elements:** Buttons, cards, and input fields use a 0.5rem (8px) radius.
- **Search & Chips:** Search bars use the "Pill" shape for a more modern, distinct look compared to transactional cards.
- **Checkmarks:** Circular containers are used for completion states to provide a satisfying visual "done" signal.

## Components
Consistent implementation of components ensures the store owner can navigate the "Libreta" without friction.

- **Buttons:** 
  - *Primary:* Filled with Primary Blue, white text. Large and centered for main actions like "Nuevo Fiado."
  - *Secondary:* Outlined or ghost buttons for less frequent actions.
- **Customer Cards:** List items that display the name on the left and the total balance on the right. If the balance is > 0 (debt), the text is Tertiary Red. If 0 or credit, it is Secondary Green.
- **Input Fields:** Large, clearly labeled fields with a prominent "currency" prefix for amount entries. Use the numeric keyboard by default on mobile for these fields.
- **Action Chips:** Used for quick-filtering the list (e.g., "Pendientes," "Pagados," "Hoy").
- **Transaction Logs:** Chronological lists within a customer view, using a subtle vertical line to connect events, creating a "timeline" feel.