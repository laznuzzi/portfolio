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

    // Drag functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Resize functionality
    let isResizing = false;
    let startWidth;
    let startHeight;
    let startMouseX;
    let startMouseY;

    // Track open documents
    let openDocuments = [];
    let activeDocumentId = null;
    console.log('Script initialized, openDocuments array created');

    // Finder navigation functionality
    function setupFinderNavigation() {
        console.log('setupFinderNavigation called');
        const fileButtons = document.querySelectorAll('.page-file');
        const modal = document.getElementById('file-modal');
        const modalContent = document.getElementById('file-modal-content');
        const modalOverlay = modal?.querySelector('.file-modal-overlay');
        const modalTitlebar = document.getElementById('modal-titlebar');
        const modalClose = document.getElementById('modal-close');
        const modalTitle = document.getElementById('modal-file-title');
        const modalTabsContainer = document.getElementById('modal-tabs-container');
        const modalTabs = document.getElementById('modal-tabs');
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

        // Handle file clicks
        fileButtons.forEach(button => {
            button.addEventListener('click', (e) => {
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

            // Handle hover for popover
            button.addEventListener('mouseenter', (e) => {
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

        function openDocument(fileId, file) {
            console.log('Opening document:', fileId);

            // Hide popover when opening modal
            if (popover) {
                popover.style.display = 'none';
            }

            // Update modal content
            if (modalTitle) {
                modalTitle.textContent = file.title;
            }

            if (modalDocumentsContainer) {
                // Create image slider HTML
                const imageSliderHTML = file.images && file.images.length > 0 ? `
                    <div class="document-image-slider">
                        <div class="slider-main">
                            <button class="slider-nav slider-prev" aria-label="Previous image">‹</button>
                            <div class="slider-images">
                                ${file.images.map((img, index) => `
                                    <img src="${img}"
                                         alt="${file.title} - Image ${index + 1}"
                                         class="document-header-image ${index === 0 ? 'active' : ''}"
                                         data-index="${index}">
                                `).join('')}
                            </div>
                            <button class="slider-nav slider-next" aria-label="Next image">›</button>
                        </div>
                    </div>
                ` : '';

                modalDocumentsContainer.innerHTML = `
                    <div class="modal-document-body">
                        ${imageSliderHTML}
                        ${file.content}
                    </div>
                `;

                // Initialize slider functionality
                initializeImageSlider();
            }

            // Hide tabs container
            if (modalTabsContainer) {
                modalTabsContainer.style.display = 'none';
            }

            // Show modal
            if (modal.style.display !== 'flex') {
                centerModal();
                modal.style.display = 'flex';
                // Lock body scroll when modal opens
                document.body.style.overflow = 'hidden';
            }
        }

        function centerModal() {
            // Reset any previous transforms and dimensions
            modalContent.style.transform = 'translate(-50%, -50%)';
            modalContent.style.left = '50%';
            modalContent.style.top = '50%';
            modalContent.style.width = '75vw'; // Reset to initial width
            modalContent.style.height = '90vh'; // Reset to initial height
            xOffset = 0;
            yOffset = 0;
        }

        function renderTabs() {
            console.log('renderTabs called, docs:', openDocuments.length);
            console.log('modalTabs:', modalTabs, 'modalTabsContainer:', modalTabsContainer);

            if (!modalTabs || !modalTabsContainer) {
                console.log('Missing tabs elements!');
                return;
            }

            // Clear existing tabs
            modalTabs.innerHTML = '';

            // Show/hide tabs container based on number of documents
            // Always show tabs if any documents are open (for now, to debug)
            if (openDocuments.length >= 1) {
                console.log('Showing tabs -', openDocuments.length, 'doc(s)');
                modalTabsContainer.classList.add('has-tabs');
                modalTabsContainer.style.display = 'flex';
            } else {
                console.log('Hiding tabs - no docs');
                modalTabsContainer.classList.remove('has-tabs');
                modalTabsContainer.style.display = 'none';
            }

            // Create tabs - always create them for debugging
            console.log('Creating', openDocuments.length, 'tabs');
            openDocuments.forEach(doc => {
                const tab = document.createElement('button');
                tab.className = 'modal-tab';
                tab.dataset.docId = doc.id;
                if (doc.id === activeDocumentId) {
                    tab.classList.add('active');
                }

                const tabName = document.createElement('span');
                tabName.className = 'modal-tab-name';
                tabName.textContent = doc.title;

                const tabClose = document.createElement('button');
                tabClose.className = 'modal-tab-close';
                tabClose.textContent = '×';
                tabClose.onclick = (e) => {
                    e.stopPropagation();
                    closeDocument(doc.id);
                };

                tab.appendChild(tabName);
                tab.appendChild(tabClose);

                tab.onclick = () => switchToDocument(doc.id);

                modalTabs.appendChild(tab);
                console.log('Tab created for:', doc.title);
            });

            console.log('Tabs rendered, total in DOM:', modalTabs.children.length);
        }

        function renderDocuments() {
            if (!modalDocumentsContainer) return;

            // Clear existing documents
            modalDocumentsContainer.innerHTML = '';

            // Create document containers
            openDocuments.forEach(doc => {
                const docDiv = document.createElement('div');
                docDiv.className = 'modal-document';
                docDiv.dataset.docId = doc.id;
                if (doc.id === activeDocumentId) {
                    docDiv.classList.add('active');
                }

                const docBody = document.createElement('div');
                docBody.className = 'modal-document-body';
                docBody.innerHTML = doc.content;

                docDiv.appendChild(docBody);
                modalDocumentsContainer.appendChild(docDiv);
            });
        }

        function switchToDocument(docId) {
            console.log('Switching to document:', docId);
            activeDocumentId = docId;
            const doc = openDocuments.find(d => d.id === docId);

            if (!doc) {
                console.log('Document not found!');
                return;
            }

            console.log('Found document:', doc.title);

            // Update title bar
            if (modalTitle) {
                modalTitle.textContent = doc.title;
            }

            // Update active tab
            const tabs = modalTabs?.querySelectorAll('.modal-tab');
            tabs?.forEach(tab => {
                if (tab.dataset.docId === docId) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });

            // Update active document
            const docs = modalDocumentsContainer?.querySelectorAll('.modal-document');
            docs?.forEach(docEl => {
                if (docEl.dataset.docId === docId) {
                    docEl.classList.add('active');
                } else {
                    docEl.classList.remove('active');
                }
            });
        }

        function closeDocument(docId) {
            const index = openDocuments.findIndex(doc => doc.id === docId);
            if (index === -1) return;

            // Remove document
            openDocuments.splice(index, 1);

            // If closing the active document, switch to another
            if (docId === activeDocumentId) {
                if (openDocuments.length > 0) {
                    // Switch to the previous document or first document
                    const newIndex = Math.max(0, index - 1);
                    activeDocumentId = openDocuments[newIndex].id;
                } else {
                    // No more documents, close modal
                    closeModal();
                    return;
                }
            }

            // Re-render
            renderTabs();
            renderDocuments();
            switchToDocument(activeDocumentId);
        }

        // Create resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'modal-resize-handle';
        if (modalContent) {
            modalContent.appendChild(resizeHandle);
        }

        // Drag functionality
        if (modalTitlebar && modalContent) {
            modalTitlebar.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }

        // Resize functionality
        if (resizeHandle && modalContent) {
            resizeHandle.addEventListener('mousedown', resizeStart);
            document.addEventListener('mousemove', resize);
            document.addEventListener('mouseup', resizeEnd);
        }

        function dragStart(e) {
            if (e.target.closest('.modal-traffic-lights')) {
                return;
            }

            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            isDragging = true;
        }

        function drag(e) {
            if (isDragging && !isResizing) {
                e.preventDefault();

                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                setTranslate(currentX, currentY, modalContent);
            }
        }

        function dragEnd(e) {
            initialX = currentX;
            initialY = currentY;

            isDragging = false;
        }

        function setTranslate(xPos, yPos, el) {
            el.style.left = `${xPos}px`;
            el.style.top = `${yPos}px`;
        }

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

        // Close modal handlers
        const closeModal = () => {
            if (modal) {
                modal.style.display = 'none';
                xOffset = 0;
                yOffset = 0;
                // Unlock body scroll when modal closes
                document.body.style.overflow = '';
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
        function initializeImageSlider() {
            const sliderImages = document.querySelectorAll('.document-header-image');
            const prevBtn = document.querySelector('.slider-prev');
            const nextBtn = document.querySelector('.slider-next');
            let currentIndex = 0;

            if (sliderImages.length <= 1) return; // No slider needed for single image

            function showImage(index) {
                // Hide all images
                sliderImages.forEach(img => img.classList.remove('active'));

                // Show selected image
                if (sliderImages[index]) {
                    sliderImages[index].classList.add('active');
                }

                currentIndex = index;
            }

            // Navigation button handlers
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    const newIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
                    showImage(newIndex);
                });
            }

            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    const newIndex = (currentIndex + 1) % sliderImages.length;
                    showImage(newIndex);
                });
            }

            // Keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (modal && modal.style.display === 'flex') {
                    if (e.key === 'ArrowLeft') {
                        const newIndex = (currentIndex - 1 + sliderImages.length) % sliderImages.length;
                        showImage(newIndex);
                    } else if (e.key === 'ArrowRight') {
                        const newIndex = (currentIndex + 1) % sliderImages.length;
                        showImage(newIndex);
                    }
                }
            });
        }

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
