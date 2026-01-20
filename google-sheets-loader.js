// ==================== GOOGLE SHEETS CONTENT LOADER ====================
// Fetches portfolio content from Google Sheets and populates modals

// ==================== SETUP INSTRUCTIONS ====================
// 1. Create a Google Sheet with these columns (in this exact order):
//    A: id (e.g., "sandbox", "alpha") - must match data-entry in HTML
//    B: title (e.g., "sandbox")
//    C: shortDescription (shown in table row)
//    D: subtitle (shown under title in modal - e.g., "AI-Powered Design Tool")
//    E: role (e.g., "Designer & Developer", "UX/UI Designer")
//    F: timeline (e.g., "2024", "Jan - Mar 2024", "6 months")
//    G: context (background/context shown before description)
//    H: description (main content shown in modal)
//    I: techStack (optional - e.g., "React, TypeScript, Node.js")
//    J: githubLink (optional - e.g., "https://github.com/username/project")
//    K: images (comma-separated URLs, e.g., "./img/1.jpg,./img/2.jpg,./img/3.jpg")
//    L: icons (emojis shown in table, e.g., "🍊 🏵️")
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

const GOOGLE_SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace with your Sheet ID

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

                // Parse images (comma-separated)
                const images = row.images
                    ? row.images.split(',').map(img => img.trim())
                    : ['./img/placeholder.jpeg'];

                // Create content HTML with new structure
                const content = `
                    <h1>${row.title}</h1>

                    ${row.subtitle ? `
                        <p style="font-size: var(--font-size-lg); color: var(--text-secondary); margin-bottom: var(--space-4);">
                            ${row.subtitle}
                        </p>
                    ` : ''}

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
                        <p>${row.context}</p>
                    ` : ''}

                    <h2>Description</h2>
                    <p>${row.description || 'Project description coming soon.'}</p>

                    ${row.techStack ? `
                        <h2>Tech Stack</h2>
                        <p>${row.techStack}</p>
                    ` : ''}

                    ${row.githubLink ? `
                        <h2>Links</h2>
                        <p><a href="${row.githubLink}" target="_blank" rel="noopener noreferrer" style="color: var(--text-primary); text-decoration: underline;">View on GitHub →</a></p>
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

    // Simple CSV parser
    function parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue; // Skip empty lines

            const values = lines[i].split(',');
            const row = {};

            headers.forEach((header, index) => {
                row[header] = values[index] ? values[index].trim() : '';
            });

            data.push(row);
        }

        return data;
    }

    // Update vintage table with Google Sheets data
    function updateVintageTable(data) {
        const tbody = document.querySelector('.vintage-table tbody');
        if (!tbody) return;

        // Clear existing rows
        tbody.innerHTML = '';

        // Create rows from Google Sheets data
        data.forEach(row => {
            if (!row.id || !row.title) return;

            const images = row.images
                ? row.images.split(',').map(img => img.trim())
                : ['./img/placeholder.jpeg'];

            const firstImage = images[0];

            const tr = document.createElement('tr');
            tr.className = 'vintage-table-row';
            tr.setAttribute('data-entry', row.id);

            tr.innerHTML = `
                <td class="col-title">${row.title}</td>
                <td class="col-description">${row.shortDescription || ''}</td>
                <td class="col-icons">
                    ${row.icons ? row.icons.split(' ').map(icon =>
                        `<span class="table-icon">${icon}</span>`
                    ).join('') : ''}
                </td>
                <td class="vintage-table-thumbnail">
                    <img src="${firstImage}" alt="${row.title}">
                    <div class="vintage-table-hover-image">
                        <div class="hover-image-wrapper">
                            <img src="${firstImage}" alt="${row.title}">
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
