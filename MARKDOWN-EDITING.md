# Editing Your Portfolio Content

All your portfolio content is now in **one file**: `projects.md`

## Quick Start

1. Open `projects.md` in any text editor
2. Edit the content using simple markdown
3. Save the file
4. Refresh your browser - done!

## Project Structure

Each project follows this format:

```markdown
# project-id
title: Display Title (optional - defaults to project-id)
shortDescription: Brief description shown in table (optional)
thumbnail: ./img/thumbnail.jpg
hover: ./img/hover.mp4
modal: ./img/image1.jpg, ./img/image2.mp4, ./img/image3.png
locked: true

**Role:** Your Role Here
**Timeline:** Time Period

### Context
Background information about the project...

### Description
Main detailed description of the project...

### Tech Stack
Technologies used (optional)

### Links
[View on GitHub](https://github.com/username/repo)

---
```

## Field Reference

### Metadata (top of each project)
- **project-id** (h1 #) - Unique identifier, lowercase, no spaces
- **title** - Display name (optional, uses project-id if not set)
- **shortDescription** - Shown in table row (optional, auto-generated from description)
- **thumbnail** - Static image in table
- **hover** - Video/GIF on row hover (supports .mp4, .mov, .webm, .gif)
- **modal** - Comma-separated list of images/videos shown when clicked
- **locked** - Set to `true` for password protection (first 3 projects)

### Content Sections
- **Role** - Your role on the project
- **Timeline** - When it was done
- **Context** - Background/problem statement (optional)
- **Description** - Main project details
- **Tech Stack** - Technologies used (optional)
- **Links** - External links like GitHub (optional)

## Examples

### Video Hover + Multiple Modal Media
```markdown
# my-project
thumbnail: ./img/my-thumb.jpg
hover: ./img/my-hover.mp4
modal: ./img/video1.mp4, ./img/screenshot1.png, ./img/screenshot2.png

**Role:** Designer & Developer
**Timeline:** 2025

### Description
Built a really cool thing...
```

### Locked Project
```markdown
# secret-project
locked: true
thumbnail: ./img/secret-thumb.jpg
hover: ./img/secret-hover.gif
modal: ./img/secret1.jpg

**Role:** Lead Designer
**Timeline:** Q1 2024

### Description
Confidential project...
```

### Custom Title & Short Description
```markdown
# g2
title: G2 Console
shortDescription: AI-powered automation for Sales and Support teams.
thumbnail: ./img/g2-thumb.png
hover: ./img/g2-hover.mp4
modal: ./img/g2-1.mp4, ./img/g2-2.png
```

## Tips

✅ **Use markdown formatting** - Bold, italics, lists work in description sections
✅ **Mix images and videos** - Modal supports both .jpg/.png and .mp4/.mov files
✅ **Keep project IDs simple** - Use lowercase with hyphens (e.g., `my-project`)
✅ **Separate projects with `---`** - This keeps them visually distinct

❌ Don't use commas in filenames
❌ Don't forget the colon after metadata fields
❌ Don't leave blank lines between metadata fields

## Testing

After editing `projects.md`:
1. Save the file
2. Hard refresh browser: **Cmd+Shift+R** (Mac) or **Ctrl+Shift+R** (Windows)
3. Check browser console (F12) for any errors

## Markdown vs Old System

**Before (3 places):**
- Google Sheets - text content
- `google-sheets-loader.js` - IMAGE_MAPPING
- `file-content.js` - fallback content

**Now (1 place):**
- `projects.md` - EVERYTHING

No more Google Sheets, no more JavaScript editing!
