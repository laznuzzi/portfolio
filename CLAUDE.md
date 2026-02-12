# Claude Development Guidelines

## Table of Contents
- [Development Server](#development-server)
- [Problem-Solving Approach](#problem-solving-approach)
- [Code Organization Principles](#code-organization-principles)
- [Animation Libraries](#animation-libraries)
- [Design Token System](#design-token-system)
- [File Structure](#file-structure)
- [Project-Specific Notes](#project-specific-notes)

---

## Development Server

### Running with Hot Reload

**Always use live-server for development** - it provides automatic browser refresh when files change.

```bash
# Start server with hot reload (recommended)
live-server --port=8080 --no-browser

# Server will be available at: http://localhost:8080
# Any changes to HTML, CSS, or JS files will auto-reload the browser
```

**Alternative (no hot reload):**
```bash
# Python simple server (no auto-reload)
python3 -m http.server 8080
```

**Configuration:**
- Default port: 8080
- Files watched: All HTML, CSS, JS files in directory
- Live reload: Automatic browser refresh on file changes

**To stop the server:**
```bash
# Find and kill live-server
pkill -f "live-server"

# Or use Claude's TaskStop if running in background
```

---

## Problem-Solving Approach

### When Stuck - Suggest Multiple Approaches

If an approach has been attempted **2-3 times** without success, STOP and propose alternative solutions:

**Example: Layer Reveal Animation**
- ❌ Approach 1: Sticky positioning with z-index layering (tried 5+ times - failed)
- ✅ Approach 2: GSAP ScrollTrigger with fixed positioning (worked immediately)

### Alternative Approaches to Consider

When something isn't working, evaluate:

1. **Different CSS positioning strategies**
   - Sticky vs Fixed vs Absolute vs Relative
   - Different z-index hierarchies

2. **Animation libraries**
   - GSAP ScrollTrigger
   - CSS animations
   - Intersection Observer API

3. **DOM structure changes**
   - Wrapper elements
   - Different nesting hierarchies
   - Separate layers vs combined sections

4. **Hybrid approaches**
   - Combining CSS and JavaScript
   - Progressive enhancement

### Recognition Patterns

Signs you're stuck in a loop:
- User says "that doesn't work" 3+ times
- Same error/issue keeps appearing
- Making only small tweaks to the same approach
- User frustration is increasing

### Action When Stuck

1. **Acknowledge the pattern**: "I've been trying the sticky approach multiple times without success"
2. **Propose alternatives**: "Let me suggest 2-3 different ways we could achieve this"
3. **Explain trade-offs**: Briefly note pros/cons of each approach
4. **Ask for preference**: Let user choose the direction

---

## Code Organization Principles

### Keep It Clean and Modular

✅ **DO:**
- Separate concerns into dedicated files (animations, file content, UI logic)
- Use design tokens instead of hardcoded values
- Comment sections clearly with `==================== SECTION NAME ====================`
- Remove unused code immediately (don't leave commented out)
- Use semantic naming for functions and variables

❌ **DON'T:**
- Mix unrelated functionality in a single file
- Hardcode colors, font-sizes, or spacing values
- Leave dead code "just in case"
- Create abstractions until you need them (avoid premature optimization)
- Add features that weren't requested

### File Organization Pattern

Each JavaScript file should have a clear, single responsibility:

```
opening-animation.js  → Opening animation logic only
app.js               → Core app initialization and theme management
sections-nav.js      → Modal and navigation interactions
file-content.js      → Static content data
```

### When to Create New Files

Create a new file when:
1. A feature is completely independent (e.g., new animation sequence)
2. File exceeds ~500 lines and has logical separation points
3. Code is reusable across multiple features

Keep in existing file when:
1. Tightly coupled with existing functionality
2. Small addition (<100 lines)
3. Shares state with current code

---

## Animation Libraries

### GSAP (GreenSock Animation Platform)

**Version**: 3.12.5 (loaded via CDN)
**Plugin**: ScrollTrigger

#### When to Use GSAP

✅ **Use GSAP for:**
- Scroll-based animations (requires ScrollTrigger)
- Complex animation sequences with precise timing
- Physics-like easing that CSS can't achieve
- Animations that need to be dynamically controlled

❌ **Don't use GSAP for:**
- Simple hover effects (use CSS transitions)
- Basic fades/slides (use CSS animations)
- One-off simple animations (CSS is more performant)

#### GSAP Pattern in This Project

```javascript
// Always register plugins first
gsap.registerPlugin(ScrollTrigger);

// Basic animation
gsap.to(element, {
    property: value,
    duration: 0.5,
    ease: "power2.inOut"
});

// Scroll-triggered animation
gsap.to('.element', {
    y: '0%',
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: '#trigger-element',
        start: 'top top',      // When trigger hits top of viewport
        end: 'bottom top',     // When trigger bottom hits viewport top
        scrub: 1,              // Smooth scrubbing (1 second delay)
        markers: false         // Set to true for debugging
    }
});
```

#### ScrollTrigger Best Practices

1. **Always specify trigger element**
   ```javascript
   scrollTrigger: {
       trigger: '#specific-element',  // ✅ Explicit
       // trigger: 'body'              // ❌ Too vague
   }
   ```

2. **Use scrub for scroll-linked animations**
   ```javascript
   scrub: 1  // Smooth following with 1s delay
   scrub: true  // Instant following
   ```

3. **Debug with markers**
   ```javascript
   markers: true  // Shows trigger points visually
   ```

4. **Clean up on destroy**
   ```javascript
   // Store reference if you need to kill it
   const tl = gsap.to(...)
   // Later: tl.kill()
   ```

### Matter.js (Physics Engine)

**Version**: 0.19.0 (loaded via CDN)

#### When to Use Matter.js

✅ **Use Matter.js for:**
- Realistic physics interactions (gravity, collisions, forces)
- Draggable objects with realistic weight
- Complex particle systems
- Bouncing, rolling, or physics-based movement

❌ **Don't use Matter.js for:**
- Simple dragging (use CSS/vanilla JS)
- Linear animations (use GSAP or CSS)
- Scroll effects (use ScrollTrigger)

#### Matter.js Pattern in This Project

```javascript
// 1. Check if Matter.js loaded
if (typeof Matter === 'undefined') {
    console.error('Matter.js not loaded');
    return;
}

// 2. Create engine
const { Engine, Render, Bodies, Composite, Runner, MouseConstraint } = Matter;
const engine = Engine.create();
engine.gravity.y = 1;  // Set gravity

// 3. Create renderer
const render = Render.create({
    element: container,
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,          // ✅ Use actual colors
        background: 'transparent',   // ✅ Blend with page
        pixelRatio: window.devicePixelRatio  // ✅ Retina support
    }
});

// 4. Create bodies (objects)
const box = Bodies.rectangle(x, y, width, height, {
    chamfer: { radius: height / 2 },  // Rounded corners
    render: {
        fillStyle: '#color',
        strokeStyle: '#border',
        lineWidth: 3
    },
    restitution: 0.6,  // Bounciness (0-1)
    friction: 0.05,     // Surface friction
    frictionAir: 0.01,  // Air resistance
    density: 0.001      // Mass density
});

// 5. Create boundaries (walls)
const ground = Bodies.rectangle(x, y, width, height, {
    isStatic: true,  // ✅ Won't move
    render: { fillStyle: 'transparent' }
});

// 6. Add to world
Composite.add(engine.world, [box, ground]);

// 7. Add mouse interaction
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        stiffness: 1,     // How firmly mouse holds object
        damping: 0,       // Oscillation damping
        render: { visible: false }
    }
});
Composite.add(engine.world, mouseConstraint);

// 8. Run engine and renderer
const runner = Runner.create();
Runner.run(runner, engine);
Render.run(render);
```

#### Matter.js Best Practices

1. **Use chamfer for rounded shapes**
   ```javascript
   chamfer: { radius: height / 2 }  // Creates capsule shape
   ```

2. **Set appropriate physics properties**
   ```javascript
   restitution: 0.6,   // Bounciness (0 = no bounce, 1 = perfect bounce)
   friction: 0.05,      // Surface friction (lower = slippery)
   frictionAir: 0.01,   // Air resistance (lower = keeps moving)
   density: 0.001       // Mass (lower = lighter, easier to drag)
   ```

3. **Always set background transparent**
   ```javascript
   background: 'transparent'  // Blends with page
   ```

4. **Handle canvas text separately**
   - Matter.js doesn't render text
   - Use `Events.on(render, 'afterRender')` to draw text on canvas
   ```javascript
   Matter.Events.on(render, 'afterRender', () => {
       const context = render.context;
       // Draw text using canvas 2D context
   });
   ```

5. **Allow scroll passthrough**
   ```javascript
   render.canvas.addEventListener('wheel', (e) => {
       // Don't preventDefault - allow page scroll
   }, { passive: true });
   ```

### Animation Decision Tree

```
Need animation?
├─ Scroll-based?
│  └─ Yes → GSAP ScrollTrigger
│
├─ Physics/realistic movement?
│  └─ Yes → Matter.js
│
├─ Simple hover/transition?
│  └─ Yes → CSS transition
│
└─ Complex sequenced animation?
   └─ Yes → GSAP (without ScrollTrigger)
```

---

## Design Token System

### Always Use Design Tokens

See [DESIGN-TOKENS.md](./DESIGN-TOKENS.md) for comprehensive documentation.

#### Quick Reference

**Typography:**
```css
font-size: var(--font-size-base);      /* 14px */
font-size: var(--font-size-xl);        /* 20px */
font-size: var(--font-size-heading-xl); /* Responsive clamp */
```

**Spacing:**
```css
padding: var(--space-4);  /* 16px */
gap: var(--space-6);      /* 24px */
```

**Colors:**
```css
/* Theme-aware (switches with light/dark) */
color: var(--text-primary);
background: var(--bg-secondary);
border-color: var(--border-primary);

/* Fixed colors (don't change with theme) */
background: var(--color-traffic-red);
color: var(--color-accent-yellow);
```

#### When Adding New Styles

1. ✅ Check if token exists first
2. ✅ Use semantic tokens for theme-aware elements
3. ✅ Use specific tokens for fixed UI elements
4. ❌ Never hardcode pixel values
5. ❌ Never hardcode hex colors

---

## File Structure

```
📁 Project Root
├── 📄 index.html              # Main HTML structure
├── 📄 styles.css              # Main styles + design tokens
├── 📄 capsule-styles.css      # Capsule animation customization
│
├── 📄 opening-animation.js    # Opening sequence (typing + physics)
├── 📄 app.js                  # Core app (theme, initialization)
├── 📄 sections-nav.js         # Modal logic (drag, resize, interactions)
├── 📄 file-content.js         # Static content data
│
├── 📄 DESIGN-TOKENS.md        # Design system documentation
├── 📄 CLAUDE.md               # This file - dev guidelines
└── 📄 CLEANUP-PLAN.md         # Codebase cleanup documentation
```

### File Responsibilities

| File | Purpose | Contains |
|------|---------|----------|
| `opening-animation.js` | Opening animation only | GSAP animations, Matter.js physics, typing effect |
| `app.js` | Core app logic | Theme toggle, initialization, typewriter functions |
| `sections-nav.js` | UI interactions | Modal open/close, drag, resize, navigation |
| `file-content.js` | Content data | Static content for file modals |
| `styles.css` | All styles + tokens | Design tokens, component styles, layouts |
| `capsule-styles.css` | Capsule overrides | Physics capsule customization |

---

## Project-Specific Notes

### Scroll-Based Layer Reveal

**Requirements:**
- Capsules animation (yellow bg) → Files section slides over → More Projects slides over files
- Each layer should cover the previous one completely
- No gaps revealing earlier layers

**Working Solution:**
- Fixed positioning for all layers
- GSAP ScrollTrigger for smooth animations
- Z-index hierarchy: Capsules (2) < Files (3) < More Projects (4)
- ScrollTrigger animates `translateY` from 100% to 0%

**Code Location:** `opening-animation.js` lines 303-315

```javascript
gsap.to('.more-projects-layer', {
    y: '0%',
    ease: "power2.inOut",
    scrollTrigger: {
        trigger: '#main-content',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
        markers: false
    }
});
```

### Opening Animation Sequence

**Flow:**
1. Page loads with opening animation visible
2. Typing animation: "Howdy," appears character by character
3. Subtitle types: "I'm Nazarena"
4. Physics capsules fade in and start falling
5. User can interact with capsules (drag, influenced by mouse)
6. User scrolls → More Projects layer slides up
7. Main content (files section) is revealed underneath

**Customization Points:**
- Capsule colors: `opening-animation.js` line 116-121
- Capsule text: `opening-animation.js` line 124
- Physics properties: `opening-animation.js` lines 149-153
- Capsule styles: `capsule-styles.css`

### Modal System (macOS-style)

**Features:**
- Traffic light buttons (red/yellow/green)
- Draggable by titlebar
- Resizable from edges and corners
- Gallery view for image files
- Document view for PDF-style files
- Folder view (Finder-style) for directories

**Code Location:** `sections-nav.js`

**Key Implementation Details:**
- Drag: Track mouse movement relative to initial click position
- Resize: Detect edge/corner proximity and apply appropriate cursor
- Traffic lights: Red closes modal, yellow/green are decorative
- Multiple views: Toggle between gallery and document views

---

## Maintenance Guidelines

### Before Adding New Features

1. ✅ Check if similar functionality exists
2. ✅ Use existing design tokens
3. ✅ Follow established patterns (see existing code)
4. ✅ Keep files focused on single responsibility
5. ✅ Add comments for complex logic

### Before Removing Code

1. ✅ Search for all references (Grep tool)
2. ✅ Remove related CSS/JS/HTML together
3. ✅ Test affected functionality
4. ✅ Remove completely (don't comment out)

### Code Review Checklist

- [ ] Uses design tokens (no hardcoded values)
- [ ] Follows existing file structure
- [ ] Comments explain "why" not "what"
- [ ] No unused code left behind
- [ ] Animation choice is appropriate (GSAP vs CSS vs Matter.js)
- [ ] Semantic HTML and CSS naming
- [ ] Works in both light and dark themes

---

## Common Patterns

### Adding a New Animation

1. Decide: GSAP, Matter.js, or CSS? (see decision tree)
2. Add to appropriate file (`opening-animation.js` or new file)
3. Use design token timing: `var(--transition-normal)`
4. Test on both themes

### Adding New Content

1. Add data to `file-content.js`
2. Add thumbnail/images to `img/` folder
3. Format matches existing entries
4. Test modal opens and displays correctly

### Modifying Theme Colors

1. Update tokens in `styles.css` `:root` or `:root.dark`
2. Never modify individual component colors directly
3. Test both light and dark themes
4. Verify contrast and readability

---

## Resources

- **GSAP Docs**: https://greensock.com/docs/
- **ScrollTrigger Docs**: https://greensock.com/docs/v3/Plugins/ScrollTrigger
- **Matter.js Docs**: https://brm.io/matter-js/docs/
- **Design Tokens**: See [DESIGN-TOKENS.md](./DESIGN-TOKENS.md)
