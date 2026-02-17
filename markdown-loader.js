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

            // Update Layout 1 (featured cards)
            updateLayout1(projects);
        })
        .catch(error => {
            console.error('Error loading markdown:', error);
            console.log('Falling back to file-content.js');
        });

    // Parse modal content - handles images and videos with optional captions
    // Format: ./img/1.png, ./img/2.png::Caption text, ./video.mp4::Video caption
    function parseModalContent(modalStr) {
        const items = [];
        const parts = modalStr.split(',');

        parts.forEach(part => {
            const trimmed = part.trim();
            if (!trimmed) return;

            // Image/video path with optional caption
            // Format: ./img/file.png::Caption text
            let src = trimmed;
            let caption = '';

            if (trimmed.includes('::')) {
                const splitParts = trimmed.split('::');
                src = splitParts[0].trim();
                caption = splitParts.slice(1).join('::').trim();
            }

            items.push({
                type: 'media',
                src: src,
                caption: caption
            });
        });

        return items;
    }

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
                logo: '',
                thumbnail: '',
                hover: '',
                modal: [],
                locked: false,
                tags: [],
                role: '',
                timeline: '',
                people: [],
                category: 'work',
                context: '',
                description: '',
                techStack: '',
                githubLink: '',
                shortDescription: '',
                title1: 'Context',
                title2: 'Work',
                title3: 'Tech details'
            };

            let currentSection = '';
            let contentLines = [];
            let sectionIndex = 0; // Track which section we're on (0, 1, 2)

            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();

                // Parse metadata
                if (line.startsWith('title:')) {
                    project.title = line.replace('title:', '').trim();
                } else if (line.startsWith('subtitle:')) {
                    project.subtitle = line.replace('subtitle:', '').trim();
                } else if (line.startsWith('logo:')) {
                    project.logo = line.replace('logo:', '').trim();
                } else if (line.startsWith('shortDescription:')) {
                    project.shortDescription = line.replace('shortDescription:', '').trim();
                } else if (line.startsWith('thumbnail:')) {
                    project.thumbnail = line.replace('thumbnail:', '').trim();
                } else if (line.startsWith('hover:')) {
                    project.hover = line.replace('hover:', '').trim();
                } else if (line.startsWith('modal:')) {
                    const modalStr = line.replace('modal:', '').trim();
                    project.modal = parseModalContent(modalStr);
                } else if (line.startsWith('locked:')) {
                    project.locked = line.replace('locked:', '').trim() === 'true';
                } else if (line.startsWith('tags:')) {
                    const tagsStr = line.replace('tags:', '').trim();
                    project.tags = tagsStr.split(',').map(s => s.trim()).filter(s => s);
                } else if (line.startsWith('role:')) {
                    project.role = line.replace('role:', '').trim();
                } else if (line.startsWith('timeline:')) {
                    project.timeline = line.replace('timeline:', '').trim();
                } else if (line.startsWith('people:')) {
                    const peopleStr = line.replace('people:', '').trim();
                    project.people = peopleStr.split(',').map(s => s.trim()).filter(s => s);
                } else if (line.startsWith('title1:')) {
                    project.title1 = line.replace('title1:', '').trim();
                } else if (line.startsWith('title2:')) {
                    project.title2 = line.replace('title2:', '').trim();
                } else if (line.startsWith('title3:')) {
                    project.title3 = line.replace('title3:', '').trim();
                } else if (line.startsWith('category:')) {
                    project.category = line.replace('category:', '').trim();
                }
                // Parse role/timeline (old bold text format - fallback)
                else if (line.startsWith('**Role:**')) {
                    project.role = line.replace('**Role:**', '').trim();
                } else if (line.startsWith('**Timeline:**')) {
                    project.timeline = line.replace('**Timeline:**', '').trim();
                }
                // Parse sections (match ### with or without space)
                else if (line.startsWith('###')) {
                    // Save previous section by index
                    if (contentLines.length > 0) {
                        const sectionContent = contentLines.join('\n').trim();
                        if (sectionIndex === 0) project.context = sectionContent;
                        else if (sectionIndex === 1) project.description = sectionContent;
                        else if (sectionIndex === 2) project.techStack = sectionContent;
                    }
                    // Move to next section
                    if (contentLines.length > 0 || sectionIndex > 0) {
                        sectionIndex++;
                    }
                    // Start new section
                    currentSection = line.replace(/^###\s*/, '').trim();
                    contentLines = [];
                } else if (line && !line.startsWith('---')) {
                    contentLines.push(line);
                }
            }

            // Save last section by index
            if (contentLines.length > 0) {
                const sectionContent = contentLines.join('\n').trim();
                if (sectionIndex === 0) project.context = sectionContent;
                else if (sectionIndex === 1) project.description = sectionContent;
                else if (sectionIndex === 2) project.techStack = sectionContent;
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

        // Parse people by role (PM = Product, ENG = Engineering, DEng = Design Engineering)
        const productPeople = [];
        const engineeringPeople = [];
        const designEngineeringPeople = [];

        if (project.people && project.people.length > 0) {
            project.people.forEach(person => {
                const personTrim = person.trim();
                const personLower = personTrim.toLowerCase();

                if (personLower.includes('(deng)')) {
                    designEngineeringPeople.push(personTrim.replace(/\s*\(DEng\)\s*/i, ''));
                } else if (personLower.includes('(pm)')) {
                    productPeople.push(personTrim.replace(/\s*\(PM\)\s*/i, ''));
                } else if (personLower.includes('(eng)')) {
                    engineeringPeople.push(personTrim.replace(/\s*\(ENG\)\s*/i, ''));
                } else {
                    // Default to product if no role specified
                    productPeople.push(personTrim);
                }
            });
        }

        const productHTML = productPeople.length > 0 ? productPeople.join(', ') : '';
        const engineeringHTML = engineeringPeople.length > 0 ? engineeringPeople.join(', ') : '';
        const designEngineeringHTML = designEngineeringPeople.length > 0 ? designEngineeringPeople.join(', ') : '';

        // Build metadata grid (3 centered rows: Company, Timeline, Role)
        const metadataGridHTML = `
            <div class="modal-metadata-grid">
                <div class="metadata-cell metadata-cell-company">
                    ${project.subtitle || ''}
                </div>
                <div class="metadata-cell metadata-cell-timeline">
                    ${project.timeline || ''}
                </div>
                <div class="metadata-cell metadata-cell-role">
                    ${project.role || ''}
                </div>
            </div>
        `;

        return `
            <div class="modal-header-row">
                <div class="modal-title-column">
                    <h1>${project.title}</h1>
                    <button id="modal-close" class="modal-close-button" aria-label="Close modal">X</button>
                </div>
                ${metadataGridHTML}
            </div>

            <div class="modal-row modal-row-3">
                ${project.context ? `
                    <div class="modal-column">
                        <h2>${project.title1}</h2>
                        <p>${project.context}</p>
                    </div>
                ` : '<div class="modal-column"></div>'}

                <div class="modal-column">
                    <h2>${project.title2}</h2>
                    <p>${project.description || 'Project description coming soon.'}</p>
                </div>

                ${project.techStack ? `
                    <div class="modal-column">
                        <h2>${project.title3}</h2>
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

    // Update Layout 1 - Featured card layout (replaces old table)
    function updateLayout1(projects) {
        const container = document.querySelector('.layout-1-container');
        if (!container) {
            console.error('Layout 1 container not found in DOM');
            return;
        }

        console.log('Updating Layout 1 with', projects.length, 'projects');

        // Clear existing
        container.innerHTML = '';

        // Create featured cards for each project
        projects.forEach((project) => {
            const card = document.createElement('div');
            card.className = 'featured-card';
            card.setAttribute('data-entry', project.id);
            card.setAttribute('data-category', project.category || 'work');

            if (project.locked) {
                card.setAttribute('data-locked', 'true');
            }

            const thumbnailImage = project.thumbnail || './img/placeholder.jpeg';
            const hoverImage = project.hover || project.thumbnail || './img/placeholder.jpeg';
            const arrowContent = project.locked
                ? '<img src="./img/lock.svg" alt="Locked" />'
                : '→';

            // Extract year from timeline if possible
            const timelineYear = project.timeline.match(/\d{4}/)?.[0] || '';

            card.innerHTML = `
                <h3 class="featured-card-title">${project.title}</h3>
                <p class="featured-card-description">${project.shortDescription || ''}</p>
                <div class="featured-card-image">
                    <img src="${thumbnailImage}" alt="${project.title}">
                </div>
                <div class="featured-card-meta">
                    <span class="featured-card-company">${project.subtitle || ''}</span>
                    <span class="featured-card-year">${timelineYear}</span>
                    <div class="featured-card-arrow">${arrowContent}</div>
                </div>
                <div class="hover-preview">
                    <div class="hover-image-wrapper">
                        <img src="${hoverImage}" alt="${project.title} hover">
                    </div>
                </div>
            `;

            container.appendChild(card);
        });

        console.log('Layout 1 complete:', container.children.length, 'cards created');

        // Dispatch event so sections-nav.js can set up click handlers
        window.dispatchEvent(new CustomEvent('layout1Updated'));
    }

})();
