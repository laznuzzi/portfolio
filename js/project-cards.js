// ==================== PROJECT CARD GRID INTERACTIONS ====================
// Simple hover effects for card grid

(function() {
    // Wait for DOM and GSAP to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        if (typeof gsap === 'undefined') {
            console.warn('GSAP not loaded - using CSS-only animations for project cards');
            return;
        }

        setupCardInteractions();
    }

    // ==================== CARD HOVER ANIMATIONS ====================
    function setupCardInteractions() {
        // Color flood animation is handled by CSS
        // No additional GSAP animations needed
        console.log('Project card interactions initialized (CSS-only)');
    }

})();
