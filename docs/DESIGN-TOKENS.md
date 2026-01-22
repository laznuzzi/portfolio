# Design Token System

This project uses a comprehensive CSS custom property (CSS variables) system for consistent styling across the entire application.

## Table of Contents
- [Typography](#typography)
- [Spacing](#spacing)
- [Colors](#colors)
- [Border Radius](#border-radius)
- [Shadows](#shadows)
- [Transitions](#transitions)
- [Z-Index Layers](#z-index-layers)
- [Usage Guidelines](#usage-guidelines)
- [Maintenance](#maintenance)

---

## Typography

### Font Sizes - Base Scale

All font sizes use rem units for accessibility and scalability.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--font-size-2xs` | 0.6875rem | 11px | Tiny labels, metadata |
| `--font-size-xs` | 0.75rem | 12px | Small labels, captions |
| `--font-size-sm` | 0.8125rem | 13px | Secondary text, form labels |
| `--font-size-base` | 0.875rem | 14px | Body text, buttons |
| `--font-size-md` | 0.9375rem | 15px | Emphasized body text |
| `--font-size-lg` | 1rem | 16px | Large body text, small headings |
| `--font-size-xl` | 1.25rem | 20px | Section headings |
| `--font-size-2xl` | 1.5rem | 24px | Page headings |
| `--font-size-3xl` | 2rem | 32px | Large display text |
| `--font-size-4xl` | 2.5rem | 40px | Hero text |

### Font Sizes - Responsive Headings

Responsive headings use `clamp()` for fluid typography that scales with viewport width.

| Token | Min Size | Ideal | Max Size | Usage |
|-------|----------|-------|----------|-------|
| `--font-size-heading-sm` | 1.25rem (20px) | 2vw | 1.5rem (24px) | Small responsive headings |
| `--font-size-heading-md` | 1.5rem (24px) | 3vw | 2rem (32px) | Medium responsive headings |
| `--font-size-heading-lg` | 2rem (32px) | 4vw | 2.5rem (40px) | Large responsive headings |
| `--font-size-heading-xl` | 2.5rem (40px) | 5vw | 4.5rem (72px) | Extra large hero text |

### Font Weights

| Token | Value | Usage |
|-------|-------|-------|
| `--font-weight-normal` | 400 | Body text |
| `--font-weight-medium` | 500 | Emphasized text |
| `--font-weight-semibold` | 600 | Headings, important text |

### Line Heights

| Token | Value | Usage |
|-------|-------|-------|
| `--line-height-tight` | 1.25 | Headings |
| `--line-height-normal` | 1.5 | Body text, paragraphs |

### Usage Examples

```css
/* Small caption text */
.caption {
  font-size: var(--font-size-xs);
  line-height: var(--line-height-normal);
}

/* Section heading */
.section-title {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
}

/* Responsive hero text */
.hero-title {
  font-size: var(--font-size-heading-xl);
  font-weight: var(--font-weight-semibold);
}
```

---

## Spacing

Consistent spacing scale using rem units. Based on 4px (0.25rem) increments.

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `--space-1` | 0.25rem | 4px | Tiny gaps, icon spacing |
| `--space-2` | 0.5rem | 8px | Small padding, compact elements |
| `--space-3` | 0.75rem | 12px | Default button padding |
| `--space-4` | 1rem | 16px | Standard spacing, default gap |
| `--space-6` | 1.5rem | 24px | Section padding, card spacing |
| `--space-8` | 2rem | 32px | Large section spacing |
| `--space-12` | 3rem | 48px | Extra large spacing, page sections |

### Usage Examples

```css
/* Card component */
.card {
  padding: var(--space-6);
  margin-bottom: var(--space-4);
}

/* Button */
.button {
  padding: var(--space-3) var(--space-4);
}
```

---

## Colors

### Base Color Palette

Foundation colors used throughout the application.

#### Primary Colors
```css
--color-primary-50: #eff6ff;   /* Lightest blue */
--color-primary-500: #3b82f6;  /* Primary blue */
--color-primary-600: #2563eb;  /* Darker blue */
--color-primary-700: #1d4ed8;  /* Darkest blue */
```

#### Grayscale
```css
--color-gray-50: #f9fafb;      /* Lightest gray */
--color-gray-100: #faf9f5;     /* Off-white */
--color-gray-200: #e5e7eb;     /* Light gray */
--color-gray-300: #d1d5db;     /* Medium-light gray */
--color-gray-400: #9ca3af;     /* Medium gray */
--color-gray-500: #6b7280;     /* Neutral gray */
--color-gray-600: #4b5563;     /* Medium-dark gray */
--color-gray-700: #374151;     /* Dark gray */
--color-gray-800: #1f2937;     /* Darker gray */
--color-gray-900: #111827;     /* Darkest gray */
```

#### Utility Colors
```css
--color-green-500: #10b981;    /* Success green */
--color-white: #ffffff;         /* Pure white */
--color-black: #000000;         /* Pure black */
```

### Semantic Colors

Extended semantic colors for specific use cases.

```css
/* Accent Colors */
--color-accent-yellow: #f59e0b;        /* Warning/highlight yellow */
--color-accent-yellow-light: #fef3c7;  /* Light yellow background */

/* Surface Colors */
--color-surface-light: #efede8;        /* Light beige surface */
--color-surface-dark: #231f28;         /* Dark purple surface */
--color-surface-modal: #2c2c2c;        /* Modal background */

/* Text Colors */
--color-text-muted: #666;              /* Muted text */
--color-text-subdued: #888;            /* Subdued secondary text */

/* Traffic Light Colors (macOS-style) */
--color-traffic-red: #ff5f57;          /* Close button */
--color-traffic-yellow: #ffbd2e;       /* Minimize button */
--color-traffic-green: #28c840;        /* Maximize button */

/* Interactive */
--color-interactive-hover: #4a4a4a;    /* Hover state for dark elements */

/* Gradients */
--bg-body-gradient: linear-gradient(135deg, #c8e6f5 0%, #e3d5f2 100%);
--bg-intro-solid: #fff3c8;             /* Intro section background */
```

### Theme-Aware Semantic Colors

These colors automatically adapt to light/dark theme.

#### Light Theme (default)
```css
--bg-primary: #f2f0e9;               /* Primary background */
--bg-secondary: var(--color-white);  /* Secondary background */
--bg-tertiary: var(--color-gray-50); /* Tertiary background */
--text-primary: var(--color-gray-900);   /* Primary text */
--text-secondary: var(--color-gray-600); /* Secondary text */
--text-tertiary: var(--color-gray-500);  /* Tertiary text */
--border-primary: var(--color-gray-200);   /* Primary borders */
--border-secondary: var(--color-gray-300); /* Secondary borders */
```

#### Dark Theme
```css
:root.dark {
  --bg-primary: #120d19;
  --bg-secondary: var(--color-gray-800);
  --bg-tertiary: var(--color-gray-700);
  --text-primary: var(--color-gray-100);
  --text-secondary: var(--color-gray-400);
  --text-tertiary: var(--color-gray-500);
  --border-primary: var(--color-gray-700);
  --border-secondary: var(--color-gray-600);
}
```

### Usage Examples

```css
/* Use semantic colors for theme-aware components */
.card {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-primary);
}

/* Use specific colors for fixed elements */
.traffic-light-red {
  background-color: var(--color-traffic-red);
}
```

---

## Border Radius

Consistent border radius scale for rounded corners.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem (4px) | Small elements, tags |
| `--radius-md` | 0.5rem (8px) | Buttons, inputs |
| `--radius-lg` | 0.75rem (12px) | Cards, containers |
| `--radius-xl` | 1rem (16px) | Large cards, modals |
| `--radius-full` | 9999px | Pills, fully rounded elements |

---

## Shadows

Elevation shadows for depth and hierarchy.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px 0 rgba(0, 0, 0, 0.05)` | Subtle elevation |
| `--shadow-md` | `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` | Cards, dropdowns |
| `--shadow-lg` | `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` | Modals, popovers |

---

## Transitions

Consistent animation timing for smooth interactions.

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | 0.15s ease-in-out | Hover states, small interactions |
| `--transition-normal` | 0.3s ease-in-out | General transitions, slides |
| `--transition-slow` | 0.5s ease-in-out | Large animations, page transitions |

### Usage Example

```css
.button {
  transition: all var(--transition-fast);
}

.modal {
  transition: opacity var(--transition-normal);
}
```

---

## Z-Index Layers

Stacking context management to prevent z-index conflicts.

| Token | Value | Usage |
|-------|-------|-------|
| `--z-dropdown` | 10 | Dropdown menus |
| `--z-sticky` | 20 | Sticky elements |
| `--z-fixed` | 30 | Fixed position elements |
| `--z-modal` | 50 | Modals, overlays |

Always use these tokens instead of arbitrary z-index values.

```css
.modal {
  z-index: var(--z-modal);
}
```

---

## Usage Guidelines

### 1. Always Use Tokens

**✅ Good:**
```css
.element {
  font-size: var(--font-size-base);
  color: var(--text-primary);
  padding: var(--space-4);
}
```

**❌ Bad:**
```css
.element {
  font-size: 14px;
  color: #333333;
  padding: 16px;
}
```

### 2. Choose Semantic Over Base Colors

When building theme-aware components, prefer semantic colors (`--bg-primary`, `--text-primary`) over base colors (`--color-gray-900`).

**✅ Good:**
```css
.card {
  background: var(--bg-secondary);
  color: var(--text-primary);
}
```

**❌ Avoid:**
```css
.card {
  background: var(--color-white);
  color: var(--color-gray-900);
}
```

### 3. Use Responsive Typography

For headings and hero text that should scale with viewport, use responsive tokens:

```css
.hero-title {
  font-size: var(--font-size-heading-xl);
}
```

### 4. Maintain Spacing Consistency

Always use the spacing scale. If you need a custom value, consider adding it to the scale first.

---

## Maintenance

### Adding New Tokens

1. **Add to `:root`** in `styles.css`
2. **Document** the new token in this file
3. **Update examples** if necessary

### Modifying Existing Tokens

1. **Check usage** before modifying token values
2. **Test both themes** (light and dark) after changes
3. **Update documentation** to reflect changes

### Theme Customization

To customize themes, modify the values in `:root` and `:root.dark` blocks in `styles.css`. All components using semantic tokens will automatically adapt.

### Capsule Customization

Opening animation capsules can be customized independently in `capsule-styles.css`. They now reference main theme tokens but can be overridden with specific colors.

---

## File Structure

```
├── styles.css              # Main stylesheet with design tokens
├── capsule-styles.css      # Capsule-specific token overrides
└── DESIGN-TOKENS.md        # This documentation file
```

---

## Benefits

✅ **Consistency** - Unified design language across the application
✅ **Maintainability** - Change tokens once, update everywhere
✅ **Theme Support** - Easy light/dark mode switching
✅ **Scalability** - Add new components with existing tokens
✅ **Accessibility** - Rem-based sizing respects user preferences
✅ **Developer Experience** - Clear naming and organization
