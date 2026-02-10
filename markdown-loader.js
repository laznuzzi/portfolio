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

    // Parse modal content - handles both images and text blocks
    // Format: ./img/1.png, [text: Title :: Body | Title :: Body | Title :: Body], ./img/2.png
    function parseModalContent(modalStr) {
        const items = [];
        const parts = modalStr.split(',');
        let i = 0;

        while (i < parts.length) {
            const part = parts[i].trim();

            // Check if this is a text block
            if (part.startsWith('[text:')) {
                // Collect the full text block (might span multiple comma-separated parts)
                let textContent = part;

                // If it doesn't end with ], keep collecting
                if (!part.endsWith(']')) {
                    i++;
                    while (i < parts.length && !parts[i].includes(']')) {
                        textContent += ',' + parts[i];
                        i++;
                    }
                    if (i < parts.length) {
                        textContent += ',' + parts[i];
                    }
                }

                // Extract content between [text: and ]
                const content = textContent.replace(/^\[text:\s*/, '').replace(/\]$/, '').trim();

                // Split by | to get columns
                const columns = content.split('|').map(col => {
                    const colTrim = col.trim();

                    // Check if column has title :: paragraph format
                    if (colTrim.includes('::')) {
                        const parts = colTrim.split('::');
                        return {
                            title: parts[0].trim(),
                            body: parts.slice(1).join('::').trim()
                        };
                    } else {
                        // Just body text
                        return {
                            title: '',
                            body: colTrim
                        };
                    }
                });

                items.push({
                    type: 'text-row',
                    columns: columns
                });
            } else if (part) {
                // Regular image/video path with optional caption
                // Format: ./img/file.png::Caption text
                let src = part;
                let caption = '';

                if (part.includes('::')) {
                    const parts = part.split('::');
                    src = parts[0].trim();
                    caption = parts.slice(1).join('::').trim();
                }

                items.push({
                    type: 'media',
                    src: src,
                    caption: caption
                });
            }

            i++;
        }

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

        // Build metadata grid (1x3: Company | Role+Timeline | Product/Engineering)
        // Tags are hidden but kept for later use in archives table
        const metadataGridHTML = `
            <div class="modal-metadata-grid">
                <div class="metadata-cell metadata-cell-company">${project.subtitle || ''}</div>
                <div class="metadata-cell metadata-cell-role-timeline">
                    <div>${project.role || ''}</div>
                    <div class="metadata-timeline">${project.timeline || ''}</div>
                </div>
                <div class="metadata-cell metadata-cell-people">
                    ${productHTML ? `<div class="people-group"><span class="people-label">Product</span><div class="people-names">${productHTML}</div></div>` : ''}
                    ${designEngineeringHTML ? `<div class="people-group"><span class="people-label">Design Engineering</span><div class="people-names">${designEngineeringHTML}</div></div>` : ''}
                    ${engineeringHTML ? `<div class="people-group"><span class="people-label">Engineering</span><div class="people-names">${engineeringHTML}</div></div>` : ''}
                </div>
                <div class="metadata-cell metadata-cell-tags" style="display: none;">${tagsHTML ? tagsHTML.replace('<div class="project-tags">', '').replace('</div>', '') : ''}</div>
            </div>
        `;

        return `
            <div class="modal-header-row">
                <div class="modal-title-column">
                    <h1>${project.title}</h1>
                    <button id="modal-close" class="modal-close-button" aria-label="Close modal">×</button>
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

            // Mark as locked
            if (project.locked) {
                card.setAttribute('data-locked', 'true');
            }

            // Check if hover is a video file
            const isVideo = /\.(mp4|mov|webm)$/i.test(hoverImage);
            const hoverMediaTag = isVideo
                ? `<video src="${hoverImage}" autoplay loop muted playsinline></video>`
                : `<img src="${hoverImage}" alt="${project.title}">`;

            // Generate tags HTML for card
            const cardTagsHTML = project.tags && project.tags.length > 0
                ? `<div class="card-tags">
                    ${project.tags.map(tag => {
                        const tagParts = tag.split(':');
                        const iconType = tagParts[0].trim().toLowerCase();
                        const tagText = tagParts.length > 1 ? tagParts.slice(1).join(':').trim() : tagParts[0].trim();
                        const icon = getTagIcon(iconType);

                        return `<span class="card-tag" data-tag="${iconType}">
                            ${icon ? `<span class="card-tag-icon">${icon}</span>` : ''}
                            <span class="card-tag-text">${tagText}</span>
                        </span>`;
                    }).join('')}
                </div>`
                : '';

            // Show lock icon in arrow column if locked, arrow if unlocked
            const arrowContent = project.locked
                ? '<div class="lock-icon"><img src="./img/lock.svg" alt="Locked" /></div>'
                : '→';
            const arrowClass = project.locked ? 'card-arrow card-arrow-locked' : 'card-arrow';

            card.innerHTML = `
                <div class="card-title">
                    <div class="title-content">
                        <span class="title-text">${project.title}</span>
                    </div>
                </div>
                <div class="card-subtitle">
                    <span class="subtitle-text">${project.subtitle || ''}</span>
                    ${cardTagsHTML}
                </div>
                <div class="card-description">${project.shortDescription || ''}</div>
                <div class="card-mobile-preview">
                    ${hoverMediaTag}
                </div>
                <div class="${arrowClass}">${arrowContent}</div>
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

        // Also populate test cards container
        updateTestCards(projects);

        // Trigger event for sections-nav.js
        window.dispatchEvent(new CustomEvent('archiveTableUpdated'));
    }

    // Update test cards container with individual card layout
    function updateTestCards(projects) {
        const testContainer = document.querySelector('.test-cards-container');
        if (!testContainer) return;

        // Clear existing
        testContainer.innerHTML = '';

        // Create individual cards
        projects.forEach((project, index) => {
            const card = document.createElement('div');
            card.className = 'test-project-card';
            card.setAttribute('data-entry', project.id);

            if (project.locked) {
                card.setAttribute('data-locked', 'true');
            }

            const arrowContent = project.locked
                ? '<div class="lock-icon"><img src="./img/lock.svg" alt="Locked" /></div>'
                : '→';

            card.innerHTML = `
                <div class="test-card-title">${project.title}</div>
                <div class="test-card-subtitle">${project.subtitle || ''}</div>
                <div class="test-card-description">${project.shortDescription || ''}</div>
                <div class="test-card-arrow">${arrowContent}</div>
            `;

            testContainer.appendChild(card);
        });

        console.log('Test cards updated with', projects.length, 'projects');
    }
})();
