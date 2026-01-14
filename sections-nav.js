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
            content: `
                <p><strong>Document Type:</strong> Project Document</p>
                <p><strong>Date:</strong> January 2026</p>
                <p>This document contains important project information and details about the implementation strategy.</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            `
        },
        'notes': {
            title: 'Notes.pdf',
            content: `
                <p><strong>Document Type:</strong> Notes</p>
                <p><strong>Last Updated:</strong> January 2026</p>
                <p>These notes provide an overview of key discussion points and action items from recent meetings.</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
            `
        },
        'report': {
            title: 'Report_Final.pdf',
            content: `
                <p><strong>Document Type:</strong> Final Report</p>
                <p><strong>Status:</strong> Completed</p>
                <p>Final report outlining objectives, findings, conclusions, and recommendations.</p>
                <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</p>
            `
        },
        'presentation': {
            title: 'Presentation.pdf',
            content: `
                <p><strong>Document Type:</strong> Presentation Slides</p>
                <p><strong>Version:</strong> 2026</p>
                <p>Presentation materials including key insights, data visualizations, and strategic recommendations.</p>
                <p>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
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
        const fileButtons = document.querySelectorAll('.finder-file');
        const modal = document.getElementById('file-modal');
        const modalContent = document.getElementById('file-modal-content');
        const modalOverlay = modal?.querySelector('.file-modal-overlay');
        const modalTitlebar = document.getElementById('modal-titlebar');
        const modalClose = document.getElementById('modal-close');
        const modalTitle = document.getElementById('modal-file-title');
        const modalTabsContainer = document.getElementById('modal-tabs-container');
        const modalTabs = document.getElementById('modal-tabs');
        const modalDocumentsContainer = document.getElementById('modal-documents-container');

        // Finder window and folder elements
        const finderWindow = document.getElementById('finder-window');
        const finderClose = document.getElementById('finder-close');
        const folderIconContainer = document.getElementById('folder-icon-container');
        const folderIcon = document.getElementById('folder-icon');

        // Handle file double-clicks
        fileButtons.forEach(button => {
            button.addEventListener('dblclick', (e) => {
                e.preventDefault();
                const fileId = button.getAttribute('data-file');
                const file = fileData[fileId];

                if (file && modal && modalContent) {
                    openDocument(fileId, file);
                }
            });
        });

        function openDocument(fileId, file) {
            console.log('Opening document:', fileId, 'Current open docs:', openDocuments.length);
            console.log('Current array:', JSON.stringify(openDocuments.map(d => d.id)));

            // Check if document is already open
            const existingDoc = openDocuments.find(doc => doc.id === fileId);
            console.log('Existing doc check:', existingDoc ? 'FOUND' : 'NOT FOUND');

            if (existingDoc) {
                // Switch to existing document
                console.log('Document already open, switching to it');
                switchToDocument(fileId);
            } else {
                // Add new document
                const newDoc = {
                    id: fileId,
                    title: file.title,
                    content: file.content
                };
                console.log('About to push:', newDoc.id);
                openDocuments.push(newDoc);

                console.log('Document added, total docs now:', openDocuments.length);
                console.log('Array after push:', JSON.stringify(openDocuments.map(d => d.id)));

                // Show modal if not already visible
                if (modal.style.display !== 'flex') {
                    console.log('Modal was hidden, showing it now');
                    centerModal();
                    modal.style.display = 'flex';
                } else {
                    console.log('Modal already visible');
                }

                // Render tabs and documents
                renderTabs();
                renderDocuments();

                // Switch to the new document
                switchToDocument(fileId);
            }
        }

        function centerModal() {
            const rect = modalContent.getBoundingClientRect();
            xOffset = (window.innerWidth - rect.width) / 2;
            yOffset = (window.innerHeight - rect.height) / 2;
            modalContent.style.left = `${xOffset}px`;
            modalContent.style.top = `${yOffset}px`;
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
                openDocuments = [];
                activeDocumentId = null;
                if (modalTabsContainer) {
                    modalTabsContainer.classList.remove('has-tabs');
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

        // Handle finder close button
        if (finderClose && finderWindow && folderIconContainer) {
            finderClose.addEventListener('click', () => {
                finderWindow.style.display = 'none';
                folderIconContainer.style.display = 'flex';
            });
        }

        // Handle folder icon double-click to reopen finder
        if (folderIcon && finderWindow && folderIconContainer) {
            folderIcon.addEventListener('dblclick', () => {
                folderIconContainer.style.display = 'none';
                finderWindow.style.display = 'flex';
            });
        }
    }
})();
