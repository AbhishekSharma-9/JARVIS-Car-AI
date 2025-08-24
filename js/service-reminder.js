// service-reminder.js

/**
 * Primary entry point after the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Load shared components (header and chatbot)
    loadSharedComponents();

    // Initialize all page-specific functionalities
    initializePageAnimations();
    initializeStatCounters();
    initializeFloatingParticles();
    setupButtonInteractions();
    setupPagination(); // This function is now updated
});

/**
 * Loads shared components from external files.
 */
async function loadSharedComponents() {
    try {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch('/header/header.html');
            headerPlaceholder.innerHTML = await headerResponse.text();
            loadScript('/header/header.js');
        }
        
        const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
        if (chatbotPlaceholder) {
            const chatbotResponse = await fetch('/chatbot/chatbot.html');
            chatbotPlaceholder.innerHTML = await chatbotResponse.text();
            loadScript('/chatbot/chatbot.js');
        }

    } catch (error) {
        console.error('JARVIS Error: Could not load shared components.', error);
    }
}

/**
 * Dynamically creates and appends a script tag to the body.
 * @param {string} src - The source URL of the script to load.
 */
function loadScript(src) {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    document.body.appendChild(script);
}

/**
 * Initializes the initial "fade-in" animations for the first page.
 */
function initializePageAnimations() {
    const firstPage = document.querySelector('.page');
    if (!firstPage) return;

    const elementsToAnimate = firstPage.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in, .animate-bounce-in');
    elementsToAnimate.forEach((el) => {
        const delay = parseInt(el.dataset.delay, 10) || 0;
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
        }, delay);
    });
}

/**
 * Animates all progress bars to their target width when they become visible.
 * @param {Element} pageElement - The page section that is currently visible.
 */
function animateProgressBars(pageElement) {
    const progressBars = pageElement.querySelectorAll('.progress-fill');
    setTimeout(() => {
        progressBars.forEach(bar => {
            const progress = bar.getAttribute('data-progress');
            if (progress) {
                bar.style.width = progress + '%';
            }
        });
    }, 200);
}

/**
 * Animates the hero statistics, counting up from 0 to the target number.
 */
function initializeStatCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const animationDuration = 2000;

    counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute('data-target'));
        if (isNaN(target)) return;

        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / animationDuration, 1);
            const currentValue = progress * target;

            counter.textContent = (target % 1 !== 0) ? currentValue.toFixed(1) : Math.floor(currentValue);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                counter.textContent = (target % 1 !== 0) ? target.toFixed(1) : target;
            }
        };
        window.requestAnimationFrame(step);
    });
}

/**
 * Sets up an IntersectionObserver to handle animations and pagination updates as different pages are scrolled into view, and adds click handlers to dots.
 */
function setupPagination() {
    const pages = document.querySelectorAll('.page');
    const paginationContainer = document.querySelector('.pagination-dots');
    const pageContainer = document.querySelector('.page-container');

    if (!pageContainer || pages.length === 0 || !paginationContainer) {
        console.error("Pagination elements not found. Aborting setup.");
        return;
    }
    
    const pageInfo = [
        { id: 'hero', title: 'Overview', icon: 'fas fa-tachometer-alt' },
        { id: 'status', title: 'Service Status', icon: 'fas fa-clipboard-check' },
        { id: 'history', title: 'Service History', icon: 'fas fa-history' }
    ];

    paginationContainer.innerHTML = ''; 

    pages.forEach((page, index) => {
        const info = pageInfo.find(p => p.id === page.id) || { title: `Section ${index + 1}`, icon: 'fas fa-circle' };

        const dot = document.createElement('div');
        dot.className = 'pagination-dot';
        dot.dataset.section = index;
        dot.title = info.title;

        const icon = document.createElement('i');
        icon.className = info.icon;
        dot.appendChild(icon);

        dot.addEventListener('click', (e) => {
            e.preventDefault();
            page.scrollIntoView({ behavior: 'smooth' });
        });

        paginationContainer.appendChild(dot);
    });

    const dots = paginationContainer.querySelectorAll('.pagination-dot');

    const observerOptions = {
        root: pageContainer,
        threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const pageId = entry.target.id;
                const pageIndex = Array.from(pages).findIndex(p => p.id === pageId);
                
                dots.forEach(dot => dot.classList.remove('active'));
                if (dots[pageIndex]) {
                    dots[pageIndex].classList.add('active');
                }

                const elementsToAnimate = entry.target.querySelectorAll('.animate-fade-in, .animate-card-in, .animate-timeline-item');
                elementsToAnimate.forEach(el => {
                    const delay = parseInt(el.getAttribute('data-delay'), 10) || 0;
                    setTimeout(() => {
                        el.classList.add('animate-in');
                    }, delay);
                });

                if (pageId === 'status') {
                    animateProgressBars(entry.target);
                }
            }
        });
    }, observerOptions);

    pages.forEach(page => observer.observe(page));
}


/**
 * Generates and appends floating particle elements to the hero section background.
 */
function initializeFloatingParticles() {
    const particlesContainer = document.querySelector('.floating-particles');
    if (!particlesContainer) return;
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 6}s`;
        particle.style.animationDuration = `${Math.random() * 4 + 3}s`;
        particlesContainer.appendChild(particle);
    }
}

/**
 * Attaches click event listeners to all interactive buttons on the page.
 */
function setupButtonInteractions() {
    document.body.addEventListener('click', (e) => {
        const scheduleBtn = e.target.closest('.schedule-btn');
        if (scheduleBtn) {
            const serviceName = scheduleBtn.closest('.service-card')?.querySelector('.card-title')?.textContent;
            if (serviceName) {
                showNotification(`Appointment request for "${serviceName}" submitted.`);
            }
        }
    });
}

/**
 * Displays a temporary notification message on the screen.
 * @param {string} message - The message to display in the notification.
 */
function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification success';
    notification.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('show'), 100);
    setTimeout(() => {
        notification.classList.remove('show');
        notification.addEventListener('transitionend', () => notification.remove());
    }, 4000);
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}
