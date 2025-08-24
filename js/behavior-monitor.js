/**
 * @file behavior-monitor.js
 * @description Main script for the Behavior Monitor page.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded. Initializing components...");

    /**
     * Fetches HTML content and injects it into a placeholder.
     * @param {string} componentUrl - The URL of the HTML component.
     * @param {string} placeholderId - The ID of the placeholder element.
     */
    const loadComponent = async (componentUrl, placeholderId) => {
        const placeholder = document.getElementById(placeholderId);
        if (!placeholder) {
            console.error(`Error: Placeholder element with ID '${placeholderId}' not found.`);
            return;
        }
        try {
            const response = await fetch(componentUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${componentUrl}: ${response.status}`);
            }
            placeholder.innerHTML = await response.text();
            console.log(`${componentUrl} loaded successfully into #${placeholderId}.`);
        } catch (error) {
            console.error(`Error loading component from ${componentUrl}:`, error);
            placeholder.innerHTML = `<p style="color:red;">Failed to load component.</p>`;
        }
    };

    /**
     * Dynamically appends a script tag to the document body.
     * @param {string} scriptUrl - The URL of the script to load.
     */
    const loadScript = (scriptUrl) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptUrl;
            script.onload = () => {
                console.log(`${scriptUrl} script loaded successfully.`);
                resolve();
            };
            script.onerror = () => {
                console.error(`Error loading script: ${scriptUrl}`);
                reject(new Error(`Failed to load script: ${scriptUrl}`));
            };
            document.body.appendChild(script);
        });
    };

    /**
     * Initializes the vertical pagination and scroll snapping functionality.
     */
    const initializeVerticalPagination = () => {
        const container = document.querySelector('.page-container');
        const sections = document.querySelectorAll('.page-section');
        const paginationDots = document.querySelectorAll('.pagination-dot');

        if (!container || sections.length === 0 || paginationDots.length === 0) {
            console.error("Vertical pagination elements not found. Aborting initialization.");
            return;
        }

        // 1. Add click event to each dot to scroll to the corresponding section
        paginationDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const sectionId = dot.dataset.sectionId;
                const section = document.getElementById(sectionId);
                if (section) {
                    e.preventDefault();
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // 2. Use IntersectionObserver to highlight the active dot on scroll
        const observerOptions = {
            root: container,
            rootMargin: '0px',
            threshold: 0.7
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const visibleSectionId = entry.target.id;
                    
                    paginationDots.forEach(dot => {
                        dot.classList.toggle('active', dot.dataset.sectionId === visibleSectionId);
                    });
                }
            });
        }, observerOptions);

        // Observe each page section
        sections.forEach(section => {
            observer.observe(section);
        });
        
        // Set the first dot as active initially
        if (paginationDots.length > 0) {
            paginationDots[0].classList.add('active');
        }

        console.log("Vertical pagination initialized successfully.");
    };

    /**
     * Main initialization sequence.
     */
    const initializePage = async () => {
        await loadComponent('../header/header.html', 'header-placeholder');
        await loadScript('../header/header.js');
        await loadComponent('../chatbot/chatbot.html', 'chatbot-placeholder');
        await loadScript('../chatbot/chatbot.js');

        // Initialize page-specific functionality
        initializeVerticalPagination();
    };

    // Start the initialization process
    initializePage();
});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}