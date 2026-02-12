# Design Token System

A comprehensive, systematic design token system for consistent styling across the portfolio.

---

## Table of Contents

1. [Typography](#typography)
2. [Spacing & Layout](#spacing--layout)
3. [Grid & Columns](#grid--columns)
4. [Colors](#colors)
5. [Effects](#effects)
6. [Usage Guidelines](#usage-guidelines)

---

## Typography

### Font Sizes

#### Base Scale (Fixed)
Use for body text and UI elements that should maintain consistent sizing.

```css
--text-2xs: 0.625rem;   /* 10px - smallest text */
--text-xs: 0.75rem;     /* 12px - captions, labels */
--text-sm: 0.875rem;    /* 14px - small body text */
--text-base: 1rem;      /* 16px - body text */
--text-lg: 1.125rem;    /* 18px - emphasized body */
--text-xl: 1.25rem;     /* 20px - small headings */
```

#### Responsive Scale (Headings)
Use for headings that should scale with viewport size using `clamp()`.

```css
--text-2xl: clamp(1.5rem, 4vw, 1.75rem);     /* 24-28px - h4 */
--text-3xl: clamp(1.875rem, 5vw, 2.25rem);   /* 30-36px - h3 */
--text-4xl: clamp(2.25rem, 6vw, 3rem);       /* 36-48px - h2 */
--text-5xl: clamp(3rem, 8vw, 4rem);          /* 48-64px - h1 */
--text-6xl: clamp(3.75rem, 10vw, 5rem);      /* 60-80px - display */
```

#### Semantic Typography
Use these for consistent type hierarchy across components.

```css
--type-display: var(--text-6xl);      /* Hero headings */
--type-h1: var(--text-5xl);           /* Page titles */
--type-h2: var(--text-4xl);           /* Section titles */
--type-h3: var(--text-3xl);           /* Subsection titles */
--type-h4: var(--text-2xl);           /* Card titles */
--type-body: var(--text-base);        /* Body text */
--type-body-sm: var(--text-sm);       /* Small body */
--type-caption: var(--text-xs);       /* Captions, labels */
--type-label: var(--text-2xs);        /* Tiny labels */
```

**Example:**
```css
h1 { font-size: var(--type-h1); }
p { font-size: var(--type-body); }
.card-title { font-size: var(--type-h4); }
```

### Font Weights

```css
--font-weight-light: 300;
--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-black: 900;
```

### Line Heights

```css
--line-height-none: 1;          /* Tight, for headings */
--line-height-tight: 1.25;      /* Headings */
--line-height-snug: 1.375;      /* Emphasized text */
--line-height-normal: 1.5;      /* Body text (default) */
--line-height-relaxed: 1.625;   /* Comfortable reading */
--line-height-loose: 2;         /* Very spacious */
```

### Letter Spacing

```css
--tracking-tighter: -0.05em;    /* Very tight */
--tracking-tight: -0.025em;     /* Tight, for large headings */
--tracking-normal: 0;           /* Default */
--tracking-wide: 0.025em;       /* Slightly spaced */
--tracking-wider: 0.05em;       /* Spaced */
--tracking-widest: 0.1em;       /* Very spaced, all caps */
```

### Font Families

```css
--font-body: 'NB International Pro', 'Chalet', sans-serif;
--font-heading: var(--font-body);
--font-mono: 'Source Code Pro', monospace;
```

---

## Spacing & Layout

### Base Spacing Scale
Use for margins, padding, and gaps. Based on 4px increments.

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Semantic Gaps
Use for consistent spacing in flexbox and grid layouts.

```css
--gap-xs: var(--space-1);   /* 4px - tight spacing (tags, chips) */
--gap-sm: var(--space-2);   /* 8px - small spacing (inline elements) */
--gap-md: var(--space-4);   /* 16px - default spacing (cards, buttons) */
--gap-lg: var(--space-6);   /* 24px - large spacing (sections) */
--gap-xl: var(--space-8);   /* 32px - extra large (major sections) */
```

**Example:**
```css
.card-grid {
  display: grid;
  gap: var(--gap-lg);  /* Consistent 24px gap */
}

.tag-group {
  display: flex;
  gap: var(--gap-xs);  /* Tight 4px gap */
}
```

### Semantic Margins
Use for consistent vertical rhythm between components.

```css
--margin-section: var(--space-20);    /* 80px - between major sections */
--margin-component: var(--space-8);   /* 32px - between components */
--margin-element: var(--space-4);     /* 16px - between related elements */
```

**Example:**
```css
section + section {
  margin-top: var(--margin-section);
}

.component + .component {
  margin-top: var(--margin-component);
}
```

### Container Widths

```css
--container-sm: 800px;
--container-md: 1000px;
--container-lg: 1200px;
--container-xl: 1400px;
--container-2xl: 1600px;
```

---

## Grid & Columns

### Column Counts

```css
--columns-1: 1;
--columns-2: 2;
--columns-3: 3;
--columns-4: 4;
--columns-6: 6;
--columns-12: 12;
```

### Grid Templates
Reusable column patterns for common layouts.

```css
--grid-1-col: 1fr;
--grid-2-col: repeat(2, 1fr);
--grid-3-col: repeat(3, 1fr);
--grid-4-col: repeat(4, 1fr);
--grid-sidebar: 240px 1fr;                      /* Sidebar + main */
--grid-sidebar-content: 0.9fr 1.5fr 1fr;        /* 3-column with emphasis on middle */
--grid-auto-fit: repeat(auto-fit, minmax(280px, 1fr));   /* Responsive auto-fitting */
--grid-auto-fill: repeat(auto-fill, minmax(280px, 1fr)); /* Responsive auto-filling */
```

**Example:**
```css
.three-column-layout {
  display: grid;
  grid-template-columns: var(--grid-3-col);
  gap: var(--gap-lg);
}

.sidebar-layout {
  display: grid;
  grid-template-columns: var(--grid-sidebar);
  gap: var(--gap-xl);
}

.responsive-cards {
  display: grid;
  grid-template-columns: var(--grid-auto-fit);
  gap: var(--gap-md);
}
```

### Column Widths

```css
--col-xs: 280px;
--col-sm: 320px;
--col-md: 480px;
--col-lg: 640px;
--col-xl: 800px;
```

---

## Colors

### Color Architecture

Our color system has two tiers:
1. **Base/Primitive colors** - Raw color values
2. **Semantic colors** - Context-aware colors that reference base colors

### Base Colors

```css
/* Grays */
--color-gray-100: #faf9f5;
--color-gray-200: #e5e7eb;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-white: #ffffff;

/* Project-specific colors */
--color-beige-light: #f2f0e9;     /* Card backgrounds */
--color-beige-dark: #e4e0d4;      /* Media borders */
--color-beige-footer: #dbd7cc;    /* Footer and tags */
--color-accent-red: #ff6b6b;      /* Avatar border */
--color-accent-orange: #FF6B35;   /* CTA hover */
--color-dark: #141413;            /* Frame border */
--color-error: #ff0000;           /* Error messages */
```

### Semantic Colors (Theme-Aware)
**Always use semantic colors** for components to ensure proper theme support.

```css
/* Backgrounds */
--bg-primary: #f2f0e9;
--bg-secondary: var(--color-white);
--surface-modal: #efede8;         /* Modal backgrounds */

/* Text */
--text-primary: #111827;
--text-secondary: var(--color-gray-600);
--text-tertiary: #b9b1a2;         /* Very muted text */

/* Borders */
--border: var(--color-gray-200);

/* Accents */
--accent-decorative: #818242;     /* Decorative elements */
```

**Example:**
```css
/* ✅ GOOD - uses semantic tokens */
.card {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: var(--border-normal) solid var(--border);
}

/* ❌ BAD - uses base colors directly */
.card {
  background: var(--color-white);
  color: #111827;
  border: 2px solid var(--color-gray-200);
}
```

---

## Effects

### Border Radius

```css
--radius-sm: 4px;     /* Tags, small buttons */
--radius-md: 8px;     /* Cards, images */
--radius-lg: 12px;    /* Modals, large surfaces */
--radius-full: 50%;   /* Avatars, circles */
```

### Border Widths

```css
--border-normal: 2px;
--border-thick: 4px;
--border-frame: 14px;
```

### Shadows

```css
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
```

### Transitions

```css
--transition-fast: 0.15s ease-in-out;
--transition: 0.3s ease-in-out;
```

### Icon Sizes

```css
--icon-xs: 14px;
--icon-sm: 18px;
--icon-md: 24px;
--icon-lg: 28px;
```

---

## Usage Guidelines

### 1. Always Use Tokens, Never Hardcode

❌ **Bad:**
```css
.element {
  font-size: 18px;
  padding: 16px 24px;
  margin-bottom: 32px;
  color: #111827;
}
```

✅ **Good:**
```css
.element {
  font-size: var(--text-lg);
  padding: var(--space-4) var(--space-6);
  margin-bottom: var(--margin-component);
  color: var(--text-primary);
}
```

### 2. Use Semantic Tokens Over Base Tokens

Prefer semantic tokens (like `--type-h1`, `--gap-md`, `--text-primary`) over base tokens (like `--text-5xl`, `--space-4`, `--color-gray-600`) for better maintainability and theme support.

❌ **Less maintainable:**
```css
h1 {
  font-size: var(--text-5xl);
  color: #111827;
  margin-bottom: var(--space-8);
}
```

✅ **More maintainable:**
```css
h1 {
  font-size: var(--type-h1);
  color: var(--text-primary);
  margin-bottom: var(--margin-component);
}
```

### 3. Grid & Layout Patterns

Use grid template tokens for consistent layouts:

```css
/* Three-column content area */
.modal-content {
  display: grid;
  grid-template-columns: var(--grid-3-col);
  gap: var(--gap-lg);
}

/* Sidebar layout */
.app-layout {
  display: grid;
  grid-template-columns: var(--grid-sidebar);
  gap: var(--gap-xl);
}

/* Responsive card grid */
.card-grid {
  display: grid;
  grid-template-columns: var(--grid-auto-fit);
  gap: var(--gap-md);
}
```

### 4. Typography Hierarchy

Establish clear hierarchy using semantic type tokens:

```css
.hero-title { font-size: var(--type-display); }
.page-title { font-size: var(--type-h1); }
.section-title { font-size: var(--type-h2); }
.card-title { font-size: var(--type-h4); }
.body-text { font-size: var(--type-body); }
.caption { font-size: var(--type-caption); }
```

### 5. Vertical Rhythm

Use semantic margin tokens for consistent vertical spacing:

```css
/* Major sections */
section + section {
  margin-top: var(--margin-section);
}

/* Components within sections */
.component + .component {
  margin-top: var(--margin-component);
}

/* Related elements */
h2 + p {
  margin-top: var(--margin-element);
}
```

### 6. Responsive Spacing

For responsive spacing, combine tokens with media queries:

```css
.container {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-8);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--space-12);
  }
}
```

---

## Adding New Tokens

When adding new tokens:

1. **Check if an existing token works** - Don't create duplicates
2. **Follow the naming convention** - `--category-variant-state`
3. **Add to the appropriate section** in `:root`
4. **Document it here** with usage examples
5. **Consider semantic vs base** - Create semantic tokens for reusable patterns

### Naming Convention

```css
/* Base tokens */
--[category]-[size/variant]: value;
--space-4: 1rem;
--text-lg: 1.125rem;

/* Semantic tokens */
--[purpose]-[variant]: var(--base-token);
--type-h1: var(--text-5xl);
--gap-md: var(--space-4);
```

---

## Migration Checklist

When refactoring existing code to use tokens:

- [ ] Replace hardcoded font sizes with `--text-*` or `--type-*`
- [ ] Replace hardcoded spacing with `--space-*`, `--gap-*`, or `--margin-*`
- [ ] Replace hardcoded colors with semantic color tokens
- [ ] Replace grid-template-columns with `--grid-*` tokens
- [ ] Replace hardcoded border-radius with `--radius-*`
- [ ] Replace hardcoded transitions with `--transition-*`
- [ ] Update margin/padding to use semantic tokens where appropriate

---

## Resources

- **Edit tokens:** `/styles.css` (`:root` section)
- **Guidelines:** `/CLAUDE.md` (Design Token System section)
- **Report issues:** If a token is missing or a pattern isn't covered, document it here
