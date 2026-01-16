// ==================== FILE CONTENT DATA ====================
// Edit this file to update the content displayed in file modals
//
// Each file has:
// - title: Shown in modal titlebar and popover
// - role: Shown as a tag in popover (optional)
// - description: Shown in popover on hover
// - images: Array of images for the TOP slider/gallery (optional, can be empty [])
// - content: HTML content for the document body
//            You can include ANY HTML here: headings, paragraphs, images, lists, etc.
//            Images can be mixed anywhere in the content using <img> tags
//
// LAYOUT OPTIONS:
// 1. Slider images only (images array + text content)
// 2. Inline images in content (empty images array, use <img> tags in content)
// 3. Both slider + inline images (use both)
// 4. Text only (empty images array, no <img> tags in content)

// Define as global variable so sections-nav.js can access it
window.fileData = {
    // ==================== DOCUMENT A ====================
    'device-hub': {
        title: 'device-hub',
        role: 'Role: Designer & Developer',
        description: 'Project document with implementation strategy and important details',
        images: ['./img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg'],
        content: `
            <h1 class="document-main-title">Enabling sellers to monitor and manage devices remotely</h1>
            <p class="document-metadata">By Nazarena • January 2026 • Project Updates</p>

            <h2 class="document-section-title">Overview</h2>
            <p class="document-paragraph">Square sellers need devices like POS systems, printers, and scanners to run their businesses. 

In 2022, the only way for sellers to monitor, manage and troubleshoot devices was in-person, by going through each individual POS.</p>

            <h2 class="document-section-title">Key Changes</h2>
            <p class="document-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        `
    },

    // ==================== NOTES ====================
    'notes': {
        title: 'Notes.pdf',
        role: 'Role: Designer',
        description: 'Meeting notes and action items from recent discussions',
        images: ['./img/placeholder.jpeg', './img/placeholder.jpeg'],
        content: `
            <h1 class="document-main-title">Meeting notes and action items</h1>
            <p class="document-metadata">By Nazarena • January 2026 • Meeting Notes</p>

            <h2 class="document-section-title">Discussion Points</h2>
            <p class="document-paragraph">These notes provide an overview of key discussion points and action items from recent meetings. The team reviewed progress on current initiatives and identified next steps for upcoming quarters.</p>

            <h2 class="document-section-title">Action Items</h2>
            <p class="document-paragraph">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
        `
    },

    // ==================== REPORT ====================
    'report': {
        title: 'Report_Final.pdf',
        role: 'Role: Designer & Developer',
        description: 'Final report with findings, conclusions, and recommendations',
        images: ['./img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg'],
        content: `
            <h1 class="document-main-title">Final project report</h1>
            <p class="document-metadata">By Nazarena • January 2026 • Final Report</p>

            <h2 class="document-section-title">Executive Summary</h2>
            <p class="document-paragraph">Final report outlining objectives, findings, conclusions, and recommendations. This comprehensive analysis provides strategic insights and actionable recommendations for future development.</p>

            <h2 class="document-section-title">Recommendations</h2>
            <p class="document-paragraph">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        `
    },

    // ==================== PRESENTATION ====================
    // Example: Using slider images at top
    'presentation': {
        title: 'Presentation.pdf',
        role: 'Role: Designer',
        description: 'Client presentation deck with insights and visualizations',
        images: ['./img/placeholder.jpeg'], // Slider at top
        content: `
            <h1 class="document-main-title">Client presentation deck</h1>
            <p class="document-metadata">By Nazarena • January 2026 • Presentation</p>

            <h2 class="document-section-title">Key Insights</h2>
            <p class="document-paragraph">Presentation materials including key insights, data visualizations, and strategic recommendations. This deck summarizes our findings and proposed solutions for the client's consideration.</p>

            <h2 class="document-section-title">Next Steps</h2>
            <p class="document-paragraph">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        `
    },

    // ==================== WEBSITE ====================
    'website': {
        title: 'website',
        role: 'Role: Designer & Developer',
        description: 'Website project folder',
        images: ['./img/placeholder.jpeg', './img/avatar.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg'],
        content: `
            <h1 class="document-main-title">Website</h1>
            <p class="document-metadata">By Nazarena • January 2026 • Website Project</p>

            <h2 class="document-section-title">Project Overview</h2>
            <p class="document-paragraph">This folder contains files and resources related to the website project.</p>
        `
    }

    // ==================== EXAMPLE: INLINE IMAGES ====================
    // Uncomment to see example with images mixed into content
    /*
    ,'example-inline': {
        title: 'Example_Inline.pdf',
        description: 'Example showing inline images within text',
        images: [], // No slider - using inline images instead
        content: `
            <h1 class="document-main-title">Example with inline images</h1>
            <p class="document-metadata">By Nazarena • January 2026 • Example</p>

            <h2 class="document-section-title">First Section</h2>
            <p class="document-paragraph">Here's some text before the image.</p>

            <img src="./img/placeholder.jpeg" alt="Example image" style="width: 100%; max-width: 600px; margin: 20px 0; border-radius: 8px;">

            <p class="document-paragraph">Here's text after the image. You can place images anywhere!</p>

            <h2 class="document-section-title">Multiple Images</h2>
            <p class="document-paragraph">You can even put multiple images side by side:</p>

            <div style="display: flex; gap: 16px; margin: 20px 0;">
                <img src="./img/placeholder.jpeg" alt="Image 1" style="width: 50%; border-radius: 8px;">
                <img src="./img/placeholder.jpeg" alt="Image 2" style="width: 50%; border-radius: 8px;">
            </div>

            <p class="document-paragraph">Completely flexible layout!</p>
        `
    }
    */
};
