// ==================== IMAGE SLIDER ====================
// Image carousel for project modals

(function() {
    'use strict';

    // Create slider for images marked with slider syntax
    window.initImageSlider = function(images, container, mainCaption = '') {
        if (!images || images.length === 0 || !container) return;

        console.log('initImageSlider called with', images.length, 'images:', images);

        // Create slider HTML
        const sliderHTML = `
            ${mainCaption ? `<div class="slider-main-caption">${mainCaption}</div>` : ''}
            <div class="image-slider">
                <div class="slider-wrapper">
                    <div class="slider-track">
                        ${images.map((img, index) => `
                            <div class="slider-slide ${index === 0 ? 'active' : ''}">
                                <img src="${img.src}" alt="${img.caption || ''}">
                                ${img.caption ? `<p class="slider-caption">${img.caption}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    <div class="slider-dots">
                        ${images.map((_, index) => `
                            <button class="slider-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = sliderHTML;

        // Slider state
        let currentSlide = 0;
        const slides = container.querySelectorAll('.slider-slide');
        const dots = container.querySelectorAll('.slider-dot');
        const sliderWrapper = container.querySelector('.slider-wrapper');

        console.log('Slider elements found:', {
            slides: slides.length,
            dots: dots.length
        });

        // Update slider
        function goToSlide(index) {
            console.log('Going to slide', index);
            slides[currentSlide].classList.remove('active');
            if (dots[currentSlide]) dots[currentSlide].classList.remove('active');

            currentSlide = (index + slides.length) % slides.length;

            slides[currentSlide].classList.add('active');
            if (dots[currentSlide]) dots[currentSlide].classList.add('active');
            console.log('Now on slide', currentSlide);
        }

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                console.log('Dot clicked:', index);
                e.stopPropagation();
                goToSlide(index);
            });
        });

        // Keyboard navigation on hover
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', () => {
                sliderWrapper.setAttribute('tabindex', '0');
                sliderWrapper.focus();
            });

            sliderWrapper.addEventListener('keydown', (e) => {
                console.log('Key pressed on slider:', e.key);
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    goToSlide(currentSlide - 1);
                }
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    goToSlide(currentSlide + 1);
                }
            });
        }

        console.log('Slider navigation ready');
    };

})();
