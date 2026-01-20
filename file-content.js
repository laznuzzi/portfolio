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

    // sandbox
    'sandbox': {
        title: 'sandbox',
        role: '',
        description: 'An AI-native prototyping tool and code kit for building experimental interfaces grounded in Square and Cash App design patterns.',
        images: ['./img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg'],
        content: `
            <h1>sandbox</h1>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">🍊 🏵️</p>
            <h2>About</h2>
            <p>An AI-native prototyping tool and code kit for building experimental interfaces grounded in Square and Cash App design patterns.</p>
            <h2>Details</h2>
            <p>This project showcases innovative design and development work. Add your detailed project description here.</p>
        `
    },

    'alpha': {
        title: 'Alpha',
        role: '',
        description: 'Project Alpha - Innovative user experience design',
        images: ['./img/placeholder.jpeg', './img/placeholder.jpeg'],
        content: `
            <h1>Alpha</h1>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">. 🔴</p>
            <h2>About</h2>
            <p>Project Alpha - Innovative user experience design</p>
            <h2>Details</h2>
            <p>Add your project details here.</p>
        `
    },

    'beta': {
        title: 'Beta',
        role: '',
        description: 'Design System Beta - Comprehensive component library',
        images: ['./img/placeholder.jpeg'],
        content: `
            <h1>Beta</h1>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">🌍 📱</p>
            <h2>About</h2>
            <p>Design System Beta - Comprehensive component library</p>
            <h2>Details</h2>
            <p>Add your project details here.</p>
        `
    },

    'brand': {
        title: 'Brand',
        role: '',
        description: 'Brand Guidelines - Complete visual identity system',
        images: ['./img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg'],
        content: `
            <h1>Brand</h1>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">🍊 🌷</p>
            <h2>About</h2>
            <p>Brand Guidelines - Complete visual identity system</p>
            <h2>Details</h2>
            <p>Add your project details here.</p>
        `
    },

    'mobile': {
        title: 'Mobile',
        role: '',
        description: 'Mobile App UI - Cross-platform mobile experience',
        images: ['./img/placeholder.jpeg', './img/placeholder.jpeg'],
        content: `
            <h1>Mobile</h1>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">🏵️ 🍊</p>
            <h2>About</h2>
            <p>Mobile App UI - Cross-platform mobile experience</p>
            <h2>Details</h2>
            <p>Add your project details here.</p>
        `
    },

    'platform': {
        title: 'Platform',
        role: '',
        description: 'Web Platform - Responsive web application design',
        images: ['./img/placeholder.jpeg'],
        content: `
            <h1>Platform</h1>
            <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">🌍 🏵️</p>
            <h2>About</h2>
            <p>Web Platform - Responsive web application design</p>
            <h2>Details</h2>
            <p>Add your project details here.</p>
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
};
