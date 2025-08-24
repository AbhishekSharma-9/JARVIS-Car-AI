// sensor-integrity.js

/**
 * Primary entry point after the DOM is fully loaded.
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Load shared header and wait for it to be ready
    await loadSharedComponents();

    // --- INITIALIZE HEADER FUNCTIONALITY ---
    initializeThemeLogic();
    initializeActiveNav();
    initializeMobileMenu();

    initializeSensorPage();
});

/**
 * Loads the shared header component from an external file using fetch.
 */
async function loadSharedComponents() {
    try {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch('/header/header.html');
            headerPlaceholder.innerHTML = await headerResponse.text();
        }
    } catch (error) {
        console.error('JARVIS Error: Could not load shared header component.', error);
    }
}

/**
 * Sets up the theme toggling functionality.
 */
function initializeThemeLogic() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (!themeToggleButton) {
        console.error("Theme toggle button not found in loaded header.");
        return;
    }

    const applyTheme = (theme) => {
        const icon = themeToggleButton.querySelector('i');
        if (theme === 'light') {
            document.body.classList.add('light-theme');
            if (icon) icon.className = 'fas fa-sun';
        } else {
            document.body.classList.remove('light-theme');
            if (icon) icon.className = 'fas fa-moon';
        }
    };

    // On page load, check localStorage for a saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Add a click listener to the button to toggle the theme
    themeToggleButton.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        if (isLight) {
            localStorage.setItem('theme', 'dark');
            applyTheme('dark');
        } else {
            localStorage.setItem('theme', 'light');
            applyTheme('light');
        }
    });
}

/**
 * Sets the 'active' class on the correct navigation link based on the current page.
 */
function initializeActiveNav() {
    const path = window.location.pathname;
    const currentPage = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        if (item.tagName === 'A') {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        }
    });
}

/**
 * Sets up the toggle functionality for the mobile navigation menu.
 */
function initializeMobileMenu() {
    const menuToggleBtn = document.querySelector('.menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const navbar = document.querySelector('.navbar');

    if (menuToggleBtn && mobileMenu && navbar) {
        menuToggleBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            mobileMenu.classList.toggle('open');
            const toggleIcon = menuToggleBtn.querySelector('i');
            if (mobileMenu.classList.contains('open')) {
                toggleIcon.classList.remove('fa-bars');
                toggleIcon.classList.add('fa-times');
            } else {
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });

        document.addEventListener('click', (event) => {
            if (!navbar.contains(event.target) && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                const toggleIcon = menuToggleBtn.querySelector('i');
                toggleIcon.classList.remove('fa-times');
                toggleIcon.classList.add('fa-bars');
            }
        });
    }
}


/**
 * Initializes all logic specific to the Sensor Integrity page.
 */
function initializeSensorPage() {
    // --- Elements ---
    const paginationDots = document.querySelectorAll('.pagination-dot');
    const sections = document.querySelectorAll('.sensor-section');
    const scrollContainer = document.querySelector('.scroll-container');
    const miniChartCanvases = document.querySelectorAll('.mini-chart');

    // --- SCROLL-SNAPPING PAGE NAVIGATION ---
    let currentSection = 0;
    let isScrolling = false;
    let scrollTimeout;

    // Updates which pagination dot is highlighted as 'active'.
    const updateActiveDot = (sectionIndex) => {
        paginationDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === sectionIndex);
        });
    };

    // Updates the URL hash to reflect the current section.
    const updateURL = (sectionIndex) => {
        const sectionNames = ['overview', 'engine-systems', 'wheels-power', 'anomaly-detection', 'ai-insights'];
        if(sectionIndex >= 0 && sectionIndex < sectionNames.length) {
            history.replaceState(null, null, `#${sectionNames[sectionIndex]}`);
        }
    };
    
    // Smoothly scrolls the page to the selected section.
    const scrollToSection = (sectionIndex) => {
        if (isScrolling || sectionIndex < 0 || sectionIndex >= sections.length) return;
        
        isScrolling = true;
        const targetSection = sections[sectionIndex];
        
        if (targetSection) {
            scrollContainer.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });

            const checkScrollEnd = () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    isScrolling = false;
                    currentSection = sectionIndex;
                    updateActiveDot(currentSection);
                    updateURL(currentSection);
                }, 500);
            };
            
            scrollContainer.addEventListener('scroll', checkScrollEnd, { once: true });
            checkScrollEnd();
        } else {
            isScrolling = false;
        }
    };
    
    // Add click listeners to each pagination dot.
    paginationDots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const sectionIndex = parseInt(dot.dataset.section, 10);
            scrollToSection(sectionIndex);
        });
    });

    // Handles manual user scrolling.
    const handleManualScroll = () => {
        if (isScrolling) return;

        const scrollTop = scrollContainer.scrollTop;
        let closestSection = 0;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const distance = Math.abs(scrollTop - sectionTop);
            const closestDistance = Math.abs(scrollTop - sections[closestSection].offsetTop);
            if(distance < closestDistance) {
                closestSection = index;
            }
        });
        
        if (currentSection !== closestSection) {
            currentSection = closestSection;
            updateActiveDot(currentSection);
            updateURL(currentSection);
        }
    };

    scrollContainer.addEventListener('scroll', () => {
        if(isScrolling) return;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleManualScroll, 150);
    });

    // --- Mini Chart Initialization ---
    miniChartCanvases.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const card = canvas.closest('.sensor-card-modern');
        let borderColor = 'rgba(0, 212, 255, 0.8)'; // Default blue

        if (card.classList.contains('good')) borderColor = 'rgba(0, 255, 136, 0.8)';
        else if (card.classList.contains('warning')) borderColor = 'rgba(255, 136, 0, 0.8)';
        else if (card.classList.contains('critical')) borderColor = 'rgba(255, 68, 68, 0.8)';

        const backgroundColor = borderColor.replace('0.8', '0.1');
        const data = Array.from({ length: 10 }, () => Math.random() * 80 + 20);

        if (card.classList.contains('critical')) {
            for (let i = 1; i < data.length; i++) data[i] = Math.max(5, data[i-1] - Math.random() * 10);
        }
        if (card.classList.contains('warning')) {
            for (let i = 1; i < data.length; i++) data[i] = Math.min(100, data[i-1] + Math.random() * 5);
        }

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array(10).fill(''),
                datasets: [{ data, borderColor, backgroundColor, fill: true, tension: 0.4, pointRadius: 0, borderWidth: 3 }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: { x: { display: false }, y: { display: false, min: 0, max: 100 } }
            }
        });
    });

    // --- Section Transition Effects ---
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const cards = entry.target.querySelectorAll('.sensor-card-modern, .summary-card, .priority-card, .anomaly-heatmap-card, .ai-insight-card');
            if (entry.isIntersecting) {
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, index * 100);
                });
            } else {
                 cards.forEach((card) => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(30px)';
                });
            }
        });
    }, { root: scrollContainer, threshold: 0.5 });

    sections.forEach(section => {
        sectionObserver.observe(section);
        const cards = section.querySelectorAll('.sensor-card-modern, .summary-card, .priority-card, .anomaly-heatmap-card, .ai-insight-card');
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    });

    // --- URL Hash Navigation ---
    const handleHashChange = () => {
        const hash = window.location.hash.substring(1);
        const sectionNames = ['overview', 'engine-systems', 'wheels-power', 'anomaly-detection', 'ai-insights'];
        const sectionIndex = sectionNames.indexOf(hash);

        if (sectionIndex !== -1 && sectionIndex !== currentSection) {
            scrollToSection(sectionIndex);
        }
    };
    window.addEventListener('hashchange', handleHashChange);

    // --- INITIALIZE PAGE ---
    const initialHash = window.location.hash.substring(1);
    const sectionNames = ['overview', 'engine-systems', 'wheels-power', 'anomaly-detection', 'ai-insights'];
    const initialSectionIndex = sectionNames.indexOf(initialHash);

    if (initialSectionIndex !== -1) {
        scrollToSection(initialSectionIndex);
    } else {
        updateActiveDot(0);
        updateURL(0);
    }
    
    setTimeout(() => {
        const firstSection = sections[currentSection];
        if (firstSection) {
            const cards = firstSection.querySelectorAll('.sensor-card-modern, .summary-card, .priority-card, .anomaly-heatmap-card, .ai-insight-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    }, 100);
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}