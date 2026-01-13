// ==================== OPENING ANIMATION WITH GSAP ====================
// Scroll-based opening animation that transitions to main content

(function() {
    // Wait for GSAP and DOM to be ready
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Elements
    const openingAnimation = document.getElementById('opening-animation');
    const mainContent = document.getElementById('main-content');
    const textWrapper = document.querySelector('.opening-text-wrapper');
    const scrollIndicator = document.querySelector('.opening-scroll-indicator');
    const iconsContainer = document.querySelector('.opening-icons-container');

    // Configuration
    const numberOfIcons = 15;
    const scrollDistance = 2500; // Virtual scroll distance in pixels

    // Create a scroll proxy for smooth animation control
    let scrollProgress = 0;

    // Create falling icons
    const icons = [];
    for (let i = 0; i < numberOfIcons; i++) {
        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'opening-icon';

        const img = document.createElement('img');
        img.src = './img/oneicon.png';
        img.alt = 'Pixel icon';

        iconWrapper.appendChild(img);

        // Random positions
        const startX = Math.random() * (window.innerWidth - 100);
        const startY = -200 - (i * 150);

        gsap.set(iconWrapper, {
            left: startX,
            top: startY,
            opacity: 0
        });

        iconsContainer.appendChild(iconWrapper);

        icons.push({
            element: iconWrapper,
            startX: startX,
            startY: startY,
            targetX: Math.random() * (window.innerWidth - 100),
            targetY: Math.random() * (window.innerHeight - 100),
            delay: i * 0.03, // Reduced from 0.06 to make icons appear earlier
            rotation: Math.random() * 360
        });
    }

    // Create the opening animation timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: openingAnimation,
            start: 'top top',
            end: `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            onUpdate: (self) => {
                scrollProgress = self.progress;

                // Hide scroll indicator after scrolling starts
                if (scrollProgress > 0.1) {
                    gsap.to(scrollIndicator, { opacity: 0, duration: 0.3 });
                }
            },
            onLeave: () => {
                // Animation complete - show main content
                completeAnimation();
            }
        }
    });

    // Animate text from right to left
    tl.fromTo(textWrapper,
        { xPercent: 100 },
        { xPercent: -100, ease: 'none' },
        0
    );

    // Animate icons
    icons.forEach((icon, index) => {
        const startTime = icon.delay;
        const duration = 1 - icon.delay;

        tl.to(icon.element, {
            x: icon.targetX - icon.startX,
            y: icon.targetY - icon.startY,
            rotation: icon.rotation,
            opacity: 1,
            ease: 'power2.out',
            duration: duration
        }, startTime);
    });

    // Function to complete animation and show main content
    function completeAnimation() {
        // Fade out opening animation
        gsap.to(openingAnimation, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                openingAnimation.style.display = 'none';

                // Show and fade in main content
                mainContent.classList.remove('main-content-hidden');
                gsap.fromTo(mainContent,
                    { opacity: 0 },
                    {
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                        onComplete: () => {
                            // Clean up scroll trigger
                            ScrollTrigger.getAll().forEach(trigger => {
                                if (trigger.vars.trigger === openingAnimation) {
                                    trigger.kill();
                                }
                            });

                            // Reset body overflow
                            document.body.style.overflow = 'auto';
                        }
                    }
                );
            }
        });
    }

    // Optional: Skip animation on click/tap (for returning users)
    let skipTimeout;
    openingAnimation.addEventListener('click', (e) => {
        // Prevent accidental skips - require double click within 300ms
        if (skipTimeout) {
            clearTimeout(skipTimeout);
            skipTimeout = null;

            // Skip to end
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.vars.trigger === openingAnimation) {
                    trigger.scroll(trigger.end);
                }
            });
        } else {
            skipTimeout = setTimeout(() => {
                skipTimeout = null;
            }, 300);
        }
    });

})();
