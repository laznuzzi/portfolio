// ==================== OPENING ANIMATION WITH CAPSULE PHYSICS ====================
// Typing animation, then physics-based word capsules, then sticky footer reveal

(function() {
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
    const text = "Howdy";
    const textElement = textWrapper.querySelector('.opening-large-text');

    if (textElement) {
        textElement.textContent = ''; // Clear existing text

        // Type out each character
        text.split('').forEach((char, index) => {
            setTimeout(() => {
                textElement.textContent += char;

                // After typing completes, wait then show physics
                if (index === text.length - 1) {
                    setTimeout(() => {
                        startPhysicsAnimation();
                    }, 800); // Wait 800ms after typing finishes
                }
            }, index * 150); // 150ms between each character
        });
    }

    // ==================== PHYSICS ANIMATION ====================
    function startPhysicsAnimation() {
        // Fade out "Howdy" text
        gsap.to(textWrapper, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                textWrapper.style.display = 'none';

                // Show physics container
                physicsContainer.style.display = 'block';
                gsap.fromTo(physicsContainer,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5, onComplete: initPhysics }
                );
            }
        });
    }

    function initPhysics() {
        const { Engine, Render, Bodies, Composite, Runner, Mouse, MouseConstraint, Events, Body, Vector } = Matter;

        // Create engine
        const engine = Engine.create();
        engine.gravity.y = 1; // Ensure gravity is working
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

        // Word capsules data
        const words = ['Designer', 'Developer', 'Builder', 'Fixer'];
        const capsules = [];

        // Create word capsules
        words.forEach((word, index) => {
            // Calculate capsule dimensions based on text length - MUCH BIGGER
            const width = word.length * 40 + 100;  // Doubled from 20 + increased base
            const height = 80;  // Increased from 50

            // Random starting position (top of screen)
            const x = Math.random() * (window.innerWidth - width) + width / 2;
            const y = -100 - (index * 150); // Stagger vertical start positions

            // Create capsule body (rounded rectangle)
            const capsule = Bodies.rectangle(x, y, width, height, {
                chamfer: { radius: height / 2 },  // Fully rounded ends
                render: {
                    fillStyle: '#ffffff',
                    strokeStyle: '#333333',
                    lineWidth: 3
                },
                restitution: 0.6, // Bounciness
                friction: 0.05,
                frictionAir: 0.01,
                density: 0.001  // Lower density for better mouse interaction
            });

            // Store word data
            capsule.label = word;
            capsules.push(capsule);
        });

        // Create boundaries (walls)
        const wallThickness = 50;
        const walls = [
            // Ground
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
                window.innerHeight * 2,
                { isStatic: true, render: { fillStyle: 'transparent' } }
            ),
            // Right wall
            Bodies.rectangle(
                window.innerWidth + wallThickness / 2,
                window.innerHeight / 2,
                wallThickness,
                window.innerHeight * 2,
                { isStatic: true, render: { fillStyle: 'transparent' } }
            )
        ];

        // Add all bodies to the world
        Composite.add(engine.world, [...capsules, ...walls]);

        // Add mouse interaction with better settings
        const mouse = Mouse.create(render.canvas);
        const mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 1,  // Max stiffness for best interaction
                damping: 0,
                angularStiffness: 0.2,
                render: { visible: false }
            }
        });
        Composite.add(engine.world, mouseConstraint);

        // Keep render mouse in sync with mouse object
        render.mouse = mouse;

        // Log mouse events for debugging
        Events.on(mouseConstraint, 'startdrag', function(event) {
            console.log('Started dragging:', event.body.label);
        });

        Events.on(mouseConstraint, 'enddrag', function(event) {
            console.log('Stopped dragging:', event.body.label);
        });

        // Allow wheel events to pass through for scrolling
        render.canvas.style.touchAction = 'none'; // Better for touch devices

        // Make sure scroll events can trigger on the opening animation container
        // The canvas should not block page scroll
        render.canvas.addEventListener('wheel', (e) => {
            // Let the scroll event bubble up to trigger ScrollTrigger
            // Don't preventDefault so scrolling still works
        }, { passive: true });

        // Run the engine and renderer
        const runner = Runner.create();
        Runner.run(runner, engine);
        Render.run(render);

        // Draw text on canvas
        drawTextOnCapsules(render, capsules);

        // Add mouse hover influence - capsules move with mouse movement
        let mousePosition = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        render.canvas.addEventListener('mousemove', (event) => {
            const rect = render.canvas.getBoundingClientRect();
            mousePosition.x = event.clientX - rect.left;
            mousePosition.y = event.clientY - rect.top;
        });

        // Apply force to capsules based on mouse position
        Events.on(engine, 'beforeUpdate', () => {
            capsules.forEach(capsule => {
                // Calculate vector from capsule to mouse
                const forceMagnitude = 0.003; // Increased for stronger effect
                const maxDistance = 400; // Increased range

                const dx = mousePosition.x - capsule.position.x;
                const dy = mousePosition.y - capsule.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Only apply force if mouse is within range
                if (distance < maxDistance && distance > 0) {
                    // Make vertical force stronger to overcome gravity
                    const verticalMultiplier = dy < 0 ? 2.5 : 1; // 2.5x stronger when pulling up

                    const force = {
                        x: (dx / distance) * forceMagnitude * capsule.mass,
                        y: (dy / distance) * forceMagnitude * capsule.mass * verticalMultiplier
                    };

                    Body.applyForce(capsule, capsule.position, force);
                }
            });
        });
    }

    function drawTextOnCapsules(render, capsules) {
        const canvas = render.canvas;
        const context = render.context;

        // Draw text after each render
        Matter.Events.on(render, 'afterRender', () => {
            capsules.forEach(capsule => {
                const pos = capsule.position;
                const angle = capsule.angle;

                context.save();
                context.translate(pos.x, pos.y);
                context.rotate(angle);

                // Draw text - bigger font to match larger capsules
                context.fillStyle = '#333333';
                context.font = '700 28px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
                context.textAlign = 'center';
                context.textBaseline = 'middle';
                context.fillText(capsule.label, 0, 0);

                context.restore();
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
