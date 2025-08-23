// Theme Management
async function initializeIncludes() {
    // Load header.html
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        try {
            const response = await fetch('/header/header.html');
            if (response.ok) {
                headerPlaceholder.innerHTML = await response.text();
                // Dynamically load header.js after header.html is loaded
                const headerScript = document.createElement('script');
                headerScript.src = '/header/header.js';
                headerScript.type = 'text/javascript';
                document.body.appendChild(headerScript);
            } else {
                console.error('Failed to load header.html:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching header.html:', error);
        }
    }

    // Load chatbot.html
    const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
    if (chatbotPlaceholder) {
        try {
            const response = await fetch('/chatbot/chatbot.html');
            if (response.ok) {
                chatbotPlaceholder.innerHTML = await response.text();
                // Dynamically load chatbot.js after chatbot.html is loaded
                const chatbotScript = document.createElement('script');
                chatbotScript.src = '/chatbot/chatbot.js';
                chatbotScript.type = 'text/javascript';
                document.body.appendChild(chatbotScript);
            } else {
                console.error('Failed to load chatbot.html:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching chatbot.html:', error);
        }
    }
}

// Ensure includes are loaded when the DOM is ready
document.addEventListener('DOMContentLoaded', initializeIncludes);

// Error handling for missing elements (general, for robustness)
window.addEventListener('error', (e) => {
    console.warn('JARVIS Car AI: Minor rendering issue detected and handled gracefully.');
});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}