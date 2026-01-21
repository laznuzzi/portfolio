// ==================== GOOGLE SHEETS CONTENT LOADER ====================
// Fetches portfolio content from Google Sheets and populates modals

// ==================== SETUP INSTRUCTIONS ====================
// 1. Create a Google Sheet with these columns (in this exact order):
//    A: id (e.g., "sandbox", "alpha") - must match data-entry in HTML
//    B: title (e.g., "sandbox")
//    C: shortDescription (shown in table row)
//    D: role (e.g., "Designer & Developer", "UX/UI Designer")
//    E: timeline (e.g., "2024", "Jan - Mar 2024", "6 months")
//    F: context (background/context shown before description)
//    G: description (main content shown in modal)
//    H: techStack (optional - e.g., "React, TypeScript, Node.js")
//    I: githubLink (optional - e.g., "https://github.com/username/project")
//
// 2. Fill in your projects (one row per project)
//
// 3. Share the sheet:
//    - Click "Share" button (top right)
//    - Change to "Anyone with the link can view"
//    - Click "Copy link"
//
// 4. Get the Sheet ID from the URL:
//    URL looks like: https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit...
//    Copy the SHEET_ID_HERE part
//
// 5. Paste your Sheet ID below:

const GOOGLE_SHEET_ID = '1L9NDhmwXF08koR6md64g0WRfEuMyPhLiZhZBmJCamN4'; // Your Portfolio Content Sheet

// ==================== IMAGE MAPPING ====================
// Define images for each project by ID
// Images are no longer managed in Google Sheets - edit them here instead
//
// For 'hover', you can use:
//   - Video files (.mp4, .mov, .webm) - RECOMMENDED for better quality & smaller size
//   - GIF files (.gif) - also supported but larger & lower quality
const IMAGE_MAPPING = {
    'sandbox': {
        thumbnail: './img/sandbox-thumb.jpg',
        hover: './img/sandbox-hover.gif',
        modal: ['./img/sandbox1.jpg', './img/sandbox2.jpg', './img/sandbox3.jpg']
    },
    'vibe-code kit': {
        thumbnail: './img/vibe-thumb.jpg',
        hover: './img/vibe-hover.gif',
        modal: ['./img/vibe1.jpg', './img/vibe2.jpg']
    },
    'g2': {
        thumbnail: './img/g2-thumb.png',
        hover: './img/g2-hover.mp4',
        modal: ['./img/g2-1.mp4', './img/g2-2.png', './img/g2-3.png', './img/g2-4.mp4']
    },
    'rdm': {
        thumbnail: './img/rdm-thumb.png',
        hover: './img/rdm-hover.mp4',
        modal: ['./img/rdm-preview.png']
    },
    'design-system': {
        thumbnail: './img/design-system-thumb.jpg',
        hover: './img/design-system-hover.gif',
        modal: ['./img/design-system1.jpg', './img/design-system2.jpg']
    },
    'automation-portal': {
        thumbnail: './img/automation-thumb.jpg',
        hover: './img/automation-hover.gif',
        modal: ['./img/placeholder.jpeg']
    }
};

// ==================== CODE (Don't modify below) ====================

(function() {
    // Check if we should use Google Sheets or fall back to file-content.js
    const useGoogleSheets = GOOGLE_SHEET_ID && GOOGLE_SHEET_ID !== 'YOUR_SHEET_ID_HERE';

    if (!useGoogleSheets) {
        console.log('Google Sheets not configured - using file-content.js');
        return;
    }

    console.log('Loading content from Google Sheets...');

    // Fetch data from Google Sheets as CSV
    const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv&gid=0`;

    fetch(csvUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch Google Sheet. Make sure the sheet is shared as "Anyone with the link can view"');
            }
            return response.text();
        })
        .then(csvText => {
            console.log('Google Sheets data fetched successfully');

            // Parse CSV
            const data = parseCSV(csvText);

            // Convert to fileData format
            const fileData = {};

            data.forEach(row => {
                if (!row.id || !row.title) return; // Skip empty rows

                // Get images from mapping (defined in code above)
                const imageData = IMAGE_MAPPING[row.id] || {
                    thumbnail: './img/placeholder.jpeg',
                    hover: './img/placeholder.jpeg',
                    modal: ['./img/placeholder.jpeg']
                };
                const images = imageData.modal || ['./img/placeholder.jpeg'];

                // Create content HTML with new structure
                const content = `
                    <h1>${row.title}</h1>

                    ${row.role ? `
                        <p style="font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); color: var(--text-primary); margin-bottom: var(--space-2);">
                            ${row.role}
                        </p>
                    ` : ''}

                    ${row.timeline ? `
                        <p style="font-size: var(--font-size-sm); color: var(--text-secondary); margin-bottom: var(--space-6);">
                            ${row.timeline}
                        </p>
                    ` : ''}

                    ${row.context ? `
                        <h2>Context</h2>
                        <p style="color: var(--text-primary);">${row.context}</p>
                    ` : ''}

                    <h2>Description</h2>
                    <p style="color: var(--text-primary);">${row.description || 'Project description coming soon.'}</p>

                    ${row.techStack ? `
                        <h2>Tech Stack</h2>
                        <p style="color: var(--text-primary);">${row.techStack}</p>
                    ` : ''}

                    ${row.githubLink ? `
                        <h2>Links</h2>
                        <p style="color: var(--text-primary);"><a href="${row.githubLink}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary); text-decoration: underline;">View on GitHub →</a></p>
                    ` : ''}
                `;

                fileData[row.id] = {
                    title: row.title,
                    role: row.role || '',
                    description: row.shortDescription || '',
                    images: images,
                    content: content
                };
            });

            // Override window.fileData with Google Sheets data
            window.fileData = { ...window.fileData, ...fileData };

            console.log('Google Sheets data loaded:', Object.keys(fileData).length, 'projects');

            // Update table if it exists
            updateVintageTable(data);
        })
        .catch(error => {
            console.error('Error loading Google Sheets:', error);
            console.log('Falling back to file-content.js');
        });

    // Better CSV parser that handles quoted fields with commas
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const data = [];

        // Parse header row
        const headers = parseCSVLine(lines[0]);

        // Parse data rows
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines

            const values = parseCSVLine(lines[i]);
            const row = {};

            headers.forEach((header, index) => {
                // Remove "(table)" or "(modal)" or "(modal, optional)" from header names
                const cleanHeader = header.replace(/\s*\(.*?\)\s*/g, '').trim();
                row[cleanHeader] = values[index] ? values[index].trim() : '';
            });

            data.push(row);
        }

        return data;
    }

    // Parse a single CSV line handling quoted fields
    function parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }

        result.push(current); // Add last field
        return result;
    }

    // Update vintage table with Google Sheets data
    function updateVintageTable(data) {
        const tbody = document.querySelector('.vintage-table tbody');
        if (!tbody) return;

        // Clear existing rows
        tbody.innerHTML = '';

        // Create rows from Google Sheets data
        data.forEach((row, index) => {
            if (!row.id || !row.title) return;

            // Get images from mapping (defined in code above)
            const imageData = IMAGE_MAPPING[row.id] || {
                thumbnail: './img/placeholder.jpeg',
                hover: './img/placeholder.jpeg',
                modal: ['./img/placeholder.jpeg']
            };
            const thumbnailImage = imageData.thumbnail;
            const hoverImage = imageData.hover;

            const tr = document.createElement('tr');
            tr.className = 'vintage-table-row';
            tr.setAttribute('data-entry', row.id);

            // Add lock icon to first 3 projects
            const lockIcon = index < 3 ? '<span class="lock-icon">🔒</span>' : '';

            // Mark first 3 as locked
            if (index < 3) {
                tr.setAttribute('data-locked', 'true');
            }

            // Check if hover is a video file
            const isVideo = /\.(mp4|mov|webm)$/i.test(hoverImage);
            const hoverMediaTag = isVideo
                ? `<video src="${hoverImage}" autoplay loop muted playsinline></video>`
                : `<img src="${hoverImage}" alt="${row.title}">`;

            tr.innerHTML = `
                <td class="col-title">${lockIcon}<span>${row.title}</span></td>
                <td class="col-description">${row.shortDescription || ''}</td>
                <td class="vintage-table-thumbnail">
                    <img src="${thumbnailImage}" alt="${row.title}">
                    <div class="vintage-table-hover-image">
                        <div class="hover-image-wrapper">
                            ${hoverMediaTag}
                        </div>
                    </div>
                </td>
            `;

            tbody.appendChild(tr);
        });

        console.log('Vintage table updated with', data.length, 'projects');

        // Trigger a custom event so sections-nav.js can re-initialize
        window.dispatchEvent(new CustomEvent('vintageTableUpdated'));
    }
})();
