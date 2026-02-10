# Physics Animation Backup Documentation

**Backup Date:** 2026-01-23
**Backup File:** `opening-animation-physics-backup.js`

## Overview

This documents the original physics-based capsule animation that was replaced with a sticker-slap effect.

## How It Works

### Animation Flow
1. **Letter reveal animation** - Letters appear randomly on screen (Howdy, partner, ↓ I'm ↓, Nazarena)
2. **Avatar replacement** - The letter "o" in "Nazarena" is replaced with an avatar image
3. **Physics capsules fall** - Word capsules (Designer, Developer, Builder, Fixer, Thinker, Gardener, DIY-er) fall from above with realistic physics

### Physics Implementation

**Library:** Matter.js v0.19.0

**Key Physics Properties:**
- **Gravity:** `y: 1`, `scale: 0.0008` - Creates noticeable falling effect
- **Restitution:** `0` - No bounce, capsules settle without bouncing
- **Friction:** `0.001` - Very low, capsules slide past each other easily
- **Air Resistance:** `0.02` - Slight resistance for smoother movement
- **Density:** `0.001` - Standard density for balanced physics
- **Chamfer:** `radius: bannerHeight / 2` - Rounded corners matching capsule shape
- **Inertia:** `Infinity` - Prevents rotational slowdown, capsules spin freely

**Initial Velocities:**
- **Vertical:** `2 + (Math.random() * 0.5)` - Downward falling (2-2.5)
- **Horizontal:** `(Math.random() - 0.5) * 0.3` - Slight horizontal variation
- **Angular:** `(Math.random() - 0.5) * 0.15` - Subtle rotation for natural movement

**Starting Positions:**
- **Y position:** `-bannerHeight - 50` (just above viewport)
- **X position:** Evenly distributed across width with ±75px random variation
- **Initial angle:** Random between -17° to +17° for organic scatter

### Boundaries
- **Bottom wall:** At `window.innerHeight` - prevents capsules from falling through
- **Left/Right walls:** At viewport edges - keeps capsules in view
- **No top wall:** Allows capsules to fall from above

### Mouse Interaction

**Mouse Constraint Properties:**
- **Stiffness:** `0.1` - Lower stiffness for smoother dragging
- **Damping:** `0` - No damping for responsive interaction
- **Angular Stiffness:** `1` - Full rotational response when dragging

**Mouse Influence:**
- Repulsion force applied when mouse is near capsules
- Force decreases with distance (inverse square)
- Creates natural "pushing away" effect

### Visual Styling

**Capsule Design:**
- **Colors:** All capsules use coral/bright red (#FF6B6B)
- **Border:** 30px scalloped corner border using SVG border-image
- **Font:** CSS variable `--capsule-text-font`
- **Text:** 'Designer', 'Developer', 'Builder', 'Fixer', 'Thinker', 'Gardener', 'DIY-er'

**DOM Synchronization:**
- Matter.js handles physics calculations
- DOM elements are synced to physics bodies every frame using `afterUpdate` event
- Transform uses `translate3d()` for GPU acceleration
- Rotation applied using CSS `rotate()`

### Performance Optimizations

1. **GPU Acceleration:** Uses `translate3d()` and `will-change: transform`
2. **Pixel Ratio:** Renderer uses `devicePixelRatio` for retina displays
3. **Transparent Background:** Allows overlaying on page
4. **Invisible Physics Bodies:** Only DOM elements are visible, Matter.js bodies are hidden

### Stagger Timing

Capsules appear sequentially with 300ms delay between each for dramatic falling effect:
```javascript
setTimeout(() => {
    // Add to physics world
    Composite.add(engine.world, [bannerBody]);

    // Fade in the banner element
    gsap.to(bannerElement, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
    });
}, index * 300);
```

## Files Affected

- `opening-animation.js` - Main animation logic
- `capsule-styles.css` - Visual styling for capsules
- `index.html` - Physics container: `<div id="physics-container">`

## To Restore Physics Animation

1. Replace `opening-animation.js` with `opening-animation-physics-backup.js`
2. Ensure Matter.js is loaded: `<script src="https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.19.0/matter.min.js"></script>`
3. Physics container must be present in HTML
4. All capsule styles in `capsule-styles.css` should remain

## Code Location

**Main Function:** `initPhysics()` (line ~184-600 in backup file)

**Key Sections:**
- Engine creation: Lines 187-192
- Renderer setup: Lines 196-208
- Capsule creation: Lines 235-345
- Boundary walls: Lines 347-378
- Mouse interaction: Lines 420-510
- DOM sync: Lines 520-580

## Why It Was Changed

Original physics animation was replaced with a simpler sticker-slap effect where capsules appear with a quick scale/rotation animation instead of falling with gravity. The physics version is preserved here in case it's needed in the future.
