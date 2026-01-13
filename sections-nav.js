// ==================== SECTIONS NAVIGATION SCRIPT ====================
// Handles folder toggling and page navigation

(function() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        setupFolderToggles();
        setupPageNavigation();
    }

    // Folder toggle functionality
    function setupFolderToggles() {
        const folderToggles = document.querySelectorAll('.nav-folder-toggle');

        folderToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const folder = toggle.closest('.nav-folder');
                folder.classList.toggle('collapsed');
            });
        });
    }

    // Page navigation functionality
    function setupPageNavigation() {
        const pageItems = document.querySelectorAll('.nav-page-item');
        const pages = document.querySelectorAll('.section-page');

        pageItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();

                const targetPageId = item.getAttribute('data-page');

                // Remove active class from all items
                pageItems.forEach(i => i.classList.remove('active'));

                // Add active class to clicked item
                item.classList.add('active');

                // Hide all pages
                pages.forEach(page => page.classList.remove('active'));

                // Show target page
                const targetPage = document.querySelector(`.section-page[data-page-id="${targetPageId}"]`);
                if (targetPage) {
                    targetPage.classList.add('active');
                }
            });
        });
    }
})();
