// ==================== OPENING ANIMATION WITH STICKER-SLAP CAPSULES ====================
// Typing animation, then sticker-slap word capsules, then sticky footer reveal

(function() {
    // ==================== EDIT TEXT HERE ====================
    // Each word on its own line to prevent wrapping during typing
    const LINE_1 = "Howdy";
    const LINE_2 = "partner,";
    const LINE_3 = "↓ I'm ↓";
    const LINE_4 = "Nazarena";
    // ========================================================

    // Wait for GSAP to be ready
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
    const physicsContainer = document.getElementById('physics-container');

    // Force opening animation to stay completely fixed
    openingAnimation.style.position = 'fixed';
    openingAnimation.style.top = '0';
    openingAnimation.style.left = '0';
    openingAnimation.style.transform = 'none';
    openingAnimation.style.willChange = 'auto';

    // Show main content immediately
    mainContent.classList.remove('main-content-hidden');
    mainContent.style.visibility = 'visible';
    mainContent.style.pointerEvents = 'auto';

    // ==================== RANDOM LETTER REVEAL ANIMATION ====================
    const textElement = textWrapper.querySelector('.opening-large-text');

    // Clear existing content and create structure with random letter reveals
    let oLetterElement = null; // Store reference to "o" in "Howdy"

    if (textElement) {
        textElement.innerHTML = ''; // Clear existing text

        // Create 4 separate line elements, each will contain one word
        const lines = [LINE_1, LINE_2, LINE_3, LINE_4];
        const letterElements = []; // Store all letter elements for random animation

        lines.forEach((lineText, lineIndex) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'opening-line';

            // Create a span for each character (including spaces)
            for (let i = 0; i < lineText.length; i++) {
                const char = lineText[i];
                const charSpan = document.createElement('span');
                charSpan.className = 'opening-letter';
                charSpan.textContent = char;
                charSpan.style.opacity = '0';
                charSpan.style.display = 'inline-block';

                // Store reference to "o" in "Howdy" (line 0, position 1)
                if (lineIndex === 0 && i === 1 && char.toLowerCase() === 'o') {
                    oLetterElement = charSpan;
                    charSpan.style.position = 'relative';
                }

                // Store reference for animation (skip spaces from random reveal)
                if (char !== ' ') {
                    letterElements.push(charSpan);
                } else {
                    // Spaces should be immediately visible to maintain spacing
                    charSpan.style.opacity = '1';
                }

                lineDiv.appendChild(charSpan);
            }

            textElement.appendChild(lineDiv);
        });

        // Animate letters in random order
        animateRandomLetters(letterElements, oLetterElement);
    }

    function animateRandomLetters(letters, oLetter) {
        // Create array of indices and shuffle them
        const indices = letters.map((_, i) => i);
        shuffleArray(indices);

        // Reveal letters one by one in random order
        const totalDuration = 1200; // Total time for all letters to appear (ms) - faster
        const delayBetweenLetters = totalDuration / letters.length;

        indices.forEach((index, animationOrder) => {
            setTimeout(() => {
                gsap.to(letters[index], {
                    opacity: 1,
                    duration: 0.3,
                    ease: "power2.out"
                });
            }, animationOrder * delayBetweenLetters);
        });

        // After letters are revealed, replace "o" with avatar
        setTimeout(() => {
            if (oLetter) {
                replaceOWithAvatar(oLetter);
            }
        }, totalDuration + 300);

        // Start physics after avatar replacement
        setTimeout(() => {
            startPhysicsAnimation();
        }, totalDuration + 800);
    }

    function replaceOWithAvatar(oElement) {
        // Create avatar image element
        const avatar = document.createElement('img');
        avatar.src = './img/avatar.jpeg';
        avatar.className = 'opening-avatar';
        avatar.style.position = 'absolute';
        avatar.style.top = '40%';
        avatar.style.left = '44%';
        avatar.style.transform = 'translate(-50%, -50%)';
        avatar.style.width = '.75em';
        avatar.style.height = '.75em';
        avatar.style.borderRadius = '50%';
        avatar.style.objectFit = 'cover';
        avatar.style.opacity = '0';

        // Add avatar to the o element
        oElement.appendChild(avatar);

        // Animate: fade out "o" text and fade in avatar
        gsap.timeline()
            .to(oElement, {
                color: 'transparent',
                duration: 0.3,
                ease: "power2.inOut"
            })
            .to(avatar, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            }, "-=0.1");
    }

    function shuffleArray(array) {
        // Fisher-Yates shuffle algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ==================== STICKER-SLAP ANIMATION ====================
    function startPhysicsAnimation() {
        // Show physics container for capsules
        physicsContainer.style.display = 'block';
        physicsContainer.style.visibility = 'visible';
        physicsContainer.style.opacity = '1';

        console.log('Starting sticker-slap animation...');

        // Initialize sticker-slap animation (no physics engine needed)
        initStickerSlap();
    }

    function initStickerSlap() {
        // Sticker-slap animation: capsules appear with a quick scale/rotation animation
        // No physics engine needed - just GSAP animations

        // Capsule colors - all coral/bright red
        const bannerColor = '#FF6B6B';

        // Word banners data - shown initially
        const words = ['Designer', 'Developer', 'Builder', 'Fixer'];

        // Hidden "back pocket" words that appear on click - EDIT HERE
        const backPocketWords = ['Gardener', 'DIY-er', 'Learner', 'Reader', 'Hiker', 'Maker', 'Optimist'];
        let backPocketIndex = 0;

        // Get text font to calculate width
        const rootStyles = getComputedStyle(document.documentElement);
        const textFont = rootStyles.getPropertyValue('--capsule-text-font').trim();

        // Create a temporary canvas to measure text width
        const measureCanvas = document.createElement('canvas');
        const measureContext = measureCanvas.getContext('2d');
        measureContext.font = textFont;

        // Define fixed positions for initial capsules (spread across the screen)
        const isMobile = window.innerWidth <= 768;

        const positions = isMobile ? [
            { x: '20%', y: '15%', rotation: -8 },  // Designer - top left
            { x: '80%', y: '15%', rotation: 12 },  // Developer - top right
            { x: '15%', y: '70%', rotation: -15 }, // Builder - bottom left
            { x: '85%', y: '70%', rotation: 5 }    // Fixer - bottom right
        ] : [
            { x: '15%', y: '20%', rotation: -8 },  // Designer - top left
            { x: '75%', y: '15%', rotation: 12 },  // Developer - top right
            { x: '35%', y: '50%', rotation: -15 }, // Builder - mid left
            { x: '65%', y: '55%', rotation: 5 }    // Fixer - mid right
        ];

        // Function to create a capsule banner
        function createCapsule(word, position, delay = 0) {
            // Measure text width
            const textMetrics = measureContext.measureText(word);
            const textWidth = textMetrics.width;

            // Mobile responsive dimensions
            const isMobile = window.innerWidth <= 768;
            const internalPadding = isMobile ? 20 : 40;
            const borderWidth = isMobile ? 15 : 30;
            const bannerHeight = isMobile ? 60 : 130;

            // Calculate banner width
            const bannerWidth = textWidth + (internalPadding * 2) + (borderWidth * 2);

            // Create DOM element for banner
            const bannerElement = document.createElement('div');
            bannerElement.className = 'physics-banner';
            bannerElement.style.position = 'absolute';
            bannerElement.style.left = position.x;
            bannerElement.style.top = position.y;
            bannerElement.style.width = `${bannerWidth}px`;
            bannerElement.style.height = `${bannerHeight}px`;
            bannerElement.style.zIndex = '15';
            bannerElement.style.transform = `translate(-50%, -50%)`;
            bannerElement.style.transformOrigin = 'center center';

            // Set banner color via CSS variable
            bannerElement.style.setProperty('--banner-fill-color', bannerColor);

            // Create banner HTML structure using border-image with scalloped corners
            const encodedColor = bannerColor.replace('#', '%23');

            bannerElement.innerHTML = `
                <span class="banner-text">${word}</span>
            `;

            // Apply scalloped corner styling via border-image
            bannerElement.style.border = `${borderWidth}px solid`;
            bannerElement.style.borderImageSource = `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="3" height="3" fill="${encodedColor}"><path d="M2 0H1C1 .6.6 1 0 1v1c.6 0 1 .4 1 1h1c0-.6.4-1 1-1V1a1 1 0 0 1-1-1Z"/></svg>')`;
            bannerElement.style.borderImageSlice = '1 fill';

            // Set display style
            bannerElement.style.display = 'inline-flex';
            bannerElement.style.alignItems = 'stretch';

            // Add to physics container
            physicsContainer.appendChild(bannerElement);

            // Sticker-slap animation with GSAP
            // Start invisible and scaled down
            gsap.set(bannerElement, {
                opacity: 0,
                scale: 0,
                rotation: position.rotation
            });

            // Animate in with a "slap" effect
            gsap.to(bannerElement, {
                opacity: 1,
                scale: 1,
                duration: 0.4,
                delay: delay,
                ease: "back.out(2)", // Bouncy "slap" effect
                onStart: () => {
                    console.log(`Slapping ${word} onto screen at ${position.x}, ${position.y}`);
                }
            });

            return bannerElement;
        }

        // Create initial word banners with staggered appearance
        words.forEach((word, index) => {
            const position = positions[index];
            createCapsule(word, position, index * 0.15);
        });

        // Add click listener for Easter egg capsules
        openingAnimation.addEventListener('click', (e) => {
            // Check if there are still unused words
            if (backPocketIndex >= backPocketWords.length) {
                console.log('All words have been revealed!');
                return; // No more words to show
            }

            // Get next word from back pocket (no wrapping, linear progression)
            const word = backPocketWords[backPocketIndex];
            backPocketIndex++;

            // Calculate click position as percentage
            const rect = openingAnimation.getBoundingClientRect();
            const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
            const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

            // Random rotation between -15 and 15 degrees
            const rotation = (Math.random() - 0.5) * 30;

            // Create capsule at click position
            const position = {
                x: `${xPercent}%`,
                y: `${yPercent}%`,
                rotation: rotation
            };

            createCapsule(word, position, 0);
        });

        console.log('Sticker-slap animation initialized with click Easter egg');
    }

    // ==================== GSAP SCROLL TRIGGER - PUSH OPENING ANIMATION UP ====================
    // Simple: As user scrolls, push opening animation up and out of view
    // Start animation immediately and respond quickly to initial scroll
    const scrollTriggerConfig = {
        trigger: 'body',
        start: 'top top', // Start immediately when page loads
        end: () => `+=${window.innerHeight}`, // Scroll for one viewport height
        scrub: 0.5, // Faster response (0.5s delay instead of 1s) - more responsive
        markers: false
    };

    // Push entire opening animation up and out of view
    // Respond immediately to scroll to prevent overlap
    const openingAnimationTween = gsap.to('#opening-animation', {
        y: '-100vh', // Move up and out of view
        ease: "power2.inOut",
        scrollTrigger: scrollTriggerConfig
    });

    console.log('Opening animation ready - GSAP ScrollTrigger animations initialized');

    // ==================== SCROLL ANIMATION: Main Content Slides Over Opening ====================
    const appHeader = document.getElementById('app-header');
    const filingFolder = document.querySelector('.filing-folder-top');
    const verticalText = document.querySelector('.vertical-sidebar-text');

    // Ensure nav, folder, and sidebar text start hidden
    if (appHeader) {
        appHeader.style.opacity = '0';
        appHeader.style.visibility = 'hidden';
        appHeader.style.pointerEvents = 'none';
    }
    if (filingFolder) {
        filingFolder.style.opacity = '0';
        filingFolder.style.visibility = 'hidden';
        filingFolder.style.pointerEvents = 'none';
    }
    if (verticalText) {
        verticalText.classList.remove('visible');
    }

    // Animate tab and footer bar to slide up with scroll
    gsap.to('.footer-tab, .main-content-footer-preview', {
        y: '-100vh',
        ease: "none",
        scrollTrigger: {
            trigger: '.scroll-trigger-spacer',
            start: 'top top',
            end: 'top+=100vh top',
            scrub: 1,
            markers: false
        }
    });

    gsap.to('#main-content', {
        top: 0,
        ease: "none",
        scrollTrigger: {
            trigger: '.scroll-trigger-spacer',
            start: 'top top',
            end: 'top+=100vh top',
            scrub: 1,
            markers: false,
            onEnter: () => {
                // Show nav, folder, and sidebar text as soon as animation starts
                if (appHeader) {
                    appHeader.style.opacity = '1';
                    appHeader.style.visibility = 'visible';
                    appHeader.style.pointerEvents = 'auto';
                }
                if (filingFolder) {
                    filingFolder.style.opacity = '1';
                    filingFolder.style.visibility = 'visible';
                    filingFolder.style.pointerEvents = 'auto';
                }
                if (verticalText) {
                    verticalText.classList.add('visible');
                }
            },
            onLeaveBack: () => {
                // Hide nav, folder, and sidebar text when scrolling back up past start
                if (appHeader) {
                    appHeader.style.opacity = '0';
                    appHeader.style.visibility = 'hidden';
                    appHeader.style.pointerEvents = 'none';
                }
                if (filingFolder) {
                    filingFolder.style.opacity = '0';
                    filingFolder.style.visibility = 'hidden';
                    filingFolder.style.pointerEvents = 'none';
                }
                if (verticalText) {
                    verticalText.classList.remove('visible');
                }
            }
        }
    });

    console.log('Slide-over animation initialized');

    // Optional: Skip animation on double-click
    let skipTimeout;
    openingAnimation.addEventListener('click', (e) => {
        if (skipTimeout) {
            clearTimeout(skipTimeout);
            skipTimeout = null;

            // Scroll to main content
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        } else {
            skipTimeout = setTimeout(() => {
                skipTimeout = null;
            }, 300);
        }
    });

    // ==================== FOOTER TAB CLICK: Slide Up or Scroll to Archives ====================
    const footerTab = document.querySelector('.footer-tab');
    if (footerTab) {
        footerTab.addEventListener('click', () => {
            // Add highlight effect
            const originalColor = '#dbd7cc';
            const highlightColor = '#e8e5dc';

            footerTab.style.backgroundColor = highlightColor;

            // Check if we're on the opening animation screen
            const currentScroll = window.scrollY || window.pageYOffset;

            if (currentScroll < window.innerHeight * 0.5) {
                // Still on opening animation - trigger slide up
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            } else {
                // Already scrolled past opening - scroll to archives section
                const archivesSection = document.querySelector('.archives-section');
                if (archivesSection) {
                    archivesSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }

            // Remove highlight after animation
            setTimeout(() => {
                footerTab.style.backgroundColor = originalColor;
            }, 600);
        });
    }

})();
