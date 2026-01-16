# Implementation Plan: Design Token System & Codebase Cleanup

## Executive Summary

Clean up 9 hidden HTML sections (~400 lines), 37+ unused CSS classes, 5 unreachable JavaScript functions, and migrate 17 hardcoded font-sizes, 26+ hardcoded spacing values, and 15+ hardcoded colors to a standardized design token system.

**Estimated Time**: 6-8 hours across 5 phases
**Risk Level**: Low (with verification steps at each phase)

---

## PHASE 1: Hidden HTML Cleanup (1-1.5 hours)

### Remove Chat Section
**File**: `index.html` lines 128-183
- Delete `.chat-section` wrapper and all children
- Includes: chat area, desktop sidebar, mobile menu

### Remove Message Input Section
**File**: `index.html` lines 185-209
- Delete `#message-input-section` and form
- Includes: message input, horizontal prompts

### Remove Mobile Sidebar Sheet
**File**: `index.html` lines 214-232
- Delete `#mobile-sidebar-sheet` and overlay

### Clean Hidden Intro Elements
**File**: `index.html` lines 66-76
- Remove unused typewriter text (line 67)
- Remove hidden avatar/name-hover (lines 73-75)
- Remove hidden learn-more text (line 76)
- Keep visible `.intro-placeholder-text`

### Verification
- Page loads correctly with opening animation
- Files section and modals work
- No console errors about missing elements
- **Success**: HTML reduced by ~400 lines

---

## PHASE 2: JavaScript Function Cleanup (30-45 minutes)

### Remove Unreachable Functions
**File**: `app.js`
- `renderPrompts()` (lines 929-952)
- `clearChat()` (lines 961-965)
- `openMobileSheet()` (lines 968-976)
- `closeMobileSheet()` (lines 978-986)
- `updateCurrentTime()` (lines 139-143) - does nothing

### Remove Event Listeners
**File**: `app.js` lines 81-109
- Delete message form listener (lines 88-91)
- Delete clear chat button (lines 94-96)
- Delete mobile menu button (lines 99-101)
- Delete mobile sheet close/overlay (lines 103-109)

### Clean File Content
**File**: `file-content.js` lines 105-135
- Delete commented example code block

### Verification
- Page loads without console errors
- Theme toggle still works
- File modals open/close correctly
- Opening animation plays

---

## PHASE 3: CSS Cleanup - Unused Classes (1-1.5 hours)

### Remove Chat Styles
**File**: `styles.css`
- `.chat-section`, `.chat-area`, `.chat-container`
- `.chat-header`, `.chat-status`, `.status-indicator`
- `.messages-container`, `.messages-list`
- `.clear-chat-button`

### Remove Message Input Styles
- `.message-input-section`, `.message-input-wrapper`
- `.message-input-field`, `.message-form`
- `.message-send-button`

### Remove Sidebar Styles
- `.desktop-sidebar`, `.sidebar-content`
- `.mobile-sidebar-sheet`, `.mobile-sheet-*`
- `.horizontal-prompts-section`

### Remove Additional Unused Styles
- `.additional-content-text`
- `.slider-thumbnail`, `.slider-thumbnails`
- `.tab-button` (if not used by modals)

### Verification
- Page renders correctly
- No visual regressions
- Modals still styled properly
- **Success**: CSS reduced by ~800-1000 lines

---

## PHASE 4: Design Token System - Typography (2-2.5 hours)

### Extend Typography Tokens
**File**: `styles.css` :root section

Add new tokens:
```css
/* Base sizes */
--font-size-2xs: 0.6875rem;    /* 11px */
--font-size-xs: 0.75rem;        /* 12px */
--font-size-sm: 0.8125rem;      /* 13px */
--font-size-base: 0.875rem;     /* 14px */
--font-size-md: 0.9375rem;      /* 15px */
--font-size-lg: 1rem;           /* 16px */
--font-size-xl: 1.25rem;        /* 20px */
--font-size-2xl: 1.5rem;        /* 24px */
--font-size-3xl: 2rem;          /* 32px */
--font-size-4xl: 2.5rem;        /* 40px */

/* Responsive headings */
--font-size-heading-sm: clamp(1.25rem, 2vw, 1.5rem);
--font-size-heading-md: clamp(1.5rem, 3vw, 2rem);
--font-size-heading-lg: clamp(2rem, 4vw, 2.5rem);
--font-size-heading-xl: clamp(2.5rem, 5vw, 4.5rem);
```

### Replace Hardcoded Font Sizes
**File**: `styles.css`

Key replacements:
- Line 2022: `14px` → `var(--font-size-base)`
- Line 2362: `13px` → `var(--font-size-sm)`
- Line 2593: `12px` → `var(--font-size-xs)`
- Line 2942: `24px` → `var(--font-size-2xl)`
- Line 3033: `40px` → `var(--font-size-4xl)`
- Line 3057: `20px` → `var(--font-size-xl)`
- Line 3069: `15px` → `var(--font-size-md)`
- (10+ more instances documented in exploration)

### Verification
- Text scales properly on resize
- Modal text sizes identical to before
- Document viewer hierarchy maintained
- **Success**: No px font-sizes remain (except in clamp())

---

## PHASE 5: Design Token System - Colors (2-2.5 hours)

### Extend Color Token System
**File**: `styles.css` :root section

Add semantic color tokens:
```css
/* Extended semantic colors */
--color-accent-yellow: #f59e0b;
--color-accent-yellow-light: #fef3c7;
--color-surface-light: #efede8;
--color-surface-dark: #231f28;
--color-surface-modal: #2c2c2c;
--color-text-muted: #666;
--color-text-subdued: #888;
--color-traffic-red: #ff5f57;
--color-traffic-yellow: #ffbd2e;
--color-traffic-green: #28c840;
--color-interactive-hover: #4a4a4a;
--bg-body-gradient: linear-gradient(135deg, #c8e6f5 0%, #e3d5f2 100%);
--bg-intro-solid: #fff3c8;
```

### Replace Hardcoded Colors
**File**: `styles.css`

Key replacements:
- Line 139: gradient → `var(--bg-body-gradient)`
- Line 334: `#231f28` → `var(--color-surface-dark)`
- Line 408: `#f59e0b` → `var(--color-accent-yellow)`
- Line 532: `#efede8` → `var(--color-surface-light)`
- Line 1946: `#fff3c8` → `var(--bg-intro-solid)`
- Line 2021: `#666` → `var(--color-text-muted)`
- Line 2383: `#2c2c2c` → `var(--color-surface-modal)`
- Line 2417-2430: Traffic light colors → `var(--color-traffic-*)`
- (15+ more instances documented in exploration)

### Update Capsule Styles
**File**: `capsule-styles.css`

Change to semantic references:
```css
--capsule-fill-color: var(--color-white);
--capsule-stroke-color: var(--text-primary);
--capsule-text-color: var(--text-primary);
```

### Verification
- Light theme renders correctly
- Dark theme toggle works smoothly
- Modal traffic lights correct colors
- Interactive states function
- Capsules render properly
- **Success**: No hardcoded hex colors remain

---

## PHASE 6: Documentation (30-45 minutes)

### Create Design Token Documentation
**File**: `DESIGN-TOKENS.md` (new)

Document all tokens with:
- Typography scale with usage examples
- Spacing scale
- Complete color system (base + semantic)
- Border radius, shadows, transitions
- Z-index layers
- Usage guidelines
- Maintenance notes

### Update README
**File**: `README.md`

Add section linking to token documentation and key files.

### Final Validation Checklist
- [ ] Opening animation works
- [ ] Files section renders
- [ ] Modals open/display content
- [ ] Theme toggle switches
- [ ] No console errors
- [ ] Both themes readable
- [ ] No hardcoded px font-sizes (verify with grep)
- [ ] No hardcoded hex colors in code (verify with grep)
- [ ] No references to deleted elements (verify with grep)

---

## Critical Files

1. **`index.html`** - Remove 9 hidden sections (~400 lines)
2. **`styles.css`** - Remove ~1000 lines unused CSS, migrate to tokens
3. **`app.js`** - Remove 5 unreachable functions
4. **`capsule-styles.css`** - Update to use semantic tokens
5. **`DESIGN-TOKENS.md`** - New documentation file

---

## Implementation Order

**Recommended sequence:**
1. Phase 1: HTML Cleanup (lowest risk)
2. Phase 2: JavaScript Cleanup
3. Phase 3: CSS Cleanup
4. Phase 4: Typography Tokens
5. Phase 5: Color Tokens
6. Phase 6: Documentation

**Git strategy**: Commit after each phase for easy rollback

---

## Expected Benefits

✅ ~1,200 lines of code removed
✅ Consistent design system
✅ Easy theme customization
✅ Better maintainability
✅ Comprehensive documentation
✅ ~15% smaller CSS bundle
