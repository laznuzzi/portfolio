# Commit Diary - Local Manual Testing Plan

## Overview

This is a simplified version to test the commit diary feature **locally** before setting up automated GitHub Actions. This lets you:
- Test the UI/UX without API costs
- Manually create diary entries to see how they look
- Verify the frontend works before automating
- Learn the workflow hands-on

**Approach**: Manually create `commit-diary.json` with sample data, build the frontend UI, test locally.

---

## Phase 1: Create Sample Data

We'll manually create a `commit-diary.json` file with sample "tech bro" summaries to test the UI.

### Step 1.1: Create JSON File

**File**: `/Users/nazarena/Documents/_test/website/commit-diary.json`

```json
[
  {
    "date": "2026-01-27",
    "summary": "Yo, just absolutely crushed it today with some sick modal animations and physics engine tweaks. The capsules are bouncing like they're on a trampoline at a tech bro convention, and honestly? It's giving 'startup that just closed Series A' energy. Chef's kiss. 💅",
    "commitCount": 5
  },
  {
    "date": "2026-01-26",
    "summary": "Refactored like 800 lines of spaghetti code into something that actually makes sense. Removed some dead code (RIP to the functions no one ever called), and added design tokens because apparently hardcoding colors is so 2023. Feeling pretty zen about it tbh.",
    "commitCount": 3
  },
  {
    "date": "2026-01-25",
    "summary": "Deployed to prod at like 11PM on a Saturday because that's what peak performance looks like, baby. Fixed a gnarly bug where the gallery images weren't loading (turns out I forgot to push the images folder lmao). Zero regrets, 100% uptime, infinite vibes.",
    "commitCount": 7
  },
  {
    "date": "2026-01-24",
    "summary": "Added password protection to the archives section. It's client-side only so not exactly Fort Knox, but hey, it keeps the casuals out. Also spent way too long picking the perfect purple gradient for the diary icon. Worth it.",
    "commitCount": 2
  },
  {
    "date": "2026-01-23",
    "summary": "Implemented dark mode toggle because apparently not having dark mode in 2026 is a war crime. Used CSS custom properties like a responsible adult, and now the site looks fire in both themes. Low key obsessed with the attention to detail rn.",
    "commitCount": 4
  }
]
```

**Notes:**
- Each entry has: `date` (ISO format), `summary` (funny tech bro text), `commitCount` (number)
- Entries are in reverse chronological order (newest first)
- Sample summaries show the tone we're going for

### Step 1.2: Manual Workflow (Optional)

If you want to practice generating summaries manually from real commits:

1. Run this command to see recent commits:
   ```bash
   cd /Users/nazarena/Documents/_test/website
   git log --since="7 days ago" --pretty=format:"%ad - %s (by %an)" --date=short
   ```

2. Copy the commit messages

3. Go to claude.ai and paste:
   ```
   You are a funny "tech bro" writing a casual dev diary. Here are today's commits:

   [paste commits here]

   Summarize these commits in a short, entertaining paragraph (2-4 sentences)
   as if you're bragging to your startup friends about your productivity.
   Use tech bro slang, be a bit sarcastic, and keep it light and funny.
   ```

4. Add the output to your JSON file

---

## Phase 2: Build Frontend UI

Create the diary icon and sliding panel components.

### Step 2.1: Create CSS File

**File**: `/Users/nazarena/Documents/_test/website/css/commit-diary.css`

```css
/* ==================== COMMIT DIARY STYLES ==================== */

/* Floating Diary Icon (Bottom-Right) */
.diary-icon {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.diary-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

.diary-icon svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Sliding Panel (Right Side) */
.diary-panel {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 12px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.diary-panel.open {
  right: 0;
}

/* Panel Header */
.diary-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
}

.diary-header h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
  font-weight: 600;
}

.diary-close {
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;
}

.diary-close:hover {
  color: #333;
}

/* Scrollable Entries Area */
.diary-entries {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #fafafa;
}

/* Individual Diary Entry */
.diary-entry {
  margin-bottom: 24px;
  padding: 16px;
  border-left: 3px solid #667eea;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.diary-entry:last-child {
  margin-bottom: 0;
}

.diary-date {
  font-size: 12px;
  color: #667eea;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.diary-summary {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin-bottom: 8px;
}

.diary-meta {
  font-size: 11px;
  color: #999;
  font-style: italic;
}

/* Empty State */
.diary-empty {
  text-align: center;
  color: #999;
  padding: 40px 20px;
  font-size: 14px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .diary-panel {
    width: 100%;
    right: -100%;
  }

  .diary-icon {
    bottom: 16px;
    right: 16px;
    width: 56px;
    height: 56px;
  }
}

/* Scrollbar Styling (Optional) */
.diary-entries::-webkit-scrollbar {
  width: 8px;
}

.diary-entries::-webkit-scrollbar-track {
  background: #f0f0f0;
}

.diary-entries::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

.diary-entries::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}
```

**Notes:**
- Purple gradient matches your existing site's aesthetic
- Smooth sliding animation (0.3s ease)
- Responsive (full-width on mobile)
- Custom scrollbar styling
- Fixed positioning so it doesn't interfere with page scroll

### Step 2.2: Create JavaScript File

**File**: `/Users/nazarena/Documents/_test/website/js/commit-diary.js`

```javascript
// ==================== COMMIT DIARY MODULE ====================

(function() {
  'use strict';

  class CommitDiary {
    constructor() {
      this.diaryData = [];
      this.isOpen = false;
      this.panel = null;
      this.icon = null;
      this.closeBtn = null;
      this.entriesContainer = null;
    }

    async init() {
      // Get DOM elements
      this.panel = document.getElementById('diary-panel');
      this.icon = document.getElementById('diary-icon');
      this.closeBtn = document.getElementById('diary-close');
      this.entriesContainer = document.getElementById('diary-entries');

      if (!this.panel || !this.icon || !this.closeBtn || !this.entriesContainer) {
        console.error('Commit diary: Required DOM elements not found');
        return;
      }

      // Fetch diary data
      await this.loadData();

      // Set up event listeners
      this.icon.addEventListener('click', () => this.toggle());
      this.closeBtn.addEventListener('click', () => this.close());

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Close when clicking outside panel
      this.panel.addEventListener('click', (e) => {
        if (e.target === this.panel) {
          this.close();
        }
      });

      console.log('Commit diary initialized with', this.diaryData.length, 'entries');
    }

    async loadData() {
      try {
        const response = await fetch('/commit-diary.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        this.diaryData = await response.json();
      } catch (error) {
        console.error('Failed to load commit diary:', error);
        this.diaryData = [];
      }
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.render();
      this.panel.classList.add('open');
      this.isOpen = true;

      // Prevent body scroll when panel is open
      document.body.style.overflow = 'hidden';
    }

    close() {
      this.panel.classList.remove('open');
      this.isOpen = false;

      // Restore body scroll
      document.body.style.overflow = '';
    }

    render() {
      if (this.diaryData.length === 0) {
        this.entriesContainer.innerHTML = '<p class="diary-empty">No diary entries yet. Check back soon!</p>';
        return;
      }

      const entriesHTML = this.diaryData.map(entry => `
        <div class="diary-entry">
          <div class="diary-date">${this.formatDate(entry.date)}</div>
          <div class="diary-summary">${this.escapeHtml(entry.summary)}</div>
          <div class="diary-meta">${entry.commitCount} commit${entry.commitCount !== 1 ? 's' : ''}</div>
        </div>
      `).join('');

      this.entriesContainer.innerHTML = entriesHTML;
    }

    formatDate(dateString) {
      const date = new Date(dateString);
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      };
      return date.toLocaleDateString('en-US', options);
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const diary = new CommitDiary();
      diary.init();
    });
  } else {
    // DOM already loaded
    const diary = new CommitDiary();
    diary.init();
  }

})();
```

**Features:**
- IIFE pattern (matches your existing code style)
- Fetches JSON on init
- Keyboard support (Escape to close)
- Click outside to close
- Prevents body scroll when open
- Error handling for missing JSON
- HTML escaping for security
- Plural handling for commit count

---

## Phase 3: Update HTML

Add the diary components to your `index.html` file.

### Step 3.1: Add CSS Link

Add this in the `<head>` section, after your existing stylesheets:

```html
<!-- Commit Diary Styles -->
<link rel="stylesheet" href="css/commit-diary.css">
```

### Step 3.2: Add Diary Components

Add this before the closing `</body>` tag (after all your existing scripts):

```html
<!-- ==================== COMMIT DIARY ==================== -->

<!-- Floating Diary Icon -->
<button id="diary-icon" class="diary-icon" aria-label="Open commit diary">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM14 17H7V15H14V17ZM17 13H7V11H17V13ZM17 9H7V7H17V9Z"/>
  </svg>
</button>

<!-- Diary Panel (slides in from right) -->
<div id="diary-panel" class="diary-panel">
  <div class="diary-header">
    <h2>Dev Diary</h2>
    <button id="diary-close" class="diary-close" aria-label="Close diary">&times;</button>
  </div>
  <div id="diary-entries" class="diary-entries">
    <!-- Entries loaded dynamically by JS -->
  </div>
</div>

<!-- Commit Diary Script -->
<script src="js/commit-diary.js"></script>
```

**Notes:**
- Icon is a notebook/journal SVG (24×24)
- Panel starts hidden (off-screen right)
- Entries container is empty (populated by JS)
- ARIA labels for accessibility

---

## Phase 4: Test Locally

Now let's test everything works!

### Step 4.1: Start Development Server

```bash
cd /Users/nazarena/Documents/_test/website
npm run dev
```

This starts `live-server` on http://localhost:3000

### Step 4.2: Visual Checks

Open http://localhost:3000 and verify:

1. **Icon visible?**
   - ✅ Purple gradient circle in bottom-right corner
   - ✅ Notebook icon visible inside
   - ✅ Hover effect (scales up, shadow grows)

2. **Click icon → Panel slides in?**
   - ✅ Panel slides in from right smoothly (0.3s)
   - ✅ "Dev Diary" header visible
   - ✅ Close button (×) in header
   - ✅ 5 diary entries visible

3. **Diary entries formatted correctly?**
   - ✅ Each entry has date (purple, uppercase, bold)
   - ✅ Summary text (readable, 2-4 sentences)
   - ✅ Commit count footer (gray, italic)
   - ✅ Purple left border on each entry
   - ✅ Entries in reverse chronological order (newest first)

4. **Close functionality?**
   - ✅ Click × button → panel closes
   - ✅ Press Escape key → panel closes
   - ✅ Body scroll restored after closing

5. **Mobile responsive?**
   - ✅ Resize browser to mobile width (< 768px)
   - ✅ Panel should be full-width
   - ✅ Icon slightly smaller (56px)

### Step 4.3: Browser Console Checks

Open DevTools (Cmd+Option+I) → Console tab:

```javascript
// Should see this log:
Commit diary initialized with 5 entries
```

If you see errors:
- **404 on commit-diary.json**: File not in root directory
- **"Required DOM elements not found"**: Check HTML IDs match
- **CSS not loading**: Check CSS file path

### Step 4.4: Network Tab Check

DevTools → Network tab → Reload page

Look for:
- ✅ `commit-diary.json` (Status: 200)
- ✅ `commit-diary.css` (Status: 200)
- ✅ `commit-diary.js` (Status: 200)

---

## Phase 5: Manual Testing Workflow

Now that the UI works, let's practice the manual workflow.

### Scenario: Add a New Diary Entry

1. **Make some commits** (or use existing recent commits)

2. **Get commit messages**:
   ```bash
   cd /Users/nazarena/Documents/_test/website
   git log --since="1 day ago" --pretty=format:"%ad - %s" --date=short
   ```

3. **Generate summary** (using Claude.ai web interface):
   - Paste commit messages
   - Ask for tech bro summary
   - Copy output

4. **Update JSON file**:
   - Open `/Users/nazarena/Documents/_test/website/commit-diary.json`
   - Add new entry at the TOP (newest first):
   ```json
   {
     "date": "2026-01-28",
     "summary": "[your new funny summary]",
     "commitCount": 2
   }
   ```

5. **Test in browser**:
   - Refresh page (or live-server auto-reloads)
   - Click diary icon
   - Verify new entry appears at top

### Practice This Process 2-3 Times

This helps you:
- Understand the data format
- Get comfortable with the tone
- See how entries accumulate over time
- Test edge cases (0 commits, many commits, long summaries)

---

## Phase 6: Next Steps

Once you're happy with the local version:

### Option A: Keep It Manual (Simple)

**Pros:**
- No API costs
- Full control over summaries
- No automation to maintain

**Cons:**
- Must remember to do it daily
- Manual work every day
- No summaries if you forget

**How to:**
1. Set daily reminder (e.g., 6 PM)
2. Run git log command
3. Generate summary via claude.ai
4. Update JSON file
5. Commit and push to GitHub
6. Netlify auto-deploys

### Option B: Automate with GitHub Actions (Recommended)

**Pros:**
- Runs automatically every day
- Never forget
- Professional approach
- Shows DevOps skills

**Cons:**
- Costs ~$1.50/month (Claude API)
- Need API key setup
- More complex (but we have the plan!)

**How to:**
1. Follow full plan in `COMMIT-DIARY-PLAN.md`
2. Set up Claude API key
3. Add GitHub Secret
4. Create workflow files
5. Test manually, then let it run daily

---

## File Summary

Files you'll create for local testing:

```
📁 /Users/nazarena/Documents/_test/website/

📄 commit-diary.json                (Sample data - manual creation)
📄 css/commit-diary.css             (Diary UI styles)
📄 js/commit-diary.js               (Diary UI logic)
📄 index.html                       (Add ~30 lines for diary components)
```

**Total time to implement**: 30-45 minutes

---

## Troubleshooting

### Icon doesn't appear

**Check:**
1. `css/commit-diary.css` linked in HTML `<head>`?
2. CSS file exists in `/css/` folder?
3. Browser console shows CSS 404 error?
4. Hard-refresh browser (Cmd+Shift+R)

### Panel doesn't slide in

**Check:**
1. `js/commit-diary.js` linked in HTML (before `</body>`)?
2. Browser console shows JS errors?
3. Element IDs match (diary-icon, diary-panel, etc.)?
4. Click working (check console log)?

### No entries shown

**Check:**
1. `commit-diary.json` exists in root folder?
2. JSON is valid (use JSONLint.com to validate)?
3. Browser Network tab shows 200 for JSON?
4. Console shows "initialized with X entries"?

### Styling looks wrong

**Check:**
1. Browser cache (hard-refresh with Cmd+Shift+R)?
2. CSS file loaded (Network tab)?
3. Conflicting styles from other CSS files?
4. Inspect element in DevTools to see applied styles

---

## Success Criteria

You're ready to move to automation when:

- ✅ Icon appears and is clickable
- ✅ Panel slides in/out smoothly
- ✅ All 5 sample entries display correctly
- ✅ Date formatting looks good
- ✅ Summary text is readable and funny
- ✅ Close button works
- ✅ Escape key closes panel
- ✅ Mobile responsive (tested)
- ✅ No console errors
- ✅ You've manually added 2-3 new entries successfully

---

## Questions?

Common questions before starting:

**Q: Do I need the API key for local testing?**
A: Nope! This local version uses a static JSON file you create manually.

**Q: Can I change the purple gradient color?**
A: Yes! Edit the `background` property in `.diary-icon` CSS. Use your design tokens if you prefer.

**Q: What if I want more than 5 sample entries?**
A: Just add more objects to the JSON array. Keep them in reverse chronological order.

**Q: Can I change "Dev Diary" to something else?**
A: Absolutely! Edit the `<h2>` in the HTML. Ideas: "Build Log", "Code Diary", "Commit Chronicle", "Dev Notes"

**Q: Should I commit the sample JSON to GitHub?**
A: Your choice! You can either:
1. Commit it (visitors see sample data until real summaries start)
2. Add to `.gitignore` (only you see it locally)
3. Create with real data from day 1

Ready to start? Let me know when you want to build this! 🚀
