# Google Sheets Content Management Setup

This guide shows you how to manage your portfolio content using Google Sheets instead of editing code files.

## Step 1: Create Your Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it "Portfolio Content" (or whatever you like)

## Step 2: Set Up Columns

In the **first row**, add these column headers (exact names, in this order):

| A | B | C | D | E | F | G | H | I |
|---|---|---|---|---|---|---|---|---|
| **id** | **title** | **shortDescription** | **role** | **timeline** | **context** | **description** | **techStack** | **githubLink** |

**Column descriptions:**
- **id**: Unique identifier (lowercase, no spaces) - e.g., `sandbox`, `alpha`, `my-project`
- **title**: Project name shown in modal - e.g., `sandbox`, `Project Alpha`
- **shortDescription**: Brief description shown in table row
- **role**: Your role in the project - e.g., `Designer & Developer`, `UX/UI Designer`
- **timeline**: When the project was done - e.g., `2024`, `Jan - Mar 2024`, `6 months`
- **context**: Background/context about the project - shown before description
- **description**: Main detailed description shown in modal
- **techStack**: (OPTIONAL) Technologies used - e.g., `React, TypeScript, Node.js`
- **githubLink**: (OPTIONAL) GitHub URL - e.g., `https://github.com/username/project`

**Note**: Images are now managed in code (see `google-sheets-loader.js` IMAGE_MAPPING), not in Google Sheets.

## Step 3: Add Your Projects

Starting in **row 2**, add one project per row.

**Example:**

| id | title | shortDescription | role | timeline | context | description | techStack | githubLink |
|----|-------|------------------|------|----------|---------|-------------|-----------|------------|
| sandbox | sandbox | An AI-native prototyping tool and code kit | Designer & Developer | 2024 | Square needed a way to rapidly prototype new features while maintaining design consistency. | An AI-native prototyping tool and code kit for building experimental interfaces grounded in Square and Cash App design patterns. Built to enable rapid experimentation while maintaining design consistency across products. | React, TypeScript, GSAP | https://github.com/username/sandbox |
| alpha | Project Alpha | Innovative user experience design | UX/UI Designer | Jan - Mar 2024 | Users were struggling with complex workflows on mobile devices. | Project Alpha focuses on creating intuitive and delightful user experiences. This project involved extensive user research, prototyping, and iterative design to deliver a seamless product. | | |

**Tips:**
- context, techStack and githubLink are optional - leave blank if not applicable
- context and description can be as long as you want (multiple paragraphs work)
- Images are managed in `google-sheets-loader.js` (IMAGE_MAPPING object)

## Step 4: Share Your Sheet (Make it Public)

1. Click the **"Share"** button in the top-right corner
2. Under "General access", click **"Restricted"**
3. Change it to **"Anyone with the link"**
4. Make sure it's set to **"Viewer"** (not Editor)
5. Click **"Copy link"**

## Step 5: Get Your Sheet ID

Your copied link looks like this:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit#gid=0
                                       ↑
                                This is your Sheet ID
```

Copy just the middle part: `1a2b3c4d5e6f7g8h9i0j`

## Step 6: Configure Your Website

1. Open the file: `google-sheets-loader.js`
2. Find this line near the top:
   ```javascript
   const GOOGLE_SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
3. Replace `YOUR_SHEET_ID_HERE` with your actual Sheet ID:
   ```javascript
   const GOOGLE_SHEET_ID = '1a2b3c4d5e6f7g8h9i0j';
   ```
4. Save the file

## Step 7: Configure Images

Images are now managed in code for better control over file paths. Each project can have:
- **thumbnail**: Static image shown in the table
- **hover**: Animated GIF shown on hover
- **modal**: Array of images shown when project is opened

1. Open the file: `google-sheets-loader.js`
2. Find the `IMAGE_MAPPING` object near the top:
   ```javascript
   const IMAGE_MAPPING = {
       'sandbox': {
           thumbnail: './img/sandbox-thumb.jpg',
           hover: './img/sandbox-hover.gif',
           modal: ['./img/sandbox1.jpg', './img/sandbox2.jpg']
       },
       'alpha': {
           thumbnail: './img/alpha-thumb.jpg',
           hover: './img/alpha-hover.gif',
           modal: ['./img/alpha1.jpg']
       },
       // Add more projects here
   };
   ```
3. Add your project images using the project `id` as the key:
   ```javascript
   'my-project': {
       thumbnail: './img/my-project-thumb.jpg',
       hover: './img/my-project-hover.gif',
       modal: ['./img/my-project-1.jpg', './img/my-project-2.jpg']
   },
   ```
4. Save the file

**Tips:**
- The key must match the `id` column in your Google Sheet
- **thumbnail**: Shows in the table by default (use .jpg, .png, .webp)
- **hover**: Shows when user hovers - can be:
  - Video file (**.mp4, .mov, .webm**) - recommended for better quality and smaller size
  - GIF file (**.gif**) - also supported but larger and lower quality
- **modal**: Array of images shown in the modal (can be as many as you want)
- If no images are defined for a project, it will use placeholder images
- Videos auto-play and loop on hover with no audio

## Step 8: Test It

1. Refresh your website
2. Open the browser console (F12 → Console tab)
3. You should see: `"Google Sheets data loaded: X projects"`
4. Your table should now show the projects from your Google Sheet!

## How to Update Content

**To add a new project:**
1. Open your Google Sheet and add a new row with the project details
2. Open `google-sheets-loader.js` and add images to the `IMAGE_MAPPING`:
   ```javascript
   'new-project-id': ['./img/new1.jpg', './img/new2.jpg'],
   ```
3. Refresh your website - done!

**To edit existing project text:**
1. Open your Google Sheet
2. Edit the cells (title, description, role, etc.)
3. Refresh your website - changes appear immediately!

**To change project images:**
1. Open `google-sheets-loader.js`
2. Update the image paths in `IMAGE_MAPPING` for the project:
   - `thumbnail`: Change the static table image
   - `hover`: Change the hover GIF
   - `modal`: Update the array of modal images
3. Refresh your website - done!

**To reorder projects:**
1. Just drag rows up/down in your Google Sheet
2. The table will reflect the new order

## Troubleshooting

**"Failed to fetch Google Sheet" error:**
- Make sure the sheet is shared as "Anyone with the link can view"
- Check that your Sheet ID is correct (no extra characters)

**Content not updating:**
- Hard refresh your browser: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check the browser console for error messages

**Still using file-content.js:**
- Make sure `GOOGLE_SHEET_ID` is set correctly in `google-sheets-loader.js`
- The console should show "Loading content from Google Sheets..."

## Switching Back to file-content.js

To stop using Google Sheets and go back to the JavaScript file:
1. Open `google-sheets-loader.js`
2. Change the Sheet ID back to:
   ```javascript
   const GOOGLE_SHEET_ID = 'YOUR_SHEET_ID_HERE';
   ```
3. Refresh your website

---

## Google Sheet Template

Your sheet should have **9 columns** (A through I):

```
id | title | shortDescription | role | timeline | context | description | techStack | githubLink
```

Once you've set this up, updating content is easy:
- **Text content**: Edit directly in Google Sheets (no code changes needed!)
- **Images**: Edit the IMAGE_MAPPING object in `google-sheets-loader.js`
