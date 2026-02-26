// ==================== CV EXPERIENCE LOADER ====================
// Loads experience content from a versioned markdown file.
//
// Usage:
//   cv.html          → loads cv-default.md
//   cv.html?v=ai     → loads cv-ai.md
//   cv.html?v=systems → loads cv-systems.md
//
// To create a new version, duplicate cv-default.md and rename it.

(function () {
    const version = new URLSearchParams(window.location.search).get('v') || 'default';
    const file = `./cv-${version}.md`;

    fetch(file)
        .then(response => {
            if (!response.ok) throw new Error(`Could not load ${file}`);
            return response.text();
        })
        .then(text => {
            const entries = parseExperience(text);
            renderExperience(entries);
        })
        .catch(err => {
            console.error('CV loader error:', err);
        });

    // Parse markdown into entry objects.
    // Each entry is separated by --- and has optional metadata fields
    // (company:, role:, date:) followed by body paragraphs.
    function parseExperience(text) {
        return text
            .split(/\n---\n/)
            .map(block => block.trim())
            .filter(Boolean)
            .map(block => {
                const lines = block.split('\n');
                const entry = { company: null, role: '', date: '', paragraphs: [] };
                let inBody = false;
                let bodyLines = [];

                for (const line of lines) {
                    if (line.startsWith('# ')) {
                        // ID line — skip
                        continue;
                    } else if (!inBody && line.startsWith('company:')) {
                        entry.company = line.replace('company:', '').trim();
                    } else if (!inBody && line.startsWith('role:')) {
                        entry.role = line.replace('role:', '').trim();
                    } else if (!inBody && line.startsWith('date:')) {
                        entry.date = line.replace('date:', '').trim();
                    } else if (!inBody && line.trim() === '') {
                        // Blank line after metadata signals start of body
                        inBody = true;
                    } else if (inBody) {
                        bodyLines.push(line);
                    }
                }

                // Split body into paragraphs on blank lines
                entry.paragraphs = bodyLines
                    .join('\n')
                    .split(/\n\n+/)
                    .map(p => p.trim())
                    .filter(Boolean);

                return entry;
            });
    }

    // Build and inject HTML into .cv-experience
    function renderExperience(entries) {
        const container = document.querySelector('.cv-experience');
        if (!container) return;

        container.innerHTML = entries.map(entry => {
            const companyHTML = entry.company
                ? `<div class="cv-experience-company">${entry.company}</div>`
                : '';

            const paragraphsHTML = entry.paragraphs
                .map(p => `<p>${p}</p>`)
                .join('');

            return `
<div class="cv-experience-item">
    ${companyHTML}
    <div class="cv-experience-role-date">
        <div class="cv-experience-role">${entry.role}</div>
        <div class="cv-experience-date">${entry.date}</div>
    </div>
    <div class="cv-experience-description">
        ${paragraphsHTML}
    </div>
</div>`;
        }).join('\n');
    }
})();
