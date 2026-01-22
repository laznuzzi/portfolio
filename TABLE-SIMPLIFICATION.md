# Table Styling Simplification

## Summary of Changes

### Class Name Changes (Old → New)

**Section/Container:**
- `.vintage-table-section` → `.archives-section`
- `.vintage-table-container` → `.table-container`
- `.vintage-table` → `.archive-table`

**Rows:**
- `.vintage-table-row` → `.table-row`

**Columns:**
- `.col-title` → `.title`
- `.col-description` → `.description`
- `.vintage-table-thumbnail` → `.thumbnail`

**Hover/Effects:**
- `.vintage-table-hover-image` → `.hover-preview`

**Filters:**
- `.vintage-table-filters` → `.table-filters`
- `.vintage-filter-btn` → `.filter-btn`

## Why These Changes?

1. **Shorter names** - Easier to type and remember
2. **More semantic** - Names reflect purpose, not style
3. **Consistent** - No mixing of `.col-*` with `.vintage-table-*`
4. **Future-proof** - Not tied to "vintage" aesthetic

## Key Improvements

### 1. Truly Responsive
- **Desktop**: Traditional 3-column table
- **Mobile (< 768px)**: Stacks into cards with thumbnail on top
- **No horizontal scroll** needed on small screens

### 2. Simplified Structure
```css
/* OLD: Repeated selectors */
.vintage-table .col-title { }
.vintage-table-row .vintage-table-thumbnail { }
.vintage-table-row:hover .vintage-table-thumbnail img { }

/* NEW: Clean, simple */
.title { }
.thumbnail { }
.table-row:hover .thumbnail img { }
```

### 3. Easier to Edit Thumbnail Column
```css
/* Just target .thumbnail - that's it! */
.thumbnail {
  height: 180px;  /* Change this */
  background-color: var(--color-black);
}

.thumbnail img {
  border: 2px solid #000000;  /* Change this */
}
```

## What Needs to be Updated

### 1. HTML (index.html)
```html
<!-- OLD -->
<section class="vintage-table-section">
  <div class="vintage-table-container">
    <table class="vintage-table">
      <tr class="vintage-table-row">
        <td class="col-title">...</td>
        <td class="col-description">...</td>
        <td class="vintage-table-thumbnail">...</td>
      </tr>
    </table>
  </div>
</section>

<!-- NEW -->
<section class="archives-section">
  <div class="table-container">
    <table class="archive-table">
      <tr class="table-row">
        <td class="title">...</td>
        <td class="description">...</td>
        <td class="thumbnail">...</td>
      </tr>
    </table>
  </div>
</section>
```

### 2. JavaScript (markdown-loader.js)
```javascript
// OLD
tr.className = 'vintage-table-row';
td.className = 'vintage-table-thumbnail';
hoverImageContainer.className = 'vintage-table-hover-image';

// NEW
tr.className = 'table-row';
td.className = 'thumbnail';
hoverImageContainer.className = 'hover-preview';
```

### 3. JavaScript (sections-nav.js)
```javascript
// OLD
const vintageTableRows = document.querySelectorAll('.vintage-table-row');
const hoverImage = row.querySelector('.vintage-table-hover-image');

// NEW
const tableRows = document.querySelectorAll('.table-row');
const hoverImage = row.querySelector('.hover-preview');
```

### 4. JavaScript (opening-animation.js)
```javascript
// OLD
const archivesSection = document.querySelector('.vintage-table-section');

// NEW
const archivesSection = document.querySelector('.archives-section');
```

### 5. CSS (styles.css)
Replace the entire "VINTAGE TABLE SECTION" block with the new simplified version from `table-styles-simplified.css`.

## Backward Compatibility

The new CSS file includes temporary legacy class support at the bottom. This means:
- Old class names will still work while you update HTML/JS
- You can update files one at a time
- Once everything is updated, remove the legacy section

## Migration Steps

1. **Stop the dev server** (to prevent file conflicts)
2. **Replace CSS** - Copy table styles from `table-styles-simplified.css` into `styles.css`
3. **Update index.html** - Change class names in the HTML structure
4. **Update markdown-loader.js** - Change class names in table generation
5. **Update sections-nav.js** - Change selectors for hover effects
6. **Update opening-animation.js** - Change section selector
7. **Test thoroughly** - Check desktop, tablet, and mobile views
8. **Remove legacy classes** from CSS once everything works

## Quick Edit Guide - Thumbnail Column

After migration, editing the thumbnail is simple:

```css
/* Change thumbnail size */
.thumbnail {
  height: 200px;  /* Adjust as needed */
}

/* Change thumbnail image styling */
.thumbnail img,
.thumbnail video {
  border: 3px solid #FF6B35;  /* Thicker red border */
  object-fit: cover;  /* Or 'contain' */
}

/* Change background color */
.thumbnail {
  background-color: var(--color-traffic-red) !important;
}

/* Mobile thumbnail size */
@media (max-width: 768px) {
  .thumbnail {
    height: 250px;  /* Bigger on mobile */
  }
}
```

## Mobile Card Layout Preview

On mobile (< 768px), each row becomes a card:

```
┌─────────────────────────┐
│                         │
│   [Thumbnail Image]     │
│                         │
├─────────────────────────┤
│  PROJECT TITLE          │
│  Description text here  │
└─────────────────────────┘
```

Much easier to read than a cramped 3-column table!
