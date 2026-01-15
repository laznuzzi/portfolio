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
        setupFinderNavigation();
    }

    // File content data
    const fileData = {
        'document-a': {
            title: 'Document_A.pdf',
            description: 'Project document with implementation strategy and important details',
            images: ['./img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg'],
            content: `
                <h1 class="document-main-title">Updates to the landing page layout</h1>
                <p class="document-metadata">By Nazarena • January 2026 • Project Updates</p>

                <h2 class="document-section-title">Overview</h2>
                <p class="document-paragraph">This document contains important project information and details about the implementation strategy. We've made significant improvements to enhance user experience and visual consistency across the platform.</p>

                <h2 class="document-section-title">Key Changes</h2>
                <p class="document-paragraph">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            `
        },
        'notes': {
            title: 'Notes.pdf',
            description: 'Meeting notes and action items from recent discussions',
            images: ['./img/placeholder.jpeg', './img/placeholder.jpeg'],
            content: `
                <h1 class="document-main-title">Meeting notes and action items</h1>
                <p class="document-metadata">By Nazarena • January 2026 • Meeting Notes</p>

                <h2 class="document-section-title">Discussion Points</h2>
                <p class="document-paragraph">These notes provide an overview of key discussion points and action items from recent meetings. The team reviewed progress on current initiatives and identified next steps for upcoming quarters.</p>

                <h2 class="document-section-title">Action Items</h2>
                <p class="document-paragraph">Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            `
        },
        'report': {
            title: 'Report_Final.pdf',
            description: 'Final report with findings, conclusions, and recommendations',
            images: ['./img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg', './img/placeholder.jpeg'],
            content: `
                <h1 class="document-main-title">Final project report</h1>
                <p class="document-metadata">By Nazarena • January 2026 • Final Report</p>

                <h2 class="document-section-title">Executive Summary</h2>
                <p class="document-paragraph">Final report outlining objectives, findings, conclusions, and recommendations. This comprehensive analysis provides strategic insights and actionable recommendations for future development.</p>

                <h2 class="document-section-title">Recommendations</h2>
                <p class="document-paragraph">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            `
        },
        'presentation': {
            title: 'Presentation.pdf',
            description: 'Client presentation deck with insights and visualizations',
            images: ['./img/placeholder.jpeg'],
            content: `
                <h1 class="document-main-title">Client presentation deck</h1>
                <p class="document-metadata">By Nazarena • January 2026 • Presentation</p>

                <h2 class="document-section-title">Key Insights</h2>
                <p class="document-paragraph">Presentation materials including key insights, data visualizations, and strategic recommendations. This deck summarizes our findings and proposed solutions for the client's consideration.</p>

                <h2 class="document-section-title">Next Steps</h2>
                <p class="document-paragraph">Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            `
        }
    };

    // Drag functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

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

        // Popover element
        const popover = document.getElementById('file-popover');
        const popoverTitle = popover?.querySelector('.popover-title');
        const popoverDescription = popover?.querySelector('.popover-description');

        // Handle file clicks
        fileButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const fileId = button.getAttribute('data-file');
                const file = fileData[fileId];

                if (file && modal && modalContent) {
                    openDocument(fileId, file);
                }
            });

            // Handle hover for popover
            button.addEventListener('mouseenter', (e) => {
                const fileId = button.getAttribute('data-file');
                const file = fileData[fileId];

                if (file && popover && popoverTitle && popoverDescription) {
                    popoverTitle.textContent = file.title;
                    popoverDescription.textContent = file.description;

                    // Get button position
                    const rect = button.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top - 8; // Small offset above the file

                    // Position popover centered above the file
                    popover.style.left = x + 'px';
                    popover.style.top = y + 'px';
                    popover.style.transform = 'translate(-50%, calc(-100% - 8px))';
                    popover.style.display = 'block';
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
                        ${file.images.length > 1 ? `
                            <div class="slider-thumbnails">
                                ${file.images.map((img, index) => `
                                    <button class="slider-thumbnail ${index === 0 ? 'active' : ''}"
                                            data-index="${index}"
                                            aria-label="View image ${index + 1}">
                                        <img src="${img}" alt="Thumbnail ${index + 1}">
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
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
            }
        }

        function centerModal() {
            // Reset any previous transforms
            modalContent.style.transform = 'translate(-50%, -50%)';
            modalContent.style.left = '50%';
            modalContent.style.top = '50%';
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

        // Drag functionality
        if (modalTitlebar && modalContent) {
            modalTitlebar.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
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
            if (isDragging) {
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

        // Close modal handlers
        const closeModal = () => {
            if (modal) {
                modal.style.display = 'none';
                xOffset = 0;
                yOffset = 0;
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
            const thumbnails = document.querySelectorAll('.slider-thumbnail');
            const prevBtn = document.querySelector('.slider-prev');
            const nextBtn = document.querySelector('.slider-next');
            let currentIndex = 0;

            if (sliderImages.length <= 1) return; // No slider needed for single image

            function showImage(index) {
                // Hide all images
                sliderImages.forEach(img => img.classList.remove('active'));
                thumbnails.forEach(thumb => thumb.classList.remove('active'));

                // Show selected image
                if (sliderImages[index]) {
                    sliderImages[index].classList.add('active');
                }
                if (thumbnails[index]) {
                    thumbnails[index].classList.add('active');
                }

                currentIndex = index;
            }

            // Thumbnail click handlers
            thumbnails.forEach((thumbnail, index) => {
                thumbnail.addEventListener('click', () => {
                    showImage(index);
                });
            });

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
    }
})();
