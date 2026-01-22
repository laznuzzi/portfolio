// ==================== OPENING ANIMATION WITH CAPSULE PHYSICS ====================
// Typing animation, then physics-based word capsules, then sticky footer reveal

(function() {
    // ==================== EDIT TEXT HERE ====================
    // Each word on its own line to prevent wrapping during typing
    const LINE_1 = "Howdy";
    const LINE_2 = "partner,";
    const LINE_3 = "↓ I'm ↓";
    const LINE_4 = "Nazarena";
    // ========================================================

    // Wait for GSAP and Matter.js to be ready
    if (typeof gsap === 'undefined') {
        console.error('GSAP not loaded');
        return;
    }
    if (typeof Matter === 'undefined') {
        console.error('Matter.js not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Elements
    const openingAnimation = document.getElementById('opening-animation');
    const mainContent = document.getElementById('main-content');
    const textWrapper = document.querySelector('.opening-text-wrapper');
    const scrollIndicator = document.querySelector('.opening-scroll-indicator');
    const physicsContainer = document.getElementById('physics-container');

    let physicsEngine = null;
    let physicsRender = null;

    // Show main content immediately (it's fixed at bottom, hidden by opening animation)
    mainContent.classList.remove('main-content-hidden');
    mainContent.style.visibility = 'visible';
    mainContent.style.pointerEvents = 'auto';

    // ==================== RANDOM LETTER REVEAL ANIMATION ====================
    const textElement = textWrapper.querySelector('.opening-large-text');

    // Clear existing content and create structure with random letter reveals
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
        animateRandomLetters(letterElements);
    }

    function animateRandomLetters(letters) {
        // Create array of indices and shuffle them
        const indices = letters.map((_, i) => i);
        shuffleArray(indices);

        // Reveal letters one by one in random order
        const totalDuration = 1800; // Total time for all letters to appear (ms) - faster
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

        // Start physics after all letters are revealed
        setTimeout(() => {
            startPhysicsAnimation();
        }, totalDuration + 500);
    }

    function shuffleArray(array) {
        // Fisher-Yates shuffle algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // ==================== PHYSICS ANIMATION ====================
    function startPhysicsAnimation() {
        // Keep text visible, just show physics container on top
        // Show physics container - CRITICAL: Must be visible for banners to show
        physicsContainer.style.display = 'block';
        physicsContainer.style.visibility = 'visible';
        physicsContainer.style.opacity = '1';
        
        console.log('Physics container shown, initializing physics...');
        
        // Initialize physics immediately (don't wait for GSAP animation)
        initPhysics();
    }

    function initPhysics() {
        const { Engine, Render, Bodies, Composite, Runner, Mouse, MouseConstraint, Events, Body, Vector } = Matter;

        // Create engine
        const engine = Engine.create();
        engine.gravity.y = 1; // Standard gravity
        engine.gravity.scale = 0.0008; // Increased for noticeable falling effect
        // Higher gravity creates more dramatic falling animation
        physicsEngine = engine;

        console.log('Physics initialized');

        // Create renderer
        const render = Render.create({
            element: physicsContainer,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent',
                pixelRatio: window.devicePixelRatio
            }
        });
        physicsRender = render;

        // All banners use coral/bright red color
        const bannerColors = [
            '#FF6B6B', // Designer - Coral/Bright Red
            '#FF6B6B', // Developer - Coral/Bright Red
            '#FF6B6B', // Builder - Coral/Bright Red
            '#FF6B6B', // Fixer - Coral/Bright Red
            '#FF6B6B', // Thinker - Coral/Bright Red
            '#FF6B6B', // Gardener - Coral/Bright Red
            '#FF6B6B'  // DIY-er - Coral/Bright Red
        ];

        // Word banners data
        const words = ['Designer', 'Developer', 'Builder', 'Fixer', 'Thinker', 'Gardener', 'DIY-er'];
        const banners = [];
        const bannerBodies = []; // Matter.js bodies for physics

        // Get text font to calculate width
        const rootStyles = getComputedStyle(document.documentElement);
        const textFont = rootStyles.getPropertyValue('--capsule-text-font').trim();
        
        // Create a temporary canvas to measure text width
        const measureCanvas = document.createElement('canvas');
        const measureContext = measureCanvas.getContext('2d');
        measureContext.font = textFont;

        // Create word banners with staggered appearance
        words.forEach((word, index) => {
            // Measure text width
            const textMetrics = measureContext.measureText(word);
            const textWidth = textMetrics.width;

            // Calculate banner width: text width + padding on both sides
            // With border-image (30px border on each side), we need less internal padding
            const internalPadding = 40; // Internal padding for text (reduced since border provides visual space)
            const borderWidth = 30; // Border width on each side
            const bannerWidth = textWidth + (internalPadding * 2) + (borderWidth * 2);
            const bannerHeight = 130; // Increased height for more vertical padding

            // Start positions - capsules begin above viewport and fall through
            const baseX = (window.innerWidth / (words.length + 1)) * (index + 1);
            const xVariation = (Math.random() - 0.5) * 150; // Random spread ±75px horizontally
            const x = baseX + xVariation;

            // Start just above the viewport - they will fall through with physics
            // All start at same height, appearance timing controls the stagger
            const y = -bannerHeight - 50; // Just above viewport
            
            console.log(`Banner ${index} (${word}): x=${x.toFixed(0)}, y=${y.toFixed(0)}, viewport height=${window.innerHeight}`);

            // Get color for this banner
            const bannerFillColor = bannerColors[index] || bannerColors[0];

            // Create DOM element for banner
            const bannerElement = document.createElement('div');
            bannerElement.className = 'physics-banner';
            bannerElement.style.position = 'absolute';
            bannerElement.style.left = '0';
            bannerElement.style.top = '0';
            // Use transform3d for initial positioning (will be updated by sync function)
            // CRITICAL: Use top-left positioning, not center
            const topLeftX = x - bannerWidth / 2;
            const topLeftY = y - bannerHeight / 2;
            bannerElement.style.transform = `translate3d(${topLeftX}px, ${topLeftY}px, 0)`;
            bannerElement.style.width = `${bannerWidth}px`;
            bannerElement.style.height = `${bannerHeight}px`;
            bannerElement.style.zIndex = '15'; // Above text container
            bannerElement.style.visibility = 'visible';
            bannerElement.style.opacity = '1';
            
            // Set banner color via CSS variable
            bannerElement.style.setProperty('--banner-fill-color', bannerFillColor);

            // Create banner HTML structure using border-image with scalloped corners
            // URL-encode the hex color for use in SVG data URI
            const encodedColor = bannerFillColor.replace('#', '%23');

            bannerElement.innerHTML = `
                <span class="banner-text">${word}</span>
            `;

            // Apply scalloped corner styling via border-image
            bannerElement.style.border = '30px solid';
            bannerElement.style.borderImageSource = `url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="3" height="3" fill="${encodedColor}"><path d="M2 0H1C1 .6.6 1 0 1v1c.6 0 1 .4 1 1h1c0-.6.4-1 1-1V1a1 1 0 0 1-1-1Z"/></svg>')`;
            bannerElement.style.borderImageSlice = '1 fill';
            
            console.log(`Banner ${index} (${word}) created with color: ${bannerFillColor}`);
            
            // Set display style to ensure flex layout works
            bannerElement.style.display = 'inline-flex';
            bannerElement.style.alignItems = 'stretch';
            // Initially hide banner - will appear one by one
            bannerElement.style.visibility = 'hidden';
            bannerElement.style.opacity = '0';
            
            // Add to physics container
            physicsContainer.appendChild(bannerElement);
            
            console.log(`Banner ${index} (${word}) DOM element created and added. Position: ${x - bannerWidth / 2}, ${y - bannerHeight / 2}`);
            
            // Add initial rotation variation - each banner starts at a different angle
            // Create varied angles between -30 and +30 degrees for organic scatter
            const angleVariation = (Math.random() - 0.5) * 0.6; // -0.3 to +0.3 radians (~-17° to +17°)
            const initialAngle = angleVariation;
            
            // Create invisible Matter.js body for physics (same size as visual element)
            const bannerBody = Bodies.rectangle(x, y, bannerWidth, bannerHeight, {
                render: { visible: false }, // Invisible - we use DOM element instead
                restitution: 0, // No bounce - capsules settle nicely without bouncing
                friction: 0.001,   // Very low friction - capsules slide past each other easily
                frictionStatic: 0.001, // Very low static friction - prevents sticking
                frictionAir: 0.02, // Slight air resistance for smoother, more gradual movement
                density: 0.001,   // Standard density for balanced physics
                angle: initialAngle, // Set initial rotation angle
                slop: 0.05, // Collision tolerance for smoother physics
                chamfer: { radius: bannerHeight / 2 }, // Rounded corners matching capsule shape
                inertia: Infinity // Prevents rotational slowdown - capsules spin freely
            });
            
            // Store references
            bannerBody.label = word;
            bannerBody.element = bannerElement;
            bannerBody.width = bannerWidth;
            bannerBody.height = bannerHeight;
            
            // Give banner downward velocity to fall through the screen
            const velocityX = (Math.random() - 0.5) * 0.3; // Slight horizontal variation
            const velocityY = 2 + (Math.random() * 0.5); // Downward velocity for falling effect (2-2.5)
            Body.setVelocity(bannerBody, { x: velocityX, y: velocityY });
            
            // Add angular velocity for natural rotation
            const angularVelocity = (Math.random() - 0.5) * 0.15; // Subtle rotation speed for gentle, graceful movement
            Body.setAngularVelocity(bannerBody, angularVelocity);
            
            banners.push(bannerElement);
            bannerBodies.push(bannerBody);
        });

        // Create boundaries (walls) - Keep capsules in viewport
        // No top wall so capsules can fall through from above
        const wallThickness = 50;
        const walls = [
            // Ground (bottom wall)
            Bodies.rectangle(
                window.innerWidth / 2,
                window.innerHeight + wallThickness / 2,
                window.innerWidth + 100,
                wallThickness,
                { isStatic: true, render: { fillStyle: 'transparent' } }
            ),
            // Left wall
            Bodies.rectangle(
                -wallThickness / 2,
                window.innerHeight / 2,
                wallThickness,
                window.innerHeight + 100,
                { isStatic: true, render: { fillStyle: 'transparent' } }
            ),
            // Right wall
            Bodies.rectangle(
                window.innerWidth + wallThickness / 2,
                window.innerHeight / 2,
                wallThickness,
                window.innerHeight + 100,
                { isStatic: true, render: { fillStyle: 'transparent' } }
            )
        ];

        // Add walls first
        Composite.add(engine.world, walls);
        
        // Add banners one by one with staggered delay for falling effect
        bannerBodies.forEach((bannerBody, index) => {
            setTimeout(() => {
                // Add to physics world
                Composite.add(engine.world, [bannerBody]);

                // Fade in the banner element
                const bannerElement = bannerBody.element;
                if (bannerElement) {
                    bannerElement.style.visibility = 'visible';
                    gsap.to(bannerElement, {
                        opacity: 1,
                        duration: 0.4,
                        ease: "power2.out"
                    });
                }
            }, index * 300); // 300ms delay between each banner for dramatic falling effect
        });
        
        console.log(`Created ${bannerBodies.length} banner bodies and ${walls.length} walls`);
        console.log('Physics container element:', physicsContainer);
        console.log('Physics container display:', window.getComputedStyle(physicsContainer).display);
        console.log('Physics container visibility:', window.getComputedStyle(physicsContainer).visibility);
        console.log('Physics container opacity:', window.getComputedStyle(physicsContainer).opacity);
        console.log('Banner elements in DOM:', physicsContainer.querySelectorAll('.physics-banner').length);
        
        // Log each banner's computed position
        bannerBodies.forEach((bannerBody, index) => {
            if (bannerBody.element) {
                const computed = window.getComputedStyle(bannerBody.element);
                console.log(`Banner ${index} (${bannerBody.label}):`, {
                    display: computed.display,
                    visibility: computed.visibility,
                    opacity: computed.opacity,
                    transform: computed.transform,
                    position: computed.position,
                    zIndex: computed.zIndex
                });
            }
        });

        // CRITICAL FIX: Use render.canvas for mouse tracking (not physicsContainer)
        // Matter.js Mouse needs the canvas element to work properly
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.1,  // Lower stiffness for smoother dragging
                damping: 0,      // No damping for more responsive interaction
                angularStiffness: 1, // Full rotational response when dragging
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);

        // Keep render mouse in sync with mouse object
        render.mouse = mouse;
        render.mouseConstraint = mouseConstraint;

        // Allow wheel events to pass through for scrolling
        render.canvas.style.touchAction = 'none';
        render.canvas.style.cursor = 'grab';
        render.canvas.addEventListener('wheel', (e) => {
            // Let scroll events pass through
        }, { passive: true });

        // CRITICAL: Track mouse position globally - key for smooth following
        let mousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let targetGroupCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        // Update mouse position function - called on mouse move
        const updateMousePosition = (event) => {
            const rect = render.canvas.getBoundingClientRect();
            mousePosition.x = event.clientX - rect.left;
            mousePosition.y = event.clientY - rect.top;
            
            // CRITICAL: Update Matter.js mouse object directly (Mouse.setPosition doesn't exist)
            // Matter.js Mouse automatically tracks when created with canvas, but we update position for forces
            if (mouse && mouse.position) {
                mouse.position.x = mousePosition.x;
                mouse.position.y = mousePosition.y;
            }
            
            // Smoothly update target group center - slower, more subtle response
            const lerpSpeed = 0.08; // Slower lerp for more gradual, subtle following
            targetGroupCenter.x += (mousePosition.x - targetGroupCenter.x) * lerpSpeed;
            targetGroupCenter.y += (mousePosition.y - targetGroupCenter.y) * lerpSpeed;
        };

        // Track mouse on canvas AND window for better coverage
        render.canvas.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mousemove', (event) => {
            // Also update when mouse moves anywhere on window
            const rect = render.canvas.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom) {
                updateMousePosition(event);
            }
        });

        // Apply smooth forces to banners - CRITICAL: This creates the group following effect
        // The reference uses continuous forces, not just on drag
        Events.on(engine, 'beforeUpdate', () => {
            // Calculate current group center (average position of all banners)
            let groupCenterX = 0;
            let groupCenterY = 0;
            bannerBodies.forEach(bannerBody => {
                groupCenterX += bannerBody.position.x;
                groupCenterY += bannerBody.position.y;
            });
            groupCenterX /= bannerBodies.length;
            groupCenterY /= bannerBodies.length;
            
            // Blend current group center with mouse-influenced target center
            // Lower weight on mouse creates more subtle following, less cohesion
            const blendFactor = 0.7; // 70% current group, 30% mouse target (less cohesive, more spread out)
            const blendedCenterX = groupCenterX * blendFactor + targetGroupCenter.x * (1 - blendFactor);
            const blendedCenterY = groupCenterY * blendFactor + targetGroupCenter.y * (1 - blendFactor);

            bannerBodies.forEach(bannerBody => {
                // Skip forces if this body is being dragged (let mouse constraint handle it)
                if (mouseConstraint.body === bannerBody) {
                    return;
                }

                // PRIMARY FORCE: Move towards blended group center
                // This creates the "group following" effect
                const dx = blendedCenterX - bannerBody.position.x;
                const dy = blendedCenterY - bannerBody.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance > 50) { // Only apply if banners are far apart - allows more spread
                    // Reduced force magnitude - creates slower, more subtle movement
                    // Even lower to allow more separation
                    const forceMagnitude = 0.001; // Further reduced to allow more spread
                    
                    const force = {
                        x: (dx / distance) * forceMagnitude * bannerBody.mass,
                        y: (dy / distance) * forceMagnitude * bannerBody.mass
                    };

                    Body.applyForce(bannerBody, bannerBody.position, force);
                }
                
                // SECONDARY FORCE: Direct attraction to mouse position
                // This adds the "follow mouse" effect
                const mouseDx = mousePosition.x - bannerBody.position.x;
                const mouseDy = mousePosition.y - bannerBody.position.y;
                const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

                if (mouseDistance > 10) { // Only apply if not at mouse
                    // Distance-based force - much stronger for instant response
                    const maxDistance = 500; // Reduced range for stronger response
                    const distanceFactor = Math.max(0.5, 1 - (mouseDistance / maxDistance)); // Minimum 0.5 for very strong base force
                    const mouseForceMagnitude = 0.002 * distanceFactor; // Gentle force for subtle, gradual following

                    const mouseForce = {
                        x: (mouseDx / mouseDistance) * mouseForceMagnitude * bannerBody.mass,
                        y: (mouseDy / mouseDistance) * mouseForceMagnitude * bannerBody.mass
                    };

                    // Apply force at an offset point to create torque/rotation
                    // This makes capsules rotate as they move, creating more dynamic motion
                    const offsetX = (Math.random() - 0.5) * bannerBody.width * 0.4;
                    const offsetY = (Math.random() - 0.5) * bannerBody.height * 0.4;
                    const forcePoint = {
                        x: bannerBody.position.x + offsetX,
                        y: bannerBody.position.y + offsetY
                    };

                    Body.applyForce(bannerBody, forcePoint, mouseForce);
                }
            });
        });

        // Run the engine and renderer with optimized timing for 60fps
        const runner = Runner.create({
            delta: 1000 / 60, // Target 60fps
            isFixed: true     // Fixed timestep for consistent physics
        });
        Runner.run(runner, engine);
        Render.run(render);

        // Sync DOM banner positions with Matter.js physics (with interpolation)
        // Must be called after mouseConstraint is created
        syncBannerPositions(render, bannerBodies, mouseConstraint);
    }

    function syncBannerPositions(render, bannerBodies, mouseConstraint) {
        // Track if any banner is being dragged
        let isDragging = false;
        
        // Listen for drag events to disable interpolation during drag
        Matter.Events.on(render.engine, 'beforeUpdate', () => {
            // Check if any body is being dragged via mouse constraint
            isDragging = mouseConstraint && mouseConstraint.body !== null;
        });

        // Store previous positions for interpolation and sync DOM immediately
        bannerBodies.forEach(bannerBody => {
            bannerBody.prevX = bannerBody.position.x;
            bannerBody.prevY = bannerBody.position.y;
            bannerBody.prevAngle = bannerBody.angle;
            
            // CRITICAL: Sync DOM element immediately to ensure visibility on start
            if (bannerBody.element) {
                // Matter.js position is center of body, convert to top-left for DOM
                const centerX = bannerBody.position.x - bannerBody.width / 2;
                const centerY = bannerBody.position.y - bannerBody.height / 2;
                
                // Ensure initial position is visible (clamp to viewport)
                // Start HIGHER - ensure banners are in upper portion of screen
                const clampedX = Math.max(0, Math.min(window.innerWidth - bannerBody.width, centerX));
                const clampedY = Math.max(50, Math.min(window.innerHeight * 0.6, centerY)); // Keep in upper 60% of screen
                
                bannerBody.element.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) rotate(${bannerBody.angle}rad)`;
                
                // Also update prevX/Y for interpolation
                bannerBody.prevX = bannerBody.position.x;
                bannerBody.prevY = bannerBody.position.y;
                
                console.log(`Initial sync for ${bannerBody.label}: Matter.js y=${bannerBody.position.y.toFixed(0)}, DOM y=${clampedY.toFixed(0)}, viewport height=${window.innerHeight}`);
            }
        });

        // Lower interpolation factor for smoother, slower motion
        const interpolationFactor = 0.15; // Reduced for smoother, slower visual updates

        // Update DOM banner positions - sync with Matter.js render cycle
        Matter.Events.on(render, 'afterRender', () => {
            bannerBodies.forEach(bannerBody => {
                if (bannerBody.element) {
                    const pos = bannerBody.position;
                    const angle = bannerBody.angle;
                    
                    // If dragging, update directly without interpolation for instant response
                    if (isDragging && mouseConstraint && mouseConstraint.body === bannerBody) {
                        bannerBody.prevX = pos.x;
                        bannerBody.prevY = pos.y;
                        bannerBody.prevAngle = angle;
                    } else {
                        // Smooth interpolation for non-dragged banners
                        bannerBody.prevX += (pos.x - bannerBody.prevX) * interpolationFactor;
                        bannerBody.prevY += (pos.y - bannerBody.prevY) * interpolationFactor;
                        bannerBody.prevAngle += (angle - bannerBody.prevAngle) * interpolationFactor;
                    }
                    
                    // Calculate center offset - ensure positions stay in viewport
                    const centerX = bannerBody.prevX - bannerBody.width / 2;
                    const centerY = bannerBody.prevY - bannerBody.height / 2;
                    
                    // Clamp positions to viewport bounds - keep banners visible
                    // Upper bound allows slight overflow, but keep lower bound higher to prevent falling off screen
                    const clampedX = Math.max(-bannerBody.width * 0.5, Math.min(window.innerWidth + bannerBody.width * 0.5, centerX));
                    const clampedY = Math.max(-bannerBody.height * 0.5, Math.min(window.innerHeight * 0.8, centerY)); // Keep in upper 80% of screen
                    
                    // Use transform3d for GPU-accelerated positioning (combines translate and rotate)
                    bannerBody.element.style.transform = `translate3d(${clampedX}px, ${clampedY}px, 0) rotate(${bannerBody.prevAngle}rad)`;
                    bannerBody.element.style.transformOrigin = 'center center';
                }
            });
        });
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

    // ==================== SHOW NAVIGATION AFTER OPENING ANIMATION IS OUT ====================
    // Show navigation header when opening animation is fully scrolled out
    const appHeader = document.getElementById('app-header');
    if (appHeader) {
        // Ensure it starts hidden
        appHeader.style.opacity = '0';
        appHeader.style.visibility = 'hidden';
        appHeader.style.pointerEvents = 'none';
        
        // Simple scroll listener approach
        let navShown = false;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY || window.pageYOffset;
            const viewportHeight = window.innerHeight;
            
            // Show nav when scrolled past 90% of viewport height
            if (scrollY >= viewportHeight * 0.9 && !navShown) {
                console.log('Showing navigation - scrollY:', scrollY);
                navShown = true;
                // Use inline styles to override CSS
                appHeader.style.opacity = '1';
                appHeader.style.visibility = 'visible';
                appHeader.style.pointerEvents = 'auto';
                appHeader.classList.add('visible');
            } else if (scrollY < viewportHeight * 0.9 && navShown) {
                console.log('Hiding navigation - scrollY:', scrollY);
                navShown = false;
                appHeader.style.opacity = '0';
                appHeader.style.visibility = 'hidden';
                appHeader.style.pointerEvents = 'none';
                appHeader.classList.remove('visible');
            }
        }, { passive: true });
    }

    console.log('Opening animation ready - GSAP ScrollTrigger animations initialized');

    // Show filing folder when archives section is visible
    const filingFolder = document.querySelector('.filing-folder-top');
    const archivesSection = document.querySelector('.archives-section');
    
    if (filingFolder && archivesSection) {
        // Ensure it starts hidden
        filingFolder.style.opacity = '0';
        filingFolder.style.visibility = 'hidden';
        filingFolder.style.pointerEvents = 'none';
        
        // Scroll listener to show/hide folder based on archives section visibility
        let folderShown = false;
        window.addEventListener('scroll', () => {
            const archivesRect = archivesSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Show folder when archives section is in view (when top of section is above bottom of viewport)
            const isArchivesVisible = archivesRect.top < viewportHeight && archivesRect.bottom > 0;
            
            if (isArchivesVisible && !folderShown) {
                console.log('Showing filing folder - archives section visible');
                folderShown = true;
                filingFolder.style.opacity = '1';
                filingFolder.style.visibility = 'visible';
                filingFolder.style.pointerEvents = 'auto';
            } else if (!isArchivesVisible && folderShown) {
                console.log('Hiding filing folder - archives section not visible');
                folderShown = false;
                filingFolder.style.opacity = '0';
                filingFolder.style.visibility = 'hidden';
                filingFolder.style.pointerEvents = 'none';
            }
        }, { passive: true });
    }

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

})();
