// ==================== OPENING ANIMATION WITH CAPSULE PHYSICS ====================
// Typing animation, then physics-based word capsules, then sticky footer reveal

(function() {
    // ==================== EDIT TEXT HERE ====================
    const FIRST_LINE = "Howdy,";
    const SECOND_LINE = "I'm Nazarena";
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

    // ==================== TYPING ANIMATION ====================
    const textElement = textWrapper.querySelector('.opening-large-text');
    const subtitleElement = document.createElement('div');
    subtitleElement.className = 'opening-subtitle-text';
    textWrapper.appendChild(subtitleElement);

    if (textElement) {
        // Type first line
        textElement.textContent = ''; // Clear existing text

        FIRST_LINE.split('').forEach((char, index) => {
            setTimeout(() => {
                textElement.textContent += char;

                // After first line completes, type second line
                if (index === FIRST_LINE.length - 1) {
                    setTimeout(() => {
                        typeSubtitle();
                    }, 500);
                }
            }, index * 150); // 150ms between each character
        });
    }

    function typeSubtitle() {
        let index = 0;

        const typeInterval = setInterval(() => {
            if (index < SECOND_LINE.length) {
                subtitleElement.textContent += SECOND_LINE[index];
                index++;
            } else {
                clearInterval(typeInterval);
                // After both texts are done, wait then start physics (capsules overlay the text)
                setTimeout(() => {
                    startPhysicsAnimation();
                }, 800);
            }
        }, 100);
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
        engine.gravity.y = 0.15; // Very low gravity - slower, more elegant movement
        // Lower gravity creates smoother, slower animation
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

        // Different colors for each banner
        const bannerColors = [
            '#FFE5B4', // Designer - Peach
            '#B4E5FF', // Developer - Light Blue
            '#E5B4FF', // Builder - Lavender
            '#B4FFE5'  // Fixer - Mint
        ];

        // Word banners data
        const words = ['Designer', 'Developer', 'Builder', 'Fixer'];
        const banners = [];
        const bannerBodies = []; // Matter.js bodies for physics

        // Get text font to calculate width
        const rootStyles = getComputedStyle(document.documentElement);
        const textFont = rootStyles.getPropertyValue('--capsule-text-font').trim();
        
        // Create a temporary canvas to measure text width
        const measureCanvas = document.createElement('canvas');
        const measureContext = measureCanvas.getContext('2d');
        measureContext.font = textFont;

        // Create word banners
        words.forEach((word, index) => {
            // Measure text width
            const textMetrics = measureContext.measureText(word);
            const textWidth = textMetrics.width;
            
            // Calculate banner width: text width + padding on both sides
            const padding = 80; // Padding on left and right
            const bannerWidth = textWidth + (padding * 2);
            const bannerHeight = 198; // Fixed height from SVG

            // Start positions - visible on screen, distributed across viewport
            // Add scatter/spread to initial positions for organic, varied layout
            const baseX = (window.innerWidth / (words.length + 1)) * (index + 1);
            const xVariation = (Math.random() - 0.5) * 150; // Random spread ±75px horizontally
            const x = baseX + xVariation;
            
            // Start MUCH HIGHER - in upper portion of viewport, distributed vertically
            // Use center Y position for Matter.js body (not top-left)
            // Position above the text area (text is centered, so start banners higher)
            // Add vertical variation for more organic scatter
            const baseY = 100; // Start at fixed 100px from top (much higher, always visible)
            const yVariation = (Math.random() - 0.5) * 80; // Random spread ±40px vertically
            const y = baseY + (index * 90) + yVariation; // Space them out vertically with variation
            
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
            
            // Create banner HTML structure (three-part SVG banner)
            // CRITICAL: Use inline fill color instead of CSS variable for better browser support
            bannerElement.innerHTML = `
                <div class="wanted-poster-corner wanted-poster-corner-left">
                    <svg viewBox="0 0 40.2 198.2" preserveAspectRatio="xMinYMid meet">
                        <path fill="${bannerFillColor}" d="M40.2,198.2V0h-.8v.3C39.3,22.1,21.7,39.8,0,40v115.4c21.9,0,39.7,17.8,39.7,39.7s0,2.1-.1,3.2h.7Z"/>
                    </svg>
                </div>
                <div class="wanted-poster-middle">
                    <svg class="wanted-poster-middle-svg" viewBox="0 0 355.5 198.2" preserveAspectRatio="none">
                        <rect fill="${bannerFillColor}" x="0" y="0" width="355.5" height="198.2"/>
                    </svg>
                    <div class="wanted-poster-content">
                        <span class="wanted-poster-text">${word}</span>
                    </div>
                </div>
                <div class="wanted-poster-corner wanted-poster-corner-right">
                    <svg viewBox="394.8 0 40.2 198.2" preserveAspectRatio="xMaxYMid meet">
                        <path fill="${bannerFillColor}" d="M394.8,0v198.2h.8v-.3c0-21.8,17.6-39.5,39.3-39.6V42.8c-21.9,0-39.7-17.8-39.7-39.7s0-2.1.1-3.2h-.7Z"/>
                    </svg>
                </div>
            `;
            
            console.log(`Banner ${index} (${word}) created with color: ${bannerFillColor}`);
            
            // Set display style to ensure flex layout works
            bannerElement.style.display = 'inline-flex';
            bannerElement.style.alignItems = 'stretch';
            bannerElement.style.visibility = 'visible';
            bannerElement.style.opacity = '1';
            
            // Add to physics container
            physicsContainer.appendChild(bannerElement);
            
            console.log(`Banner ${index} (${word}) DOM element created and added. Position: ${x - bannerWidth / 2}, ${y - bannerHeight / 2}`);
            
            // Add initial rotation variation - each banner starts at a different angle
            // Create varied angles between -30 and +30 degrees for organic scatter
            const angleVariation = (Math.random() - 0.5) * 0.6; // -0.3 to +0.3 radians (~-17° to +17°)
            const initialAngle = angleVariation;
            
            // Create invisible Matter.js body for physics (same size as banner)
            const bannerBody = Bodies.rectangle(x, y, bannerWidth, bannerHeight, {
                render: { visible: false }, // Invisible - we use DOM element instead
                restitution: 0.05, // Very low bounciness - prevents bouncing
                friction: 0.08,   // Slightly higher friction - slows movement
                frictionAir: 0.02, // Higher air resistance - creates slower, smoother motion
                density: 0.0005,   // Low density - responsive but smooth
                angle: initialAngle // Set initial rotation angle
            });
            
            // Store references
            bannerBody.label = word;
            bannerBody.element = bannerElement;
            bannerBody.width = bannerWidth;
            bannerBody.height = bannerHeight;
            
            // Give banner varied initial velocities for more organic scatter
            // Different velocities create natural separation and prevent clustering
            const velocityX = (Math.random() - 0.5) * 0.4; // Horizontal variation ±0.2
            const velocityY = -0.3 + (Math.random() - 0.5) * 0.2; // Upward with variation
            Body.setVelocity(bannerBody, { x: velocityX, y: velocityY });
            
            // Add slight angular velocity for natural rotation
            const angularVelocity = (Math.random() - 0.5) * 0.03; // Small rotation speed variation
            Body.setAngularVelocity(bannerBody, angularVelocity);
            
            banners.push(bannerElement);
            bannerBodies.push(bannerBody);
        });

        // Create boundaries (walls) - CRITICAL: Keep capsules in viewport
        const wallThickness = 50;
        const walls = [
            // Top wall (ceiling) - prevents capsules from escaping upward
            Bodies.rectangle(
                window.innerWidth / 2,
                -wallThickness / 2,
                window.innerWidth + 100,
                wallThickness,
                { isStatic: true, render: { fillStyle: 'transparent' } }
            ),
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

        // Add all bodies to the world
        Composite.add(engine.world, [...bannerBodies, ...walls]);
        
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
                stiffness: 0.4,  // Lower stiffness for smoother, slower dragging
                damping: 0.2,    // Higher damping for smoother, slower motion
                angularStiffness: 0.05, // Lower angular stiffness for smoother rotation
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
                
                // SECONDARY FORCE: Direct subtle attraction to mouse position
                // This adds the "slowly follow mouse" effect
                const mouseDx = mousePosition.x - bannerBody.position.x;
                const mouseDy = mousePosition.y - bannerBody.position.y;
                const mouseDistance = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                
                if (mouseDistance > 10) { // Only apply if not at mouse
                    // Distance-based force - stronger when closer, but always present
                    const maxDistance = 1500; // Larger range for more subtle following
                    const distanceFactor = Math.max(0.05, 1 - (mouseDistance / maxDistance)); // Minimum 0.05 for very subtle force
                    const mouseForceMagnitude = 0.001 * distanceFactor; // Reduced base force for slower, more subtle following
                    
                    const mouseForce = {
                        x: (mouseDx / mouseDistance) * mouseForceMagnitude * bannerBody.mass,
                        y: (mouseDy / mouseDistance) * mouseForceMagnitude * bannerBody.mass
                    };

                    Body.applyForce(bannerBody, bannerBody.position, mouseForce);
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

    // ==================== GSAP SCROLL TRIGGER - MORE PROJECTS SLIDE UP ====================
    // Animate More Projects layer sliding up over files section
    gsap.to('.more-projects-layer', {
        y: '0%',
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: '#main-content',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            markers: false
        }
    });

    console.log('Opening animation ready - GSAP ScrollTrigger animations initialized');

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
