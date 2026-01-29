// ==================== MARKDOWN CONTENT LOADER ====================
// Loads portfolio content from projects.md
//
// Edit projects.md to update all your content in one place:
// - Project metadata (thumbnail, hover, modal images)
// - Text content (role, timeline, context, description, etc.)
// - Lock status for password protection

(function() {
    console.log('Loading content from projects.md...');

    // Fetch projects.md
    fetch('./projects.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch projects.md');
            }
            return response.text();
        })
        .then(markdownText => {
            console.log('projects.md fetched successfully');

            // Parse markdown
            const projects = parseMarkdown(markdownText);

            // Convert to fileData format
            const fileData = {};

            projects.forEach((project, index) => {
                const content = generateHTML(project);

                fileData[project.id] = {
                    title: project.title,
                    role: project.role || '',
                    description: project.shortDescription || '',
                    images: project.modal,
                    content: content
                };
            });

            // Override window.fileData
            window.fileData = { ...window.fileData, ...fileData };

            console.log('Markdown data loaded:', Object.keys(fileData).length, 'projects');

            // Update table
            updateVintageTable(projects);
        })
        .catch(error => {
            console.error('Error loading markdown:', error);
            console.log('Falling back to file-content.js');
        });

    // Parse markdown into project objects
    function parseMarkdown(markdown) {
        const projects = [];

        // Split by project (h1 headers)
        const projectBlocks = markdown.split(/^# /m).filter(block => block.trim());

        projectBlocks.forEach(block => {
            const lines = block.split('\n');
            const project = {
                id: lines[0].trim(),
                title: lines[0].trim(),
                subtitle: '',
                thumbnail: '',
                hover: '',
                modal: [],
                locked: false,
                tags: [],
                role: '',
                timeline: '',
                context: '',
                description: '',
                techStack: '',
                githubLink: '',
                shortDescription: ''
            };

            let currentSection = '';
            let contentLines = [];

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();

                // Parse metadata
                if (line.startsWith('title:')) {
                    project.title = line.replace('title:', '').trim();
                } else if (line.startsWith('subtitle:')) {
                    project.subtitle = line.replace('subtitle:', '').trim();
                } else if (line.startsWith('shortDescription:')) {
                    project.shortDescription = line.replace('shortDescription:', '').trim();
                } else if (line.startsWith('thumbnail:')) {
                    project.thumbnail = line.replace('thumbnail:', '').trim();
                } else if (line.startsWith('hover:')) {
                    project.hover = line.replace('hover:', '').trim();
                } else if (line.startsWith('modal:')) {
                    const modalStr = line.replace('modal:', '').trim();
                    project.modal = modalStr.split(',').map(s => s.trim());
                } else if (line.startsWith('locked:')) {
                    project.locked = line.replace('locked:', '').trim() === 'true';
                } else if (line.startsWith('tags:')) {
                    const tagsStr = line.replace('tags:', '').trim();
                    project.tags = tagsStr.split(',').map(s => s.trim()).filter(s => s);
                }
                // Parse role/timeline (bold text)
                else if (line.startsWith('**Role:**')) {
                    project.role = line.replace('**Role:**', '').trim();
                } else if (line.startsWith('**Timeline:**')) {
                    project.timeline = line.replace('**Timeline:**', '').trim();
                }
                // Parse sections
                else if (line.startsWith('### ')) {
                    // Save previous section
                    if (currentSection && contentLines.length > 0) {
                        const sectionContent = contentLines.join('\n').trim();
                        if (currentSection === 'Context') project.context = sectionContent;
                        else if (currentSection === 'Description') project.description = sectionContent;
                        else if (currentSection === 'Tech Stack') project.techStack = sectionContent;
                        else if (currentSection === 'Links') {
                            const linkMatch = sectionContent.match(/\[.*?\]\((.*?)\)/);
                            if (linkMatch) project.githubLink = linkMatch[1];
                        }
                    }
                    // Start new section
                    currentSection = line.replace('### ', '').trim();
                    contentLines = [];
                } else if (line && !line.startsWith('---')) {
                    contentLines.push(line);
                }
            }

            // Save last section
            if (currentSection && contentLines.length > 0) {
                const sectionContent = contentLines.join('\n').trim();
                if (currentSection === 'Context') project.context = sectionContent;
                else if (currentSection === 'Description') project.description = sectionContent;
                else if (currentSection === 'Tech Stack') project.techStack = sectionContent;
                else if (currentSection === 'Links') {
                    const linkMatch = sectionContent.match(/\[.*?\]\((.*?)\)/);
                    if (linkMatch) project.githubLink = linkMatch[1];
                }
            }

            // Generate short description from description if not provided
            if (!project.shortDescription && project.description) {
                project.shortDescription = project.description.split('.')[0] + '.';
            }

            projects.push(project);
        });

        return projects;
    }

    // Get icon SVG for tag type
    function getTagIcon(tagType) {
        const icons = {
            box: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4L8 1L14 4V12L8 15L2 12V4Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 4L8 7L14 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M8 7V15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
            construction: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 2L3 6H13L9 2H7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 6V14H13V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 9H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M6 12H10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`,
            code: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 6L2 8L5 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M11 6L14 8L11 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 4L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`
        };
        return icons[tagType.toLowerCase()] || '';
    }

    // Generate HTML content for modal
    function generateHTML(project) {
        const tagsHTML = project.tags && project.tags.length > 0 
            ? `<div class="project-tags">
                ${project.tags.map(tag => {
                    // Parse tag format: "iconType:Custom Text" or just "iconType"
                    const tagParts = tag.split(':');
                    const iconType = tagParts[0].trim().toLowerCase();
                    const tagText = tagParts.length > 1 ? tagParts.slice(1).join(':').trim() : tagParts[0].trim();
                    const icon = getTagIcon(iconType);
                    
                    return `<span class="project-tag" data-tag="${iconType}">
                        ${icon ? `<span class="project-tag-icon">${icon}</span>` : ''}
                        <span class="project-tag-text">${tagText}</span>
                    </span>`;
                }).join('')}
            </div>`
            : '';

        return `
            <div class="modal-row modal-row-1">
                <div class="modal-column">
                    <h1>${project.title}</h1>
                </div>
                <div class="modal-column">
                    <!-- Empty column -->
                </div>
                <div class="modal-column modal-close-column">
                    <button id="modal-close" class="modal-close-button" aria-label="Close modal">×</button>
                </div>
            </div>

            <div class="modal-row modal-row-2">
                <div class="modal-column">
                    ${tagsHTML}
                </div>
                <div class="modal-column">
                    ${project.subtitle ? `<p class="modal-company">${project.subtitle}</p>` : ''}
                </div>
                <div class="modal-column">
                    ${project.role ? `<p class="modal-role">${project.role}</p>` : ''}
                </div>
            </div>

            <div class="modal-row modal-row-3">
                ${project.context ? `
                    <div class="modal-column">
                        <h2>Context</h2>
                        <p>${project.context}</p>
                    </div>
                ` : '<div class="modal-column"></div>'}

                <div class="modal-column">
                    <h2>Work</h2>
                    <p>${project.description || 'Project description coming soon.'}</p>
                </div>

                ${project.techStack ? `
                    <div class="modal-column">
                        <h2>Tech details</h2>
                        <p>${project.techStack}</p>
                    </div>
                ` : '<div class="modal-column"></div>'}
            </div>

            ${project.githubLink ? `
                <div class="modal-row modal-row-links">
                    <div class="modal-column">
                        <h2>Links</h2>
                        <p><a href="${project.githubLink}" target="_blank" rel="noopener noreferrer">View on GitHub →</a></p>
                    </div>
                </div>
            ` : ''}
        `;
    }

    // Update archive cards
    function updateVintageTable(projects) {
        const container = document.querySelector('.cards-container');
        if (!container) return;

        // Save the header element before clearing
        const header = container.querySelector('.cards-header');

        // Clear existing cards
        container.innerHTML = '';

        // Re-add the header if it existed
        if (header) {
            container.appendChild(header);
        }

        // Create cards
        projects.forEach((project, index) => {
            const firstImage = project.thumbnail || './img/placeholder.jpeg';
            const hoverImage = project.hover || firstImage;

            const card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-entry', project.id);

            // Add lock icon SVG for locked projects
            const lockIcon = project.locked ? '<div class="lock-icon"><img src="./img/lock.svg" alt="Locked" /></div>' : '';

            // Mark as locked
            if (project.locked) {
                card.setAttribute('data-locked', 'true');
            }

            // Check if hover is a video file
            const isVideo = /\.(mp4|mov|webm)$/i.test(hoverImage);
            const hoverMediaTag = isVideo
                ? `<video src="${hoverImage}" autoplay loop muted playsinline></video>`
                : `<img src="${hoverImage}" alt="${project.title}">`;

            card.innerHTML = `
                <div class="card-lock-column">
                    ${lockIcon}
                </div>
                <div class="card-title">
                    <div class="title-content">
                        <span class="title-text">${project.title}</span>
                    </div>
                </div>
                <div class="card-subtitle">
                    <span class="subtitle-text">${project.subtitle || ''}</span>
                </div>
                <div class="card-description">${project.shortDescription || ''}</div>
                <div class="card-mobile-preview">
                    ${hoverMediaTag}
                </div>
                <div class="card-arrow">→</div>
                <div class="card-thumbnail">
                    <div class="thumbnail-wrapper">
                        <img src="${firstImage}" alt="${project.title}">
                        <div class="hover-preview">
                            <div class="hover-image-wrapper">
                                ${hoverMediaTag}
                            </div>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        console.log('Archive cards updated with', projects.length, 'projects');

        // Trigger event for sections-nav.js
        window.dispatchEvent(new CustomEvent('archiveTableUpdated'));
    }
})();
