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

    // Open modal for vintage table entries - defined at module scope
    function openVintageTableModal(entryId, row, hoverImageRect) {
        console.log('openVintageTableModal called with:', entryId);
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

        // Create image grid HTML from entry data
        const images = entry.images && entry.images.length > 0 ? entry.images : ['./img/placeholder.jpeg'];
        imageContainer.innerHTML = `
            <div class="modal-image-grid">
                ${images.map((img, index) => `
                    <img src="${img}"
                         alt="${entry.title} - Image ${index + 1}"
                         class="modal-grid-image">
                `).join('')}
            </div>
        `;

        // Set text content from entry data
        textContainer.innerHTML = entry.content;

        // Show modal with animation
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        console.log('Modal display set to:', modal.style.display);
        console.log('Modal computed display:', window.getComputedStyle(modal).display);
        console.log('Modal visibility:', window.getComputedStyle(modal).visibility);
        console.log('Modal opacity:', window.getComputedStyle(modal).opacity);
        console.log('Modal z-index:', window.getComputedStyle(modal).zIndex);
        console.log('Modal position:', window.getComputedStyle(modal).position);
        console.log('Modal bounding rect:', modal.getBoundingClientRect());

        // Get close button for animation
        const closeButton = modal.querySelector('.modal-close-button');

        // "Building" animation - expand from center vertically
        console.log('Animation check:', {
            hoverImageRect: !!hoverImageRect,
            gsapAvailable: typeof gsap !== 'undefined'
        });

        if (hoverImageRect && typeof gsap !== 'undefined') {
            console.log('Running building animation...');
            console.log('ModalContent initial position:', window.getComputedStyle(modalContent).position);
            console.log('ModalContent initial left:', window.getComputedStyle(modalContent).left);
            console.log('ModalContent initial top:', window.getComputedStyle(modalContent).top);
            // Hide panels and close button initially
            gsap.set(textContainer, { opacity: 0, y: -20 });
            gsap.set(imageContainer, { opacity: 0, y: 20 });
            gsap.set(closeButton, { opacity: 0, scale: 0.5 });

            // Calculate hover image center in viewport
            const hoverCenterX = hoverImageRect.left + hoverImageRect.width / 2;
            const hoverCenterY = hoverImageRect.top + hoverImageRect.height / 2;

            // Set initial state - small height at hover position, full width
            modalContent.style.transform = 'translate(-50%, -50%)';
            gsap.set(modalContent, {
                left: hoverCenterX,
                top: hoverCenterY,
                width: hoverImageRect.width,
                height: hoverImageRect.height,
                opacity: 1
            });

            // Timeline for coordinated animation
            const tl = gsap.timeline();

            // First: Move to center and expand width
            tl.to(modalContent, {
                left: '50%',
                top: '50%',
                width: '95vw',
                duration: 0.4,
                ease: 'power3.out'
            });

            // Second: Expand height (builds vertically from center)
            tl.to(modalContent, {
                height: '95vh',
                duration: 0.5,
                ease: 'power3.out'
            }, '-=0.1');

            // Third: Reveal content as it builds
            tl.to(textContainer, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.3');

            tl.to(imageContainer, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                ease: 'power2.out'
            }, '-=0.35');

            // Finally: Fade in close button
            tl.to(closeButton, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: 'back.out(2)'
            }, '-=0.2');
        } else {
            console.log('Using fallback animation (no hover rect or no GSAP)');
            // Fallback: simple fade in
            if (typeof gsap !== 'undefined') {
                console.log('Running fallback GSAP animation');
                gsap.fromTo(modalContent,
                    { opacity: 0, scale: 0.95 },
                    { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
                );
            } else {
                console.log('No GSAP available, modal should still be visible');
            }
        }
    }

    // Setup vintage table rows (can be called multiple times)
    function setupVintageTableRows() {
        const vintageTableRows = document.querySelectorAll('.vintage-table-row');
        const modal = document.getElementById('project-modal');

        console.log('Setting up vintage table rows:', vintageTableRows.length);
        
        // Create a single shared hover image container (based on original repo)
        function createSharedHoverContainer() {
            if (!hoverImageContainer) {
                hoverImageContainer = document.createElement('div');
                hoverImageContainer.className = 'vintage-table-hover-image';
                
                // Create slider container (like modalSlider in original)
                const slider = document.createElement('div');
                slider.className = 'hover-image-slider';
                
                // Create individual image containers for each row
                vintageTableRows.forEach((row, index) => {
                    const hoverImage = row.querySelector('.vintage-table-hover-image');
                    const imageSrc = hoverImage?.querySelector('img')?.src;
                    if (imageSrc) {
                        const imageContainer = document.createElement('div');
                        imageContainer.className = 'hover-image-item';
                        const img = document.createElement('img');
                        img.src = imageSrc;
                        img.alt = hoverImage.querySelector('img').alt;
                        imageContainer.appendChild(img);
                        slider.appendChild(imageContainer);
                    }
                });
                
                hoverImageContainer.appendChild(slider);
                document.body.appendChild(hoverImageContainer);
            }
            return hoverImageContainer;
        }
        
        vintageTableRows.forEach((row, index) => {
            const hoverImage = row.querySelector('.vintage-table-hover-image');
            const imageWrapper = hoverImage?.querySelector('.hover-image-wrapper');
            const imageSrc = hoverImage?.querySelector('img')?.src;
            
            if (hoverImage && imageWrapper && imageSrc) {
                // Track mouse movement anywhere on the row
                row.addEventListener('mouseenter', (e) => {
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
                    
                    // Update slider position based on row index (like original: top: index * -100 + "%")
                    slider.style.top = `${index * -100}%`;
                    
                    currentHoverImage = hoverImage;
                    currentRowIndex = index;
                });
                
                row.addEventListener('mousemove', (e) => {
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
                
                row.addEventListener('mouseleave', () => {
                    if (hoverImageContainer && currentRowIndex === index) {
                        hideHoverImage();
                    }
                });
            }
            
            // Click handler
            row.addEventListener('click', (e) => {
                const entryId = row.getAttribute('data-entry');
                console.log('Row clicked, entryId:', entryId);
                console.log('fileData:', window.fileData);
                console.log('Entry exists:', !!window.fileData[entryId]);
                // Get hover image position before it disappears
                const hoverImageRect = hoverImageContainer ? hoverImageContainer.getBoundingClientRect() : null;
                openVintageTableModal(entryId, row, hoverImageRect);
            });
        });
        
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

        // Setup vintage table rows initially
        setupVintageTableRows();

        // Listen for table updates from Google Sheets
        window.addEventListener('vintageTableUpdated', () => {
            console.log('Vintage table updated event received, re-initializing...');
            // Remove old hover container if it exists
            if (hoverImageContainer) {
                hoverImageContainer.remove();
                hoverImageContainer = null;
            }
            // Re-setup table rows
            setupVintageTableRows();
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

            // Create image grid HTML (vertical scrollable grid)
            const images = file.images && file.images.length > 0 ? file.images : ['./img/placeholder.jpeg'];
            imageContainer.innerHTML = `
                <div class="modal-image-grid">
                    ${images.map((img, index) => `
                        <img src="${img}"
                             alt="${file.title} - Image ${index + 1}"
                             class="modal-grid-image">
                    `).join('')}
                </div>
            `;

            // Set text content
            const contentHTML = file.content || '<p>No content available.</p>';
            textContainer.innerHTML = contentHTML;

            // No slider functionality needed - using scrollable grid

            // Show modal
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
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
                // Animate out
                if (typeof gsap !== 'undefined') {
                    gsap.to(modalContent, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.25,
                        ease: 'power2.in',
                        onComplete: () => {
                            modal.style.display = 'none';
                            document.body.style.overflow = '';
                        }
                    });
                } else {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            }
        };

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
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
