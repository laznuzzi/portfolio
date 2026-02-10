// ==================== FINDER NAVIGATION SCRIPT ====================
// Handles file clicks and modal display with drag functionality

(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        console.log('Init called, fileData:', window.fileData);
        setupFinderNavigation();
    }

    // File content data is loaded from file-content.js (window.fileData)
    const fileData = window.fileData;

    if (!fileData) {
        console.error('fileData not loaded! Make sure file-content.js is loaded before sections-nav.js');
    }

    // Drag functionality removed

    // Resize functionality
    let isResizing = false;
    let startWidth;
    let startHeight;
    let startMouseX;
    let startMouseY;

    // Simplified modal - no tabs or multi-document tracking

    // Shared variables for vintage table
    let currentHoverImage = null;
    let currentRowIndex = -1;
    let hoverImageContainer = null;

    // ==================== PASSWORD PROTECTION ====================
    // TO CHANGE PASSWORD:
    // 1. Open browser console
    // 2. Run: await crypto.subtle.digest('SHA-256', new TextEncoder().encode('yourpassword')).then(h => console.log(Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2, '0')).join('')))
    // 3. Copy the hash and replace CORRECT_PASSWORD_HASH below
    // Current password: 'trex'
    const CORRECT_PASSWORD_HASH = '952cb748748ecca52fd1a217778b06a9163ab118d53104c64414559e8212db68'; // SHA-256 hash of 'trex'
    const UNLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    let pendingEntryId = null;
    let pendingRow = null;
    let pendingHoverImageRect = null;

    // Hash password using SHA-256
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hash));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Check if projects are currently unlocked
    function areProjectsUnlocked() {
        const unlockExpiry = localStorage.getItem('projectsUnlockedUntil');
        if (unlockExpiry && Date.now() < parseInt(unlockExpiry)) {
            return true;
        }
        // Clean up expired unlock
        localStorage.removeItem('projectsUnlockedUntil');
        return false;
    }

    // Hide all lock icons and replace with arrows
    function hideLockIcons() {
        const cards = document.querySelectorAll('.project-card[data-locked="true"]');
        cards.forEach(card => {
            const arrowColumn = card.querySelector('.card-arrow');
            if (arrowColumn) {
                const lockIcon = arrowColumn.querySelector('.lock-icon');
                if (lockIcon) {
                    arrowColumn.innerHTML = '→';
                    arrowColumn.classList.remove('card-arrow-locked');
                }
            }
        });
    }

    // Show all lock icons (replace arrows with lock icons for locked projects)
    function showLockIcons() {
        const cards = document.querySelectorAll('.project-card[data-locked="true"]');
        cards.forEach(card => {
            const arrowColumn = card.querySelector('.card-arrow');
            if (arrowColumn && !arrowColumn.querySelector('.lock-icon')) {
                arrowColumn.innerHTML = '<div class="lock-icon"><img src="./img/lock.svg" alt="Locked" /></div>';
                arrowColumn.classList.add('card-arrow-locked');
            }
        });
    }

    // Show password modal
    function showPasswordModal(entryId, row, hoverImageRect) {
        pendingEntryId = entryId;
        pendingRow = row;
        pendingHoverImageRect = hoverImageRect;

        const modal = document.getElementById('password-modal');
        const input = document.getElementById('password-input');
        const error = document.getElementById('password-error');

        if (modal && input) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            error.style.display = 'none';
            input.value = '';

            // Focus input after a brief delay
            setTimeout(() => input.focus(), 100);
        }
    }

    // Hide password modal
    function hidePasswordModal() {
        const modal = document.getElementById('password-modal');
        const input = document.getElementById('password-input');
        const error = document.getElementById('password-error');

        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
            error.style.display = 'none';
            input.value = '';
        }

        pendingEntryId = null;
        pendingRow = null;
        pendingHoverImageRect = null;
    }

    // Verify password and unlock
    async function verifyAndUnlock() {
        const input = document.getElementById('password-input');
        const error = document.getElementById('password-error');
        const password = input.value;

        if (!password) {
            error.textContent = 'Please enter a password';
            error.style.display = 'block';
            return;
        }

        const hash = await hashPassword(password);

        if (hash === CORRECT_PASSWORD_HASH) {
            // Store unlock state with expiry
            const expiry = Date.now() + UNLOCK_DURATION;
            localStorage.setItem('projectsUnlockedUntil', expiry);

            // Hide all lock icons since projects are now unlocked
            hideLockIcons();

            // Store pending values before hiding modal (hidePasswordModal clears them)
            const entryToOpen = pendingEntryId;
            const rowToOpen = pendingRow;
            const rectToOpen = pendingHoverImageRect;

            // Hide modal
            hidePasswordModal();

            // Open the project modal that triggered the password prompt
            if (entryToOpen) {
                openVintageTableModal(entryToOpen, rowToOpen, rectToOpen);
            }
        } else {
            error.textContent = 'Incorrect password';
            error.style.display = 'block';
            input.value = '';
            input.focus();
        }
    }

    // Setup password modal event listeners
    function setupPasswordModal() {
        const unlockButton = document.getElementById('unlock-button');
        const cancelButton = document.getElementById('cancel-password-button');
        const input = document.getElementById('password-input');
        const overlay = document.querySelector('.password-modal-overlay');

        if (unlockButton) {
            unlockButton.addEventListener('click', verifyAndUnlock);
        }

        if (cancelButton) {
            cancelButton.addEventListener('click', hidePasswordModal);
        }

        if (overlay) {
            overlay.addEventListener('click', hidePasswordModal);
        }

        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    verifyAndUnlock();
                }
            });
        }

        // Expose helper function to console for easy password hash generation
        window.generatePasswordHash = async function(password) {
            const hash = await hashPassword(password);
            console.log('Password Hash for "' + password + '":');
            console.log(hash);
            console.log('\nReplace CORRECT_PASSWORD_HASH in sections-nav.js with this hash.');
            return hash;
        };

        console.log('💡 To generate a new password hash, run: generatePasswordHash("yourpassword")');
    }

    // Show password overlay inside modal
    function showModalPasswordOverlay(entryId, modalContent) {
        // Create overlay if it doesn't exist
        let overlay = document.getElementById('modal-password-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'modal-password-overlay';
            overlay.className = 'modal-password-overlay';
            overlay.innerHTML = `
                <div class="modal-password-content">
                    <img src="./img/lock.svg" alt="Locked" class="modal-password-lock-icon" />
                    <h2 class="modal-password-title">This project is locked</h2>
                    <input type="password" id="modal-password-input" class="modal-password-input" placeholder="Password" />
                    <div class="modal-password-buttons">
                        <button id="modal-unlock-button" class="password-button password-button-primary">Unlock</button>
                    </div>
                    <p id="modal-password-error" class="password-error" style="display: none;">Incorrect password</p>
                </div>
            `;
        }

        // Add to modal
        modalContent.appendChild(overlay);

        // Setup event listeners
        const input = overlay.querySelector('#modal-password-input');
        const unlockBtn = overlay.querySelector('#modal-unlock-button');
        const error = overlay.querySelector('#modal-password-error');

        // Focus input
        setTimeout(() => input.focus(), 100);

        // Handle unlock
        const handleUnlock = async () => {
            const password = input.value;

            if (!password) {
                error.textContent = 'Please enter a password';
                error.style.display = 'block';
                return;
            }

            const hash = await hashPassword(password);

            if (hash === CORRECT_PASSWORD_HASH) {
                // Store unlock state
                const expiry = Date.now() + UNLOCK_DURATION;
                localStorage.setItem('projectsUnlockedUntil', expiry);

                // Hide all lock icons
                hideLockIcons();

                // Remove blur and hide overlay
                modalContent.classList.remove('modal-locked');
                hideModalPasswordOverlay();
            } else {
                error.textContent = 'Incorrect password';
                error.style.display = 'block';
                input.value = '';
                input.focus();
            }
        };

        unlockBtn.addEventListener('click', handleUnlock);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleUnlock();
            }
        });
    }

    // Hide password overlay inside modal
    function hideModalPasswordOverlay() {
        const overlay = document.getElementById('modal-password-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    // Open modal for vintage table entries - defined at module scope
    function openVintageTableModal(entryId, row, hoverImageRect, isLocked = false) {
        console.log('openVintageTableModal called with:', entryId, 'isLocked:', isLocked);
        // Get entry data from fileData
        const entry = window.fileData[entryId];

        if (!entry) {
            console.error('Entry not found:', entryId);
            console.log('Available entries:', Object.keys(window.fileData || {}));
            return;
        }

        console.log('Entry found:', entry);

        const modal = document.getElementById('project-modal');
        const modalContent = document.getElementById('project-modal-content');
        const imageContainer = document.getElementById('modal-image-container');
        const textContainer = document.getElementById('modal-text-container');

        console.log('Modal elements found:', {
            modal: !!modal,
            modalContent: !!modalContent,
            imageContainer: !!imageContainer,
            textContainer: !!textContainer
        });

        if (!modal || !modalContent || !imageContainer || !textContainer) {
            console.error('Modal elements not found - one or more elements missing');
            return;
        }

        // Hide hover image immediately
        if (hoverImageContainer) {
            hoverImageContainer.classList.remove('visible');
        }

        // Create image/video grid HTML from entry data
        const images = (entry.images && Array.isArray(entry.images) && entry.images.length > 0)
            ? entry.images
            : ['./img/placeholder.jpeg'];
        console.log('Modal images/videos:', images);
        console.log('Entry object:', entry);

        const mediaHTML = images.map((item, index) => {
            // Handle structured format (new) or legacy string format (old)
            if (typeof item === 'string') {
                // Legacy format: plain string path
                const mediaPath = item;
                const isVideo = /\.(mp4|mov|webm)$/i.test(mediaPath);
                console.log(`Media ${index}: ${mediaPath}, isVideo: ${isVideo}`);

                if (isVideo) {
                    return `
                        <video src="${mediaPath}"
                               autoplay
                               muted
                               loop
                               playsinline
                               preload="auto">
                            Your browser does not support the video tag.
                        </video>
                    `;
                } else {
                    return `
                        <img src="${mediaPath}"
                             alt="${entry.title} - Image ${index + 1}">
                    `;
                }
            } else if (item.type === 'media') {
                // New format: media object with optional caption
                const mediaPath = item.src;
                const caption = item.caption || '';
                const isVideo = /\.(mp4|mov|webm)$/i.test(mediaPath);
                console.log(`Media ${index}: ${mediaPath}, isVideo: ${isVideo}, caption: ${caption}`);

                const captionHTML = caption ? `<div class="modal-media-caption">${caption}</div>` : '';

                let mediaHTML;
                if (isVideo) {
                    mediaHTML = `
                        <video src="${mediaPath}"
                               autoplay
                               muted
                               loop
                               playsinline
                               preload="auto">
                            Your browser does not support the video tag.
                        </video>
                    `;
                } else {
                    mediaHTML = `
                        <img src="${mediaPath}"
                             alt="${entry.title} - Image ${index + 1}">
                    `;
                }

                return `<div class="modal-media-item">${captionHTML}${mediaHTML}</div>`;
            } else if (item.type === 'text-row') {
                // New format: text row with columns
                const columnsHTML = item.columns.map(col => {
                    const titleHTML = col.title ? `<h3>${col.title}</h3>` : '';
                    const bodyHTML = col.body ? `<p>${col.body}</p>` : '';
                    return `<div class="modal-text-column">${titleHTML}${bodyHTML}</div>`;
                }).join('');

                return `<div class="modal-text-row">${columnsHTML}</div>`;
            }

            return ''; // Fallback for unknown types
        }).join('');

        // Ensure we have content to display
        if (!mediaHTML || mediaHTML.trim() === '') {
            console.warn('No media HTML generated, using fallback');
            imageContainer.innerHTML = `<img src="./img/placeholder.jpeg" alt="Placeholder">`;
        } else {
            imageContainer.innerHTML = mediaHTML;
        }

        // Set text content from entry data
        textContainer.innerHTML = entry.content;

        // Clear any existing modal-row-1 elements from previous modal opens
        const existingRow1 = modalContent.querySelectorAll('.modal-row-1');
        existingRow1.forEach(el => {
            if (el.parentElement === modalContent) {
                el.remove();
            }
        });

        // Move modal-row-1 to be a direct child of modalContent for sticky positioning
        const row1 = textContainer.querySelector('.modal-row-1');
        if (row1) {
            modalContent.insertBefore(row1, modalContent.firstChild);
        }

        // Show modal with slide-up animation
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        // Always remove any locked state (password is validated before modal opens)
        modalContent.classList.remove('modal-locked');
        hideModalPasswordOverlay();

        // Trigger animation after display is set
        requestAnimationFrame(() => {
            modal.classList.add('active');
        });

        console.log('Modal opened with slide-up animation');
    }

    // Setup archive cards (can be called multiple times)
    function setupTableRows() {
        const projectCards = document.querySelectorAll('.project-card');
        const modal = document.getElementById('project-modal');

        console.log('Setting up archive project cards:', projectCards.length);

        // Create a single shared hover image container (based on original repo)
        function createSharedHoverContainer() {
            if (!hoverImageContainer) {
                hoverImageContainer = document.createElement('div');
                hoverImageContainer.className = 'hover-preview';

                // Create slider container (like modalSlider in original)
                const slider = document.createElement('div');
                slider.className = 'hover-image-slider';

                // Create individual image containers for each card
                projectCards.forEach((card, index) => {
                    const hoverImage = card.querySelector('.hover-preview');
                    const imgElement = hoverImage?.querySelector('img');
                    const videoElement = hoverImage?.querySelector('video');

                    if (imgElement || videoElement) {
                        const imageContainer = document.createElement('div');
                        imageContainer.className = 'hover-image-item';

                        if (videoElement) {
                            // Clone video element for hover
                            const video = document.createElement('video');
                            video.src = videoElement.src;
                            video.autoplay = true;
                            video.loop = true;
                            video.muted = true;
                            video.playsInline = true;
                            video.style.width = '100%';
                            video.style.height = 'auto';
                            imageContainer.appendChild(video);

                            // Explicitly play video after appending
                            video.play().catch(err => console.log('Video autoplay prevented:', err));
                        } else if (imgElement) {
                            // Clone image element for hover
                            const img = document.createElement('img');
                            img.src = imgElement.src;
                            img.alt = imgElement.alt;
                            imageContainer.appendChild(img);
                        }

                        slider.appendChild(imageContainer);
                    }
                });

                hoverImageContainer.appendChild(slider);
                document.body.appendChild(hoverImageContainer);
            }
            return hoverImageContainer;
        }

        projectCards.forEach((card, index) => {
            const hoverImage = card.querySelector('.hover-preview');
            const imageWrapper = hoverImage?.querySelector('.hover-image-wrapper');
            const imgElement = hoverImage?.querySelector('img');
            const videoElement = hoverImage?.querySelector('video');
            const hasMedia = imgElement || videoElement;

            if (hoverImage && imageWrapper && hasMedia) {
                // Track mouse movement anywhere on the card
                card.addEventListener('mouseenter', (e) => {
                    const container = createSharedHoverContainer();
                    const slider = container.querySelector('.hover-image-slider');

                    if (!slider) {
                        console.error('Slider not found');
                        return;
                    }

                    // Show container and position it
                    const mouseX = e.clientX;
                    const mouseY = e.clientY;
                    container.style.left = `${mouseX}px`;
                    container.style.top = `${mouseY}px`;
                    container.classList.add('visible');

                    // Update slider position based on card index (like original: top: index * -100 + "%")
                    slider.style.top = `${index * -100}%`;

                    currentHoverImage = hoverImage;
                    currentRowIndex = index;
                });

                card.addEventListener('mousemove', (e) => {
                    if (hoverImageContainer && currentRowIndex === index) {
                        const mouseX = e.clientX;
                        const mouseY = e.clientY;

                    // Use GSAP for smooth following (like original repo)
                    if (typeof gsap !== 'undefined') {
                        gsap.to(hoverImageContainer, {
                            left: mouseX,
                            top: mouseY,
                            duration: 0.8,
                            ease: "power3"
                        });
                    } else {
                        // Fallback to direct positioning
                        hoverImageContainer.style.left = `${mouseX}px`;
                        hoverImageContainer.style.top = `${mouseY}px`;
                    }
                    }
                });

                card.addEventListener('mouseleave', () => {
                    if (hoverImageContainer && currentRowIndex === index) {
                        hideHoverImage();
                    }
                });
            }

            // Click handler
            card.addEventListener('click', (e) => {
                const entryId = card.getAttribute('data-entry');
                const isLocked = card.getAttribute('data-locked') === 'true';

                console.log('Card clicked, entryId:', entryId, 'isLocked:', isLocked);
                console.log('fileData:', window.fileData);
                console.log('Entry exists:', !!window.fileData[entryId]);

                // Get hover image position before it disappears
                const hoverImageRect = hoverImageContainer ? hoverImageContainer.getBoundingClientRect() : null;

                // If locked and not unlocked, show password modal FIRST
                if (isLocked && !areProjectsUnlocked()) {
                    console.log('Showing password modal before opening project');
                    showPasswordModal(entryId, card, hoverImageRect);
                } else {
                    // Not locked or already unlocked - open modal directly
                    console.log('Opening project modal directly');
                    openVintageTableModal(entryId, card, hoverImageRect, false);
                }
            });
        });

        // Check if projects are already unlocked and hide lock icons
        if (areProjectsUnlocked()) {
            hideLockIcons();
        }

        // Helper function for hiding hover image
        function hideHoverImage() {
            if (hoverImageContainer) {
                hoverImageContainer.classList.remove('visible');
                currentRowIndex = -1;
            }
        }
    }

    // Finder navigation functionality
    function setupFinderNavigation() {
        console.log('setupFinderNavigation called');
        // Support both old .page-file buttons and new .project-card elements
        const fileButtons = document.querySelectorAll('.page-file, .project-card');
        const modal = document.getElementById('project-modal');

        // Setup project cards initially
        setupTableRows();

        // Setup password modal
        setupPasswordModal();

        // Listen for archive updates
        window.addEventListener('archiveTableUpdated', () => {
            console.log('Archive cards updated event received, re-initializing...');
            // Remove old hover container if it exists
            if (hoverImageContainer) {
                hoverImageContainer.remove();
                hoverImageContainer = null;
            }
            // Re-setup project cards
            setupTableRows();
        });

        const modalContent = document.getElementById('project-modal-content');
        const modalOverlay = modal?.querySelector('.project-modal-overlay');
        const modalTitlebar = document.getElementById('modal-titlebar');
        const modalClose = document.getElementById('modal-close');
        const modalTitle = document.getElementById('modal-file-title');
        const modalDocumentsContainer = document.getElementById('modal-documents-container');

        console.log('Found elements:', {
            fileButtons: fileButtons.length,
            modal: !!modal,
            modalContent: !!modalContent,
            fileData: !!fileData
        });

        // Popover element
        const popover = document.getElementById('file-popover');
        const popoverTitle = popover?.querySelector('.popover-title');
        const popoverRole = popover?.querySelector('.popover-role');
        const popoverDescription = popover?.querySelector('.popover-description');

        // Drag functionality for files
        let isDraggingFile = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let dragStartLeft = 0;
        let dragStartTop = 0;
        let draggedFile = null;
        let hasDragged = false;

        // Handle file clicks and drags
        fileButtons.forEach(button => {
            // Make files draggable
            button.addEventListener('mousedown', (e) => {
                // Only start drag on left mouse button
                if (e.button !== 0) return;
                
                isDraggingFile = true;
                hasDragged = false;
                draggedFile = button;
                
                // Get initial mouse position
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                
                // Get current position of the file
                const rect = button.getBoundingClientRect();
                const containerRect = button.parentElement.getBoundingClientRect();
                
                // Convert current position to pixels relative to container
                dragStartLeft = rect.left - containerRect.left;
                dragStartTop = rect.top - containerRect.top;
                
                // Add dragging class for visual feedback
                button.style.cursor = 'grabbing';
                button.style.userSelect = 'none';
                
                e.preventDefault();
            });

            button.addEventListener('click', (e) => {
                // Only trigger click if it wasn't a drag
                if (hasDragged) {
                    e.preventDefault();
                    return;
                }
                
                e.preventDefault();
                const fileId = button.getAttribute('data-file');
                const file = fileData[fileId];

                console.log('File clicked:', fileId, 'file:', file, 'modal:', modal, 'modalContent:', modalContent);

                // Special handling for website folder - open finder modal
                if (fileId === 'website') {
                    openFinderModal(file);
                } else if (file && modal && modalContent) {
                    openDocument(fileId, file);
                } else {
                    console.error('Missing required elements:', { file: !!file, modal: !!modal, modalContent: !!modalContent });
                }
            });

            // Handle hover for popover (only for old .page-file elements, not new .project-card)
            button.addEventListener('mouseenter', (e) => {
                // Skip popover for project cards
                if (button.classList.contains('project-card')) {
                    return;
                }

                const fileId = button.getAttribute('data-file');
                const file = fileData[fileId];

                if (file && popover && popoverTitle && popoverDescription) {
                    // Set content
                    popoverTitle.textContent = file.title;
                    if (popoverRole) {
                        if (file.role) {
                            popoverRole.textContent = file.role;
                            popoverRole.style.display = 'inline-block';
                        } else {
                            popoverRole.style.display = 'none';
                        }
                    }
                    popoverDescription.textContent = file.description;

                    // Reset any previous positioning
                    popover.style.left = '0px';
                    popover.style.top = '0px';
                    popover.style.transform = 'none';

                    // Show popover invisibly to measure
                    popover.style.display = 'block';
                    popover.style.visibility = 'hidden';
                    popover.style.opacity = '1';

                    // Force reflow to get accurate dimensions
                    void popover.offsetHeight;

                    // Get button position relative to viewport
                    const buttonRect = button.getBoundingClientRect();
                    const thumbnailRect = button.querySelector('.page-file-thumbnail')?.getBoundingClientRect() || buttonRect;
                    const popoverRect = popover.getBoundingClientRect();

                    // Position halfway on top of thumbnail and to the right side
                    // Calculate position: thumbnail top + (thumbnail height / 2) - (popover height / 2)
                    const top = thumbnailRect.top + (thumbnailRect.height / 2) - (popoverRect.height / 2);
                    // Position to the right of the thumbnail with some gap
                    const left = thumbnailRect.right + 16; // 16px gap to the right

                    // Apply position and make visible
                    popover.style.left = `${left}px`;
                    popover.style.top = `${top}px`;
                    popover.style.visibility = 'visible';
                }
            });

            button.addEventListener('mouseleave', () => {
                if (popover) {
                    popover.style.display = 'none';
                }
            });
        });

        // Handle mouse move for dragging files
        document.addEventListener('mousemove', (e) => {
            if (!isDraggingFile || !draggedFile) return;
            
            hasDragged = true;
            
            // Calculate new position
            const deltaX = e.clientX - dragStartX;
            const deltaY = e.clientY - dragStartY;
            
            const newLeft = dragStartLeft + deltaX;
            const newTop = dragStartTop + deltaY;
            
            // Get container dimensions
            const container = draggedFile.parentElement;
            const containerRect = container.getBoundingClientRect();
            
            // Convert to percentages
            const leftPercent = (newLeft / containerRect.width) * 100;
            const topPercent = (newTop / containerRect.height) * 100;
            
            // Constrain to container bounds
            const constrainedLeft = Math.max(0, Math.min(100, leftPercent));
            const constrainedTop = Math.max(0, Math.min(100, topPercent));
            
            // Update position
            draggedFile.style.left = `${constrainedLeft}%`;
            draggedFile.style.top = `${constrainedTop}%`;
        });

        // Handle mouse up to stop dragging
        document.addEventListener('mouseup', () => {
            if (isDraggingFile && draggedFile) {
                draggedFile.style.cursor = 'grab';
                draggedFile.style.userSelect = '';
            }
            
            isDraggingFile = false;
            draggedFile = null;
            hasDragged = false;
        });

        function openDocument(fileId, file) {
            // Hide popover when opening modal
            if (popover) {
                popover.style.display = 'none';
            }

            const imageContainer = document.getElementById('modal-image-container');
            const textContainer = document.getElementById('modal-text-container');

            if (!imageContainer || !textContainer) {
                console.error('Modal containers not found');
                return;
            }

            console.log('Setting modal content for:', fileId);
            console.log('File data:', file);

            // Create image/video grid HTML (vertical scrollable grid)
            const images = file.images && file.images.length > 0 ? file.images : ['./img/placeholder.jpeg'];
            console.log('Modal images/videos:', images);

            const mediaHTML = images.map((mediaPath, index) => {
                const isVideo = /\.(mp4|mov|webm)$/i.test(mediaPath);
                console.log(`Media ${index}: ${mediaPath}, isVideo: ${isVideo}`);

                if (isVideo) {
                    return `
                        <video src="${mediaPath}"
                               loop
                               playsinline
                               preload="metadata">
                            Your browser does not support the video tag.
                        </video>
                    `;
                } else {
                    return `
                        <img src="${mediaPath}"
                             alt="${file.title} - Image ${index + 1}">
                    `;
                }
            }).join('');

            imageContainer.innerHTML = mediaHTML;

            // Set text content
            const contentHTML = file.content || '<p>No content available.</p>';
            textContainer.innerHTML = contentHTML;

            // Clear any existing modal-row-1 elements from previous modal opens
            const existingRow1 = modalContent.querySelectorAll('.modal-row-1');
            existingRow1.forEach(el => {
                if (el.parentElement === modalContent) {
                    el.remove();
                }
            });

            // Move modal-row-1 to be a direct child of modalContent for sticky positioning
            const row1 = textContainer.querySelector('.modal-row-1');
            if (row1 && modalContent) {
                modalContent.insertBefore(row1, modalContent.firstChild);
            }

            // No slider functionality needed - using scrollable grid

            // Show modal with slide-up animation
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';

                // Trigger animation after display is set
                requestAnimationFrame(() => {
                    modal.classList.add('active');
                });
            }
        }


        // Removed tabs and multi-document functionality - simplified to single document display

        // Create resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'modal-resize-handle';
        if (modalContent) {
            modalContent.appendChild(resizeHandle);
        }

        // Drag functionality removed

        // Resize functionality
        if (resizeHandle && modalContent) {
            resizeHandle.addEventListener('mousedown', resizeStart);
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', resizeEnd);
        }

        // Drag functions removed

        function resizeStart(e) {
            e.preventDefault();
            e.stopPropagation();

            isResizing = true;
            startMouseX = e.clientX;
            startMouseY = e.clientY;
            startWidth = modalContent.offsetWidth;
            startHeight = modalContent.offsetHeight;
        }

        function resize(e) {
            if (isResizing) {
                e.preventDefault();

                const deltaX = e.clientX - startMouseX;
                const deltaY = e.clientY - startMouseY;

                let newWidth = startWidth + deltaX;
                let newHeight = startHeight + deltaY;

                // Apply constraints
                const minWidth = 400;
                const minHeight = 300;
                const maxWidth = window.innerWidth * 0.9;
                const maxHeight = window.innerHeight * 0.9;

                newWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
                newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

                modalContent.style.width = `${newWidth}px`;
                modalContent.style.height = `${newHeight}px`;
            }
        }

        function resizeEnd(e) {
            isResizing = false;
        }

        // Close modal with animation
        const closeModal = () => {
            if (modal && modalContent) {
                // Slide down animation
                modal.classList.remove('active');

                // Wait for animation to complete before hiding
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }, 400); // Match the CSS transition duration
            }
        };

        // Use event delegation for close button since it's dynamically generated
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target.id === 'modal-close' || e.target.closest('#modal-close')) {
                    closeModal();
                }
            });
        }

        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeModal);
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
                closeModal();
            }
        });

        // Image slider functionality

        // Finder modal functionality
        const finderModal = document.getElementById('finder-modal');
        const finderModalContent = document.getElementById('finder-modal-content');
        const finderClose = document.getElementById('finder-close');
        const finderOverlay = finderModal?.querySelector('.finder-modal-overlay');
        const finderCarouselImages = document.getElementById('finder-carousel-images');
        const finderCarouselThumbnails = document.getElementById('finder-carousel-thumbnails');
        const finderSidebarThumbnail = document.getElementById('finder-sidebar-thumbnail');
        const finderInfoName = document.getElementById('finder-info-name');
        const finderInfoSize = document.getElementById('finder-info-size');
        const finderInfoCreated = document.getElementById('finder-info-created');
        const finderInfoModified = document.getElementById('finder-info-modified');
        const finderInfoDimensions = document.getElementById('finder-info-dimensions');

        let currentImageIndex = 0;
        let finderImages = [];

        function renderFinderCarousel() {
            if (!finderCarouselImages || !finderCarouselThumbnails) return;

            // Clear existing content
            finderCarouselImages.innerHTML = '';
            finderCarouselThumbnails.innerHTML = '';

            // Create main images
            finderImages.forEach((imgSrc, index) => {
                const img = document.createElement('img');
                img.src = imgSrc;
                img.alt = `Image ${index + 1}`;
                img.className = `finder-carousel-image ${index === 0 ? 'active' : ''}`;
                img.dataset.index = index;
                finderCarouselImages.appendChild(img);
            });

            // Create thumbnails
            finderImages.forEach((imgSrc, index) => {
                const thumb = document.createElement('button');
                thumb.className = `finder-carousel-thumbnail ${index === 0 ? 'active' : ''}`;
                thumb.dataset.index = index;
                thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}">`;
                thumb.addEventListener('click', () => showImage(index));
                finderCarouselThumbnails.appendChild(thumb);
            });

            // Update sidebar for first image
            updateSidebar(0);
        }

        function showImage(index) {
            if (index < 0 || index >= finderImages.length) return;

            currentImageIndex = index;

            // Update main images
            const images = finderCarouselImages?.querySelectorAll('.finder-carousel-image');
            images?.forEach((img, i) => {
                if (i === index) {
                    img.classList.add('active');
                } else {
                    img.classList.remove('active');
                }
            });

            // Update thumbnails
            const thumbs = finderCarouselThumbnails?.querySelectorAll('.finder-carousel-thumbnail');
            thumbs?.forEach((thumb, i) => {
                if (i === index) {
                    thumb.classList.add('active');
                } else {
                    thumb.classList.remove('active');
                }
            });

            // Update sidebar
            updateSidebar(index);
        }

        function updateSidebar(index) {
            if (index < 0 || index >= finderImages.length) return;

            const imgSrc = finderImages[index];
            const imgName = imgSrc.split('/').pop().split('.')[0];

            // Update thumbnail
            if (finderSidebarThumbnail) {
                finderSidebarThumbnail.innerHTML = `<img src="${imgSrc}" alt="${imgName}">`;
            }

            // Update info
            if (finderInfoName) {
                finderInfoName.textContent = imgName;
            }

            // Load image to get dimensions
            const img = new Image();
            img.onload = function() {
                if (finderInfoDimensions) {
                    finderInfoDimensions.textContent = `${this.width} × ${this.height}`;
                }
            };
            img.src = imgSrc;

            // Set placeholder values
            if (finderInfoSize) {
                finderInfoSize.textContent = '1.8 MB';
            }
            if (finderInfoCreated) {
                finderInfoCreated.textContent = 'November 18, 2025 at 11:06 PM';
            }
            if (finderInfoModified) {
                finderInfoModified.textContent = 'November 18, 2025 at 11:06 PM';
            }
        }

        // Carousel navigation - set up event listeners
        function setupFinderCarouselNavigation() {
            const finderPrevBtn = document.querySelector('.finder-carousel-prev');
            const finderNextBtn = document.querySelector('.finder-carousel-next');

            if (finderPrevBtn) {
                finderPrevBtn.onclick = () => {
                    const newIndex = (currentImageIndex - 1 + finderImages.length) % finderImages.length;
                    showImage(newIndex);
                };
            }

            if (finderNextBtn) {
                finderNextBtn.onclick = () => {
                    const newIndex = (currentImageIndex + 1) % finderImages.length;
                    showImage(newIndex);
                };
            }
        }

        // Set up navigation when modal opens
        function openFinderModal(file) {
            console.log('Opening finder modal for:', file);
            
            if (!file || !file.images || file.images.length === 0) {
                console.error('No images found for website folder');
                return;
            }

            finderImages = file.images;
            currentImageIndex = 0;

            // Hide popover
            if (popover) {
                popover.style.display = 'none';
            }

            // Render carousel images
            renderFinderCarousel();

            // Set up navigation buttons
            setupFinderCarouselNavigation();

            // Show finder modal
            if (finderModal) {
                finderModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        }

        // Keyboard navigation for finder
        document.addEventListener('keydown', (e) => {
            if (finderModal && finderModal.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    const newIndex = (currentImageIndex - 1 + finderImages.length) % finderImages.length;
                    showImage(newIndex);
                } else if (e.key === 'ArrowRight') {
                    const newIndex = (currentImageIndex + 1) % finderImages.length;
                    showImage(newIndex);
                }
            }
        });

        // Close finder modal
        function closeFinderModal() {
            if (finderModal) {
                finderModal.style.display = 'none';
                document.body.style.overflow = '';
            }
        }

        if (finderClose) {
            finderClose.addEventListener('click', closeFinderModal);
        }

        if (finderOverlay) {
            finderOverlay.addEventListener('click', closeFinderModal);
        }

        // Close finder on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && finderModal && finderModal.style.display === 'flex') {
                closeFinderModal();
            }
        });
    }

})();
