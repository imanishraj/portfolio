# Portfolio Website: Day and Night Circus Theme

This plan details the implementation of a Next.js (React) front-end portfolio featuring a dual-theme setup ("Circus Clown" for Day, "Dark Clown" for Night) with interactive SVGs, Three.js atmospheric effects, and an external basic Claude API setup for future serverless integrations.

## User Review Required

> [!IMPORTANT]
> Please review the generated visual mockups and themes below. Do these capture the aesthetic you had in mind for both modes? We will proceed to initialized the Next.js stack with Tailwind once you approve.

## Design Deliverables & Mockups

````carousel
![Day Theme Mockup - Chaotic Fun Circus](C:\Users\lenovo\.gemini\antigravity\brain\d65b8150-d004-40f6-a460-f31481019a96\day_layout_mockup_1775305250573.png)
<!-- slide -->
![Night Theme Mockup - Sinister Pennywise Vibe](C:\Users\lenovo\.gemini\antigravity\brain\d65b8150-d004-40f6-a460-f31481019a96\night_layout_mockup_1775305270759.png)
<!-- slide -->
![Day Clown Face Closeup](C:\Users\lenovo\.gemini\antigravity\brain\d65b8150-d004-40f6-a460-f31481019a96\day_clown_face_1775305288313.png)
<!-- slide -->
![Night Clown Face Closeup](C:\Users\lenovo\.gemini\antigravity\brain\d65b8150-d004-40f6-a460-f31481019a96\night_clown_face_1775305305855.png)
````

### Typography Suggestions

1. **Day Theme (Circus Clown)**
   - **Headings**: *Rye*, *Bangers*, or *Ranchers* (Google Fonts) – Gives a bumpy, bouncy, hand-painted carnival signage feel.
   - **Body**: *Comic Neue* or *Nunito* – Playful, rounded, highly readable to balance chaotic headings.
2. **Night Theme (Pennywise / Dark Clown)**
   - **Headings**: *Creepster*, *Nosifer*, or *Sancreek* – Ominous, sharp, slightly distressed lettering.
   - **Body**: *Courier Prime* or *Special Elite* – Typewriter style tracking, adding an unsettling, classic horror movie feel.

### Color Tokens

| Theme | Token Role | Hex Color | Notes |
|-------|------------|-----------|-------|
| **Day** | Primary Background | `#87CEEB` (Sky Blue) | Clean bright circus sky |
| **Day** | Primary Accent | `#FF0000` (Classic Red) | Clown nose red, balloons, strong borders |
| **Day** | Secondary Accent | `#FFD700` (Yellow) | Playful warmth, balloon highlights |
| **Day** | Text & Contrast | `#FFFFFF` (White) | Pure white for clear reading and blocks |
| **Night**| Primary Background | `#0A0A0A` (Near-Black) | Deep dark dense mood |
| **Night**| Primary Accent | `#8B0000` (Deep Red) | Sinister red for blood, Pennywise lips |
| **Night**| Secondary Accent | `#39FF14` (Toxic Green) | Used sparingly for glowing eye irises/shadows |
| **Night**| Text & Contrast | `#E0E0E0` (Sickly White) | Dull pale skin tone for readable elements |

## Proposed Changes

### 1. Project Initialization
- Run `npx create-next-app@latest .` with TypeScript, Tailwind CSS, App Router.

### 2. Components & Structure
- **ThemeContext**: A React Context provider to manage `light` (Day) vs `dark` (Night) state, saving to `localStorage` and toggling `HTML` class `dark`.
- **ThreeScene Component**: Implement `three.js` to handle:
  - Floating bouncy balloons in Day mode.
  - Floating ominous, half-deflated red balloons + dark fog (`THREE.FogExp2`) in Night mode.
- **ClownCursor Component**: 
  - Build interactive SVG anchored to the bottom using `requestAnimationFrame`.
  - Listen to `mousemove` events, map coordinates to rotation/translation shifts in the SVG pupils.
  - Day: White pupils tracking around. 
  - Night: Add CSS drop-shadow `pulse` effects to glowing green/red irises in SVG.
- **ThemeToggleButton**: A floating balloon-shaped UI button strictly placed to handle toggling.

### 3. API Route
- `/src/app/api/route.ts`: Basic layout of an endpoint expecting `POST` requests handling a prompt/payload, stubbing out Claude API call logic to be implemented later.

## Open Questions

> [!CAUTION]
> 1. We will use `framer-motion` for smooth UI transitions (like the background sky, theme switch) and `three.js` (with `@react-three/fiber` to make it easier to load inside React) for the atmospheric effects. Do you approve this tooling stack on top of the requested ones? 
> 2. Because of the previous manual exit during Next.js initialization, do you want to manually run the install command or should I auto-run the Next.js setup with Tailwind included in this execution?

## Verification Plan

### Automated/Manual Verifications
- Run `npm run dev` to serve the website locally.
- Use `read_url_content` or `browser_subagent` to test the page layout structure natively.
- Confirm toggle click reliably updates state and forces Theme, Clown SVG styles, and Three.js environment changes.
