# Daily Commit Diary - Implementation Plan

## Overview

Implement an automated daily pipeline that fetches GitHub commits, summarizes them using Claude API in a funny "tech bro" tone, and displays them on your portfolio site via a floating diary icon.

**Chosen Architecture**: GitHub Actions + Static JSON
- Best fit for your static site architecture
- Professional, reliable, and cost-effective (~$1.50/month)
- No platform migration needed
- Industry-standard approach

---

## Technical Approach

### Pipeline Flow

```
GitHub Actions (scheduled daily at midnight UTC)
    ↓
Fetch last 24 hours of commits via Git
    ↓
Send commit messages to Claude API (tech bro summarization)
    ↓
Generate/update commit-diary.json in repo
    ↓
Commit and push JSON file [skip ci]
    ↓
Website fetches JSON on diary icon click
    ↓
Display in sliding panel (macOS-inspired)
```

### Why This Approach?

1. **Perfect fit**: Your site is pure static HTML/CSS/JS with no build step
2. **Zero infrastructure**: Uses GitHub's free CI/CD (2000 min/month free tier)
3. **Secure**: Claude API key stored as GitHub Secret (encrypted)
4. **Reliable**: 99.9% uptime, automatic retries, email notifications
5. **Cost-effective**: ~$1.50/month for Claude API calls (30 days × $0.05/call)
6. **Professional**: Shows DevOps knowledge in your portfolio
7. **Maintainable**: Set it and forget it - works even when you're offline

---

## Implementation Steps

### Phase 1: Claude API Setup (PREREQUISITE)

**You need to obtain a Claude API key before proceeding:**

1. Go to: https://console.anthropic.com/
2. Sign up or log in with your account
3. Navigate to: **API Keys** section
4. Click **"Create Key"** button
5. Name it: "Portfolio Commit Diary"
6. Copy the API key (starts with `sk-ant-...`)
7. **IMPORTANT**: Save this key securely - it's only shown once!

**Pricing Info:**
- Claude 3.5 Sonnet costs ~$0.003/1k input tokens, ~$0.015/1k output tokens
- Daily summary: ~1500 input + 400 output tokens = ~$0.01/day
- Monthly cost: ~$1.50 for 30 daily summaries

**Set up billing:**
- Add payment method in console
- Set budget alerts (optional but recommended)

---

### Phase 2: GitHub Secret Configuration

Store your Claude API key securely in GitHub:

1. Go to: https://github.com/laznuzzi/portfolio/settings/secrets/actions
2. Click **"New repository secret"**
3. **Name**: `ANTHROPIC_API_KEY`
4. **Secret**: Paste your Claude API key from Phase 1
5. Click **"Add secret"**

**Security note**: This encrypts your key and only makes it available to GitHub Actions workflows. Never commit API keys directly to your repository.

---

### Phase 3: Create GitHub Actions Workflow

**Create directory structure:**
```
/Users/nazarena/Documents/_test/website/
├── .github/
│   ├── workflows/
│   │   └── daily-commit-summary.yml    (NEW)
│   └── scripts/
│       └── generate-summary.js         (NEW)
```

**File 1: `.github/workflows/daily-commit-summary.yml`**

This YAML file configures the automated workflow:
- **Schedule**: Runs daily at midnight UTC via cron
- **Trigger**: Can also be manually triggered for testing
- **Steps**:
  1. Checkout repo with full git history
  2. Set up Node.js 20
  3. Install Anthropic SDK
  4. Run summary generation script
  5. Commit and push JSON if changed

**File 2: `.github/scripts/generate-summary.js`**

This Node.js script:
1. Fetches commits from last 24 hours using `git log`
2. Formats commit data (hash, author, date, message)
3. Calls Claude API with "tech bro" tone instructions
4. Loads existing `commit-diary.json` or creates new
5. Prepends new entry to array
6. Keeps only last 90 days of entries
7. Writes JSON back to file

**Key Features:**
- Skips if no commits in last 24 hours
- Uses Claude 3.5 Sonnet model
- Generates 2-4 sentence funny summaries
- Includes commit count metadata
- Auto-archives old entries (90-day retention)

---

### Phase 4: Frontend JavaScript (Diary UI Logic)

**Create file: `js/commit-diary.js`**

This handles all diary panel interactions:
- **Init**: Fetches `commit-diary.json` on page load
- **Toggle**: Opens/closes diary panel
- **Render**: Dynamically generates HTML for diary entries
- **Date formatting**: Converts ISO dates to readable format

**Class Structure:**
```javascript
class CommitDiary {
  constructor()        // Initialize state
  async init()         // Fetch data, bind events
  toggle()             // Open/close panel
  open()               // Show panel with animation
  close()              // Hide panel
  render()             // Generate entry HTML
  formatDate(date)     // Format dates for display
}
```

**Error Handling:**
- Gracefully handles missing JSON file
- Shows "No diary entries yet" message if empty
- Logs errors to console for debugging

---

### Phase 5: CSS Styling (Diary UI Design)

**Create file: `css/commit-diary.css`**

Implements macOS-inspired sliding panel with:

**Floating Diary Icon (Bottom-Right):**
- 60px circular button with gradient background
- Purple gradient: `#667eea → #764ba2`
- Smooth hover animations (scale + shadow)
- Fixed position: `bottom: 20px; right: 20px`
- SVG notebook icon (24px)

**Sliding Panel (Right Side):**
- 400px wide × full viewport height
- Slides in from right: `-400px → 0` (0.3s ease)
- White background with subtle shadow
- Header with title + close button (×)
- Scrollable entries area

**Diary Entries:**
- Purple left border (3px, `#667eea`)
- Light gray background (`#f8f9fa`)
- Date (uppercase, small, purple, bold)
- Summary text (14px, line-height 1.6)
- Metadata footer (commit count, italicized)
- 24px spacing between entries

**Responsive Design:**
- Mobile: Full-width panel (100vw)
- Desktop: 400px fixed width

---

### Phase 6: HTML Integration

**Update file: `index.html`**

Add three components to your existing HTML:

**1. Floating Diary Icon** (before closing `</body>`):
```html
<button id="diary-icon" class="diary-icon" aria-label="Open commit diary">
  <svg>...</svg>
</button>
```

**2. Diary Panel** (before closing `</body>`):
```html
<div id="diary-panel" class="diary-panel">
  <div class="diary-header">
    <h2>Dev Diary</h2>
    <button id="diary-close">&times;</button>
  </div>
  <div id="diary-entries" class="diary-entries">
    <!-- Loaded dynamically -->
  </div>
</div>
```

**3. Script Links** (in `<head>` after existing scripts):
```html
<link rel="stylesheet" href="css/commit-diary.css">
<script src="js/commit-diary.js"></script>
```

**Integration Notes:**
- Icon positioned outside main content flow (fixed positioning)
- Panel overlays content with high z-index (1000)
- No conflicts with existing animations or styles
- Works with your existing theme system

---

### Phase 7: Testing & Verification

**Manual Workflow Test:**

1. Push all new files to GitHub
2. Go to: https://github.com/laznuzzi/portfolio/actions
3. Click **"Daily Commit Summary"** workflow
4. Click **"Run workflow"** (manual trigger)
5. Wait 1-2 minutes for completion
6. Verify workflow shows ✅ green checkmark
7. Check repo for new file: `commit-diary.json`
8. Review JSON structure and content

**Expected JSON Format:**
```json
[
  {
    "date": "2026-01-27",
    "summary": "Yo, just shipped some absolute fire today...",
    "commitCount": 3
  }
]
```

**Local Site Test:**

1. Pull latest changes (includes `commit-diary.json`)
2. Run: `npm run dev` (starts live-server on port 3000)
3. Open: http://localhost:3000
4. Verify diary icon appears (bottom-right, purple gradient)
5. Click icon → panel slides in from right
6. Verify entry displays with date, summary, commit count
7. Click × or outside → panel closes
8. Test on mobile (responsive full-width panel)

**Debug Checklist:**
- ✅ Workflow logs show successful API call
- ✅ JSON file committed to repo
- ✅ JSON has correct structure
- ✅ Summary text is funny/tech bro tone
- ✅ Diary icon visible and clickable
- ✅ Panel slides smoothly
- ✅ Entries formatted correctly
- ✅ Close button works

---

### Phase 8: Deployment to Netlify

**Update deployment settings:**

1. Push all changes to GitHub main branch
2. Netlify auto-deploys from git (no config changes needed)
3. Verify on live site: https://[your-site].netlify.app
4. Test diary icon and panel on production
5. Wait 24 hours for first automated run
6. Check next day for new entry

**Netlify Notes:**
- No special configuration required
- Static files served as-is (no build step)
- JSON file updates trigger automatic redeployment
- CDN cache refreshes on new commits

---

## File Modifications Summary

### New Files Created (6 files)

```
📁 /Users/nazarena/Documents/_test/website/

📁 .github/
  📁 workflows/
    📄 daily-commit-summary.yml         (GitHub Actions workflow config)
  📁 scripts/
    📄 generate-summary.js              (Node.js script for commit summarization)

📁 css/
  📄 commit-diary.css                   (Diary UI styles)

📁 js/
  📄 commit-diary.js                    (Diary UI logic)

📄 commit-diary.json                    (Auto-generated by workflow)
```

### Files Modified (1 file)

```
📄 index.html
  - Add diary icon button (before </body>)
  - Add diary panel container (before </body>)
  - Link to commit-diary.css (in <head>)
  - Link to commit-diary.js (in <head>)
```

**Total additions to `index.html`: ~20 lines**

---

## Cost & Maintenance

### Monthly Costs

| Service | Cost | Notes |
|---------|------|-------|
| **GitHub Actions** | $0 | Free tier: 2000 min/month (public repo) |
| **Claude API** | ~$1.50 | 30 daily calls @ $0.05/call |
| **Netlify Hosting** | $0 | Already using |
| **Total** | **~$1.50/month** | Less than a coffee! |

### Annual Cost Projection

- **Year 1**: ~$18 (12 months × $1.50)
- Cheaper than any SaaS changelog tool

### Maintenance Requirements

**Minimal maintenance needed:**

✅ **Automated tasks (zero effort):**
- Workflow runs daily at midnight UTC
- Fetches commits, generates summary, pushes JSON
- Website loads latest data automatically

✅ **Quarterly checks (15 min/quarter):**
- Review workflow logs for failures
- Check JSON file size (should stay ~50KB)
- Verify summaries are still funny/on-brand

✅ **Rare updates (once/year or as needed):**
- Update Claude API model version if new features released
- Adjust summary tone in prompt if desired
- Modify retention period (currently 90 days)

❌ **No monitoring dashboards required**
❌ **No server maintenance**
❌ **No database backups**

---

## Future Enhancements (Optional)

These are NOT included in initial implementation but can be added later:

### Phase 9+ Ideas

**1. Client-Side Filtering:**
- Add search box to filter diary entries by keyword
- Date range picker (show last 7/30/90 days)
- Filter by commit count (high-activity days only)

**2. Sharing & Export:**
- "Copy link" button for specific diary entry
- "Download as Markdown" export feature
- Social media share buttons

**3. Visual Enhancements:**
- Animated entry appearance (fade in, slide up)
- Loading skeleton while fetching JSON
- Badge on icon showing unread entry count
- Dark mode styling (use existing theme tokens)

**4. Advanced Analytics:**
- Commit activity heatmap (GitHub-style)
- Most productive day of week chart
- Word cloud of commit messages
- Coding streak tracker

**5. Notifications:**
- Browser notification when new diary entry added
- Email digest (weekly summary of summaries)
- RSS feed for diary entries

**6. AI Improvements:**
- Compare today's commits to yesterday's (continuity)
- Detect patterns (e.g., "mostly bug fixes this week")
- Generate weekly/monthly rollup summaries
- Adjust tone based on commit types

---

## Troubleshooting Guide

### Workflow Fails

**Symptom**: GitHub Actions shows red ✗

**Check**:
1. View workflow logs in GitHub Actions tab
2. Common issues:
   - Invalid API key → Re-add secret
   - API rate limit → Wait and retry
   - Git permission error → Check workflow permissions

**Fix**: Click "Re-run failed jobs" or fix issue and push new commit

---

### JSON Not Updating

**Symptom**: Same diary entries days later

**Check**:
1. Workflow succeeded but no new commits in last 24 hours (expected)
2. Workflow failed → See "Workflow Fails" above
3. Commits exist but filtered out by `[skip ci]` tag

**Fix**: Make commits without `[skip ci]` tag or manually trigger workflow

---

### Icon Not Visible

**Symptom**: No floating button on site

**Check**:
1. `css/commit-diary.css` linked in `<head>`?
2. Button HTML added to `index.html`?
3. CSS file deployed to Netlify?
4. Browser cache cleared?

**Fix**: Check HTML structure, verify CSS link, hard-refresh browser (Cmd+Shift+R)

---

### Panel Doesn't Open

**Symptom**: Icon visible but clicking does nothing

**Check**:
1. `js/commit-diary.js` linked in `<head>`?
2. Browser console shows errors?
3. JavaScript loaded after DOM ready?
4. Event listener attached to correct element ID?

**Fix**: Check console for errors, verify script is loaded, check element IDs match

---

### No Entries Displayed

**Symptom**: Panel opens but shows "No diary entries yet"

**Check**:
1. `commit-diary.json` exists in repo?
2. JSON file contains valid data?
3. Fetch request successful (check Network tab)?
4. JSON structure matches expected format?

**Fix**: Verify JSON exists, check format, test fetch manually in console

---

## Success Criteria

Implementation is complete when:

- ✅ GitHub Actions workflow runs successfully (manual test)
- ✅ `commit-diary.json` is created in repository
- ✅ Diary icon appears on website (bottom-right)
- ✅ Clicking icon slides panel in from right
- ✅ Diary entries display with date, summary, commit count
- ✅ Close button (×) dismisses panel
- ✅ Summary text has funny "tech bro" tone
- ✅ Workflow scheduled to run daily at midnight UTC
- ✅ Site deployed to Netlify with all changes

---

## Next Steps After Approval

1. **Obtain Claude API key** (Phase 1) - YOU must do this first
2. **Add GitHub Secret** (Phase 2) - YOU must do this
3. I'll create all 6 new files with complete code
4. I'll update `index.html` with diary components
5. We'll test the workflow manually together
6. We'll test the frontend locally
7. We'll push to GitHub and deploy to Netlify
8. We'll verify first automated run after 24 hours

**Estimated implementation time**: 1-2 hours (after you complete Phases 1-2)
