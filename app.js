// ==================== CHAT INTERFACE APPLICATION ====================
// Main application logic for the chat interface

class ChatApp {
    constructor() {
        // ==================== APPLICATION STATE ====================
        this.data = null;
        this.messages = [];
        this.isTyping = false;
        this.currentCarouselIndex = 0;
        this.isMobile = window.innerWidth <= 768; // Will be updated after data loads
        
        this.init();
    }

    // ==================== INITIALIZATION ====================
    async init() {
        try {
            // Load data first
            await this.loadData();
            
            // Initialize with empty messages 
            this.messages = [];
            this.isTyping = false; // Ensure we start in a ready state
            
            // Update mobile state with loaded config
            this.isMobile = window.innerWidth <= this.data.config.ui.mobileBreakpoint;
            
            // Setup the rest of the application
            this.setupEventListeners();
            this.renderMessages();
            this.renderPrompts();
            this.updateCurrentTime();
            this.updateIntroGreeting();
            
            // Apply theme after DOM is ready
            setTimeout(() => this.applyTheme(), 100);
            
            // Initialize typewriter animation
            this.initTypewriter();
            
                    // Update mobile state on resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= this.data.config.ui.mobileBreakpoint;
        });
            
            // Update time every minute
            setInterval(() => this.updateCurrentTime(), 60000);
        } catch (error) {
            console.error('Failed to initialize app:', error);
        }
    }

    // ==================== DATA LOADING ====================
    async loadData() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.data = await response.json();
        } catch (error) {
            console.error('Failed to load data:', error);
            // Fallback to basic data if JSON fails to load
            this.data = {
                portfolio: [],
                prompts: [],
                responses: {},
                defaultResponses: ["I'm sorry, I couldn't load the data properly."],
                config: {
                    typing: { delay: 1000, secondMessageDelay: 1500 },
                    carousel: { autoSlide: false, slideInterval: 5000, swipeThreshold: 50 },
                    ui: { mobileBreakpoint: 768, maxMessageWidth: { mobile: 85, desktop: 75 }, scrollBehavior: 'smooth' }
                }
            };
        }
    }

    // ==================== EVENT LISTENERS SETUP ====================
    setupEventListeners() {
        // Event listeners setup
    }

    // ==================== TIME AND STATUS MANAGEMENT ====================
    updateIntroGreeting() {
        const introHeading = document.getElementById('intro-heading');
        if (!introHeading) {
            console.error('Could not find intro-heading element');
            return;
        }
        
        const now = new Date();
        const hour = now.getHours();
        
        let greeting;
        if (hour < 12) {
            greeting = "Morning!";
        } else if (hour < 17) {
            greeting = "Afternoon!";
        } else {
            greeting = "Evening!";
        }
        
        const currentHTML = introHeading.innerHTML;
        const newHTML = currentHTML.replace(/^Howdy,/, `<span class="greeting-text">${greeting},</span>`);
        
        if (currentHTML !== newHTML) {
            introHeading.innerHTML = newHTML;
        }
    }

    // ==================== MESSAGE HANDLING ====================
    handleSendMessage() {
        const input = document.getElementById('message-input-field');
        const content = input.value.trim();
        
        if (!content || this.isTyping) return;

        const userMessage = {
            id: Date.now().toString(),
            content,
            sender: 'user',
            timestamp: new Date(),
            type: 'text'
        };

        this.messages.push(userMessage);
        input.value = '';
        this.renderMessages();
        this.generateAIResponse(content);
    }

    // ==================== PROMPT MATCHING ====================
    findMatchingPrompt(userInput) {
        const trimmedInput = userInput.trim();
        
        // 1. Check for exact match
        if (this.data.responses[trimmedInput]) {
            return trimmedInput;
        }
        
        // 2. Check for case-insensitive match
        for (const prompt of this.data.prompts) {
            if (prompt.toLowerCase() === trimmedInput.toLowerCase()) {
                return prompt;
            }
        }
        
        // 3. Check for partial matches (contains)
        for (const prompt of this.data.prompts) {
            if (prompt.toLowerCase().includes(trimmedInput.toLowerCase()) || 
                trimmedInput.toLowerCase().includes(prompt.toLowerCase())) {
                return prompt;
            }
        }
        
        // 4. No match found
        return null;
    }

    generateAIResponse(userMessage) {
        this.isTyping = true;
        this.showTypingIndicator();

        setTimeout(() => {
            // Check for special commands first
            const lowercaseMessage = userMessage.toLowerCase().trim();
            
            if (lowercaseMessage === 'prompts' || lowercaseMessage === 'list') {
                this.handlePromptsListRequest();
                return;
            }
            
            // Try to find a matching prompt
            const matchingPrompt = this.findMatchingPrompt(userMessage);
            const responses = matchingPrompt ? this.data.responses[matchingPrompt] : null;
            
            if (responses) {
                this.handleMultipleResponses(responses);
            } else {
                this.handleSingleResponse(this.getDefaultResponse());
            }
        }, this.data.config.typing.delay);
    }

    handlePromptsListRequest() {
        const promptsMessage = {
            id: Date.now().toString(),
            sender: 'ai',
            timestamp: new Date(),
            content: 'prompts-list',
            type: 'component',
            prompts: this.data.prompts
        };
        
        this.messages.push(promptsMessage);
        this.isTyping = false;
        this.renderMessages();
    }

    handleMultipleResponses(responses) {
        // Send first message
        const firstMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            timestamp: new Date(),
            ...responses[0]  // Copy all properties from the response
        };
        
        this.messages.push(firstMessage);
        this.renderMessages();
        
        // Send remaining messages with delays
        this.sendRemainingMessages(responses.slice(1), 1);
    }

    sendRemainingMessages(remainingResponses, messageIndex) {
        if (remainingResponses.length === 0) {
            this.isTyping = false;
            this.renderMessages();
            return;
        }

        setTimeout(() => {
            const message = {
                id: (Date.now() + messageIndex + 1).toString(),
                sender: 'ai',
                timestamp: new Date(),
                ...remainingResponses[0]  // Copy all properties from the response
            };
            
            this.messages.push(message);
            this.renderMessages();
            
            // Send next message or finish
            if (remainingResponses.length > 1) {
                this.sendRemainingMessages(remainingResponses.slice(1), messageIndex + 1);
            } else {
                this.isTyping = false;
                this.renderMessages();
            }
        }, this.data.config.typing.secondMessageDelay);
    }

    handleSingleResponse(response) {
        const aiMessage = {
            id: (Date.now() + 1).toString(),
            sender: 'ai',
            timestamp: new Date(),
            ...response  // Copy all properties from the response
        };
        
        this.messages.push(aiMessage);
        this.isTyping = false;
        this.renderMessages();
    }

    getDefaultResponse() {
        const randomResponse = this.data.defaultResponses[Math.floor(Math.random() * this.data.defaultResponses.length)];
        return {
            content: randomResponse + " This is a mock response to demonstrate the AI agent functionality. In a real implementation, this would be connected to an actual AI service.",
            type: 'text'
        };
    }

    showTypingIndicator() {
        this.renderMessages();
    }

    // ==================== MESSAGE RENDERING ====================
    renderMessages() {
        const messagesContainer = document.getElementById('messages-list');
        messagesContainer.innerHTML = '';

        this.messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });

        if (this.isTyping) {
            const typingIndicator = this.createTypingIndicator();
            messagesContainer.appendChild(typingIndicator);
        }

        // Scroll to bottom
        const scrollContainer = document.getElementById('messages-scroll-container');
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
        
        // Set up event listeners for prompt pills
        this.setupPromptPillListeners();
        
        // Set up event listeners for expandable project cards
        this.setupProjectCardListeners();
        
        // Set up event listeners for case study cards
        this.setupCaseStudyListeners();
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message-wrapper ${message.sender === 'user' ? 'user' : 'ai'}`;
        
        // Add work-showcase class if message contains work showcase
        const isWorkShowcase = message.type === 'component' && (message.content === 'portfolio' || message.content.startsWith('portfolio-'));
        const workShowcaseClass = isWorkShowcase ? ' work-showcase-bubble' : '';
        
        messageDiv.innerHTML = `
            <div class="message-bubble ${message.sender === 'user' ? 'user' : 'ai'}${workShowcaseClass}">
                ${message.type === 'component' ? this.renderComponent(message.content, message) : this.renderTextMessage(message)}
            </div>
        `;
        return messageDiv;
    }

    renderComponent(content, messageData = null) {
        if (content === 'portfolio') {
            return this.createWorkShowcase();
        }
        if (content.startsWith('portfolio-')) {
            const projectIndex = parseInt(content.split('-')[1]);
            return this.createWorkShowcase(projectIndex);
        }
        if (content.startsWith('case-study-')) {
            const studyIndex = parseInt(content.split('-')[2]);
            return this.createCaseStudyCard(studyIndex);
        }
        if (content === 'photos' && messageData && messageData.photos) {
            return this.createPhotoGallery(messageData.photos);
        }
        if (content === 'prompts-list' && messageData && messageData.prompts) {
            return this.createPromptsList(messageData.prompts);
        }
        return content;
    }

    createPromptsList(prompts) {
        const promptPills = prompts.map((prompt, index) => 
            `<button class="prompt-pill" data-prompt="${prompt.replace(/"/g, '&quot;')}">${prompt}</button>`
        ).join('');
        
        return `
            <div class="prompts-list-container">
                <div class="prompts-list-header">Here are all the available prompts you can try:</div>
                <div class="prompts-pills-container">
                    ${promptPills}
                </div>
                <div class="prompts-list-footer">Just click any of these, or feel free to ask in your own words! ✨</div>
            </div>
        `;
    }

    setupPromptPillListeners() {
        const promptPills = document.querySelectorAll('.prompt-pill');
        promptPills.forEach(pill => {
            // Remove existing listeners to prevent duplicates
            pill.removeEventListener('click', this.handlePromptPillClick);
            pill.addEventListener('click', (e) => this.handlePromptPillClick(e));
        });
    }

    handlePromptPillClick(event) {
        const prompt = event.target.getAttribute('data-prompt');
        if (prompt && !this.isTyping) {
            // Add user message to show what was clicked
            const userMessage = {
                id: Date.now().toString(),
                content: prompt,
                sender: 'user',
                timestamp: new Date(),
                type: 'text'
            };
            
            this.messages.push(userMessage);
            this.renderMessages();
            
            // Generate AI response for the clicked prompt
            this.generateAIResponse(prompt);
        }
    }

    setupProjectCardListeners() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            // Remove existing listeners to prevent duplicates
            card.removeEventListener('click', this.handleProjectCardClick);
            card.addEventListener('click', (e) => this.handleProjectCardClick(e));
        });
    }

    handleProjectCardClick(event) {
        // Don't trigger on button clicks
        if (event.target.closest('.project-action-btn')) {
            return;
        }
        
        const card = event.currentTarget;
        const isExpanded = card.classList.contains('expanded');
        
        // Collapse all other cards first
        document.querySelectorAll('.project-card.expanded').forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.remove('expanded');
            }
        });
        
        // Toggle the clicked card
        card.classList.toggle('expanded', !isExpanded);
    }

    setupCaseStudyListeners() {
        const caseStudyCards = document.querySelectorAll('.case-study-card');
        caseStudyCards.forEach(card => {
            // Remove existing listeners to prevent duplicates
            card.removeEventListener('click', this.handleCaseStudyClick);
            card.addEventListener('click', (e) => this.handleCaseStudyClick(e));
        });
    }

    handleCaseStudyClick(event) {
        const card = event.currentTarget;
        const isExpanded = card.classList.contains('expanded');
        
        // Collapse all other case study cards first
        document.querySelectorAll('.case-study-card.expanded').forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.classList.remove('expanded');
            }
        });
        
        // Toggle the clicked card
        card.classList.toggle('expanded', !isExpanded);
    }

    renderTextMessage(message) {
        return `
            ${message.title ? `<div class="message-title">${message.title}</div>` : ''}
            <div class="message-content">${message.content}</div>
        `;
    }

    createTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message-wrapper ai';
        typingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="typing-dots">
                    <div class="typing-dot animate-bounce-dot"></div>
                    <div class="typing-dot animate-bounce-dot"></div>
                    <div class="typing-dot animate-bounce-dot"></div>
                </div>
            </div>
        `;
        return typingDiv;
    }

    // ==================== WORK SHOWCASE ====================
    createWorkShowcase(projectIndex = null) {
        // Check if data is loaded properly
        if (!this.data || !this.data.portfolio || !this.data.portfolio.length) {
            return `
                <div class="work-showcase">
                    <div class="work-showcase-content">
                        <h3 class="work-showcase-title">Portfolio Loading...</h3>
                        <p class="work-showcase-description">Please wait while the portfolio data loads.</p>
                    </div>
                </div>
            `;
        }
        
        // If a specific project index is provided, show only that project (for backward compatibility)
        if (projectIndex !== null && projectIndex >= 0) {
            const featuredWork = this.data.portfolio[projectIndex] || this.data.portfolio[0];
            return this.createSingleProjectCard(featuredWork);
        }
        
        // Show all projects in an expandable grid
        const projectCards = this.data.portfolio.map((project, index) => 
            this.createExpandableProjectCard(project, index)
        ).join('');
        
        return `
            <div class="projects-grid">
                <div class="projects-grid-header">
                    <h3>Recent Work</h3>
                    <p>Click on any project to see more details</p>
                </div>
                <div class="projects-grid-container">
                    ${projectCards}
                </div>
            </div>
        `;
    }

    createSingleProjectCard(project) {
        return `
            <div class="work-showcase">
                <img
                    src="${project.image}"
                    alt="${project.title}"
                    class="work-showcase-image"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                />
                <div class="work-showcase-content">
                    <h3 class="work-showcase-title">${project.title}</h3>
                    <p class="work-showcase-description">${project.description}</p>
                </div>
            </div>
        `;
    }

    createCaseStudyCard(studyIndex) {
        // Check if data is loaded properly
        if (!this.data || !this.data.portfolio || !this.data.portfolio.length) {
            return '<div class="case-study-card">Case study loading...</div>';
        }
        
        const project = this.data.portfolio[studyIndex] || this.data.portfolio[0];
        
        return `
            <div class="case-study-card" data-study-index="${studyIndex}">
                <div class="case-study-header">
                    <div class="case-study-header-left">
                        <span class="case-study-icon">${project.icon || '📋'}</span>
                        <div class="case-study-title-section">
                            <h3 class="case-study-title">${project.title}</h3>
                            <p class="case-study-description-header">${project.description}</p>
                        </div>
                    </div>
                    <div class="case-study-header-right">
                        <svg class="case-study-expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                    </div>
                </div>
                
                <div class="case-study-expanded-content">
                    <div class="case-study-image-section">
                        <img 
                            src="${project.image}" 
                            alt="${project.title}"
                            class="case-study-image"
                            onerror="this.style.display='none'"
                        />
                    </div>
                    
                    <div class="case-study-details">
                        <div class="case-study-section">
                            <h4>Challenge</h4>
                            <p>${project.challenge || 'Challenge details not available.'}</p>
                        </div>
                        
                        <div class="case-study-section">
                            <h4>Solution</h4>
                            <p>${project.solution || 'Solution details not available.'}</p>
                        </div>
                        
                        <div class="case-study-section">
                            <h4>Impact</h4>
                            <p>${project.impact || 'Impact details not available.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    createExpandableProjectCard(project, index) {
        const tagsHtml = project.tags ? project.tags.map(tag => 
            `<span class="project-tag">${tag}</span>`
        ).join('') : '';
        
        return `
            <div class="project-card" data-project-index="${index}">
                <div class="project-card-header">
                    <img
                        src="${project.image}"
                        alt="${project.title}"
                        class="project-card-image"
                        onerror="this.style.display='none'"
                    />
                    <div class="project-card-overlay">
                        <span class="project-type">${project.type || 'Project'}</span>
                    </div>
                </div>
                <div class="project-card-content">
                    <h4 class="project-card-title">${project.title}</h4>
                    <p class="project-card-description">${project.description}</p>
                    <div class="project-card-expanded-content">
                        <div class="project-tags">
                            ${tagsHtml}
                        </div>
                        <div class="project-card-actions">
                            <button class="project-action-btn primary" onclick="alert('View Project: ${project.title}')">
                                View Project
                            </button>
                            <button class="project-action-btn secondary" onclick="alert('Learn More: ${project.title}')">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
                <div class="project-card-toggle">
                    <svg class="expand-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>
        `;
    }

    // ==================== PHOTO GALLERY ====================
    createPhotoGallery(photos) {
        if (!photos || !Array.isArray(photos) || photos.length === 0) {
            return '<div>Photos loading...</div>';
        }
        
        const galleryId = 'photo-gallery-' + Date.now();
        
        // For mobile: create slider structure
        if (this.isMobile) {
            const trackHtml = photos.map(photo => `
                <div class="photo-gallery-item">
                    <img
                        src="${photo.url}"
                        alt="${photo.alt}"
                        class="photo-gallery-image"
                        onerror="this.style.display='none'"
                    />
                </div>
            `).join('');
            
            const dotsHtml = photos.map((_, index) => `
                <div class="photo-gallery-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>
            `).join('');
            
            setTimeout(() => {
                this.initializePhotoSlider(galleryId);
            }, 100);
            
            return `
                <div id="${galleryId}" class="photo-gallery">
                    <div class="photo-gallery-track">
                        ${trackHtml}
                    </div>
                    <div class="photo-gallery-nav">
                        ${dotsHtml}
                    </div>
                </div>
            `;
        }
        
        // For desktop: simple flex layout
        return `
            <div class="photo-gallery">
                ${photos.map(photo => `
                    <div class="photo-gallery-item">
                        <img
                            src="${photo.url}"
                            alt="${photo.alt}"
                            class="photo-gallery-image"
                            onerror="this.style.display='none'"
                        />
                    </div>
                `).join('')}
            </div>
        `;
    }

    // ==================== PORTFOLIO CAROUSEL (HIDDEN) ====================
    createPortfolioCarousel() {
        const carouselId = 'portfolio-carousel-' + Date.now();
        
        const itemsHtml = this.data.portfolio.map((item, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : ''}" style="display: ${index === 0 ? 'block' : 'none'}">
                <div class="portfolio-card p-3 sm:p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div class="space-y-3 sm:space-y-4">
                        <div class="portfolio-image-container relative">
                            <img
                                src="${item.image}"
                                alt="${item.title}"
                                class="portfolio-image w-full object-cover rounded-lg"
                                style="height: 400px;"
                                onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                            />
                            <div class="portfolio-image-fallback w-full rounded-lg image-fallback" style="display: none; height: 400px;">
                                ${item.title.substring(0, 2).toUpperCase()}
                            </div>
                            <span class="portfolio-type-badge absolute top-2 right-2 bg-black/70 dark:bg-white/20 text-white text-xs px-2 py-1 rounded">
                                ${item.type}
                            </span>
                        </div>
                        
                        <div class="portfolio-content space-y-2">
                            <h3 class="portfolio-title ${this.isMobile ? 'text-base' : 'text-lg'} text-gray-900 dark:text-gray-100">${item.title}</h3>
                            <p class="portfolio-description text-xs sm:text-sm text-gray-600 dark:text-gray-400">${item.description}</p>
                            
                            <div class="portfolio-tags flex flex-wrap gap-1 sm:gap-2">
                                ${item.tags.map(tag => `
                                    <span class="portfolio-tag text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-2 py-1 rounded">
                                        ${tag}
                                    </span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        const navigationHtml = !this.isMobile ? `
            <button class="carousel-nav-button carousel-button prev" onclick="chatApp.previousSlide('${carouselId}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
            <button class="carousel-nav-button carousel-button next" onclick="chatApp.nextSlide('${carouselId}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        ` : '';

        setTimeout(() => {
            this.initializeCarousel(carouselId);
        }, 100);

        return `
            <div class="portfolio-carousel-wrapper w-full max-w-2xl mx-auto">
                <div id="${carouselId}" class="carousel-container relative">
                    <div class="carousel-track">
                        ${itemsHtml}
                    </div>
                    ${navigationHtml}
                </div>
                <div class="carousel-instructions text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    ${this.isMobile ? 'Swipe to navigate through portfolio items' : 'Swipe or use arrows to navigate through portfolio items'}
                </div>
            </div>
        `;
    }

    // ==================== CAROUSEL INTERACTION ====================
    initializeCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        this.currentCarouselIndex = 0;
        
        // Add touch support for mobile
        if (this.isMobile) {
            this.addTouchSupport(carousel);
        }
    }

    addTouchSupport(carousel) {
        let startX = 0;
        let startY = 0;
        let threshold = this.data.config.carousel.swipeThreshold;

        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        carousel.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            let endX = e.changedTouches[0].clientX;
            let endY = e.changedTouches[0].clientY;
            
            let diffX = startX - endX;
            let diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.nextSlide(carousel.id);
                } else {
                    this.previousSlide(carousel.id);
                }
            }
        });
    }

    nextSlide(carouselId) {
        const carousel = document.getElementById(carouselId);
        const items = carousel.querySelectorAll('.carousel-item');
        
        items[this.currentCarouselIndex].style.display = 'none';
        this.currentCarouselIndex = (this.currentCarouselIndex + 1) % items.length;
        items[this.currentCarouselIndex].style.display = 'block';
    }

    previousSlide(carouselId) {
        const carousel = document.getElementById(carouselId);
        const items = carousel.querySelectorAll('.carousel-item');
        
        items[this.currentCarouselIndex].style.display = 'none';
        this.currentCarouselIndex = this.currentCarouselIndex === 0 ? items.length - 1 : this.currentCarouselIndex - 1;
        items[this.currentCarouselIndex].style.display = 'block';
    }

    // ==================== PHOTO SLIDER ====================
    initializePhotoSlider(galleryId) {
        const gallery = document.getElementById(galleryId);
        if (!gallery) return;

        const track = gallery.querySelector('.photo-gallery-track');
        const items = gallery.querySelectorAll('.photo-gallery-item');
        const dots = gallery.querySelectorAll('.photo-gallery-dot');
        
        if (!track || !items.length || !dots.length) return;

        let currentIndex = 0;

        const updateSlider = (index) => {
            // Update track position
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Update dots
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            currentIndex = index;
        };

        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlider(index);
            });
        });

        // Touch support
        let startX = 0;
        let startY = 0;
        const threshold = 50;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        track.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;

            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
                if (diffX > 0 && currentIndex < items.length - 1) {
                    // Swipe left - next image
                    updateSlider(currentIndex + 1);
                } else if (diffX < 0 && currentIndex > 0) {
                    // Swipe right - previous image
                    updateSlider(currentIndex - 1);
                }
            }

            startX = 0;
            startY = 0;
        });
    }


    // ==================== TYPEWRITER ANIMATION ====================
    initTypewriter() {
        const typewriterElements = document.querySelectorAll('.typewriter-text');
        
        typewriterElements.forEach((element, index) => {
            const text = element.getAttribute('data-text');
            const delay = 800; // Start much earlier
            
            // Clear initial content
            element.textContent = '';
            
            setTimeout(() => {
                this.typeText(element, text, 40, () => {
                    // After "Howdy" is done, fade in the rest of the intro
                    this.fadeInIntroContent();
                }); // 40ms per character - faster
            }, delay);
        });
    }

    typeText(element, text, speed, callback) {
        let index = 0;
        element.classList.add('typing');
        
        const timer = setInterval(() => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
            } else {
                element.classList.remove('typing');
                clearInterval(timer);
                // Call callback when typing is complete
                if (callback) callback();
            }
        }, speed);
    }

    fadeInIntroContent() {
        // Fade in the rest of the intro text
        const introRest = document.querySelector('.intro-content-rest');
        if (introRest) {
            setTimeout(() => {
                introRest.classList.add('fade-in');
                // After intro text fades in, show the main content after 1 second
                setTimeout(() => {
                    this.showMainContent();
                }, 1000); // Wait 1 second after intro text appears
            }, 300); // Small delay after "Howdy"
        }
    }

    showMainContent() {
        const mainContentSection = document.querySelector('.main-content-section');
        
        if (mainContentSection) {
            mainContentSection.classList.add('main-content-fade-in');
            // Add initial chatbot messages after a short delay
            setTimeout(() => {
                this.addInitialMessages();
            }, 600); // Small delay after content appears
        }
    }

    addInitialMessages() {
        // Ensure we're not in typing state
        this.isTyping = false;
        
        // Add the first chatbot message
        this.messages.push({
            sender: 'ai',
            content: 'Want to know more about my background, what I\'ve worked on, or what I do when I\'m not in front of the computer, or with a sharpie writing out a thousand post-its? Ask away. ✨',
            timestamp: new Date(),
            type: 'text'
        });

        // Add the second chatbot message after a brief delay
        setTimeout(() => {
            this.messages.push({
                sender: 'ai',
                content: 'You can try things like "tell me about your background" or "show me some work" or "what kick are you currently on". At any point, if you want a list of all available prompts (cheat!), say "list".',
                timestamp: new Date(),
                type: 'text'
            });
            // Ensure typing state is still false after second message
            this.isTyping = false;
            this.renderMessages();
        }, 1500); // 1.5 second delay between messages

        this.renderMessages();
    }
}

// ==================== APPLICATION INITIALIZATION ====================
// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.chatApp = new ChatApp();
});