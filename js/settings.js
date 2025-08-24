/**
 * @file settings.js
 * @description Main script for the Settings page. Handles theme, language, and other user preferences.
 */

(function() {
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Default to dark theme
    document.body.setAttribute('data-theme', savedTheme);
})();

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}

/**
 * Sets the Google Translate cookie to change the language. The page must be
 * reloaded for the change to take effect.
 * @param {string} lang The language code (e.g., 'hi' for Hindi).
 */
function setGoogleTranslateCookie(lang) {
    if (lang && lang !== 'en') {
        document.cookie = `googtrans=/en/${lang}; path=/;`;
    } else {
        // Clear the cookie to revert to English
        document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}

// --- MAIN PAGE INITIALIZATION --- //
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadSharedComponents();
        initializeSettingsPage();
        console.log("Settings page successfully initialized.");
    } catch (error) {
        console.error("An error occurred during settings page initialization:", error);
    }
});

/**
 * Loads shared components like the header and chatbot.
 */
async function loadSharedComponents() {
    // This function can be expanded as needed
    const components = {
        'header-placeholder': { html: '../header/header.html', script: '../header/header.js' },
        'chatbot-placeholder': { html: '../chatbot/chatbot.html', script: '../chatbot/chatbot.js' }
    };

    for (const id in components) {
        const placeholder = document.getElementById(id);
        if (!placeholder) continue;
        const { html, script } = components[id];
        try {
            const response = await fetch(html);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            placeholder.innerHTML = await response.text();
            if (script) await loadScript(script);
        } catch (error) {
            console.error(`Failed to load component '${id}':`, error);
        }
    }
}

/**
 * Dynamically loads a script if it's not already on the page.
 * @param {string} src - The script source URL.
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            return resolve();
        }
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = () => reject(new Error(`Script load error for ${src}`));
        document.body.appendChild(script);
    });
}

/**
 * Initializes all event listeners and logic for the settings page controls.
 */
function initializeSettingsPage() {
    const themeSelect = document.getElementById('theme-select');
    const languageSelect = document.getElementById('language-select');
    const saveSettingsBtn = document.getElementById('save-settings-btn');
    const resetSettingsBtn = document.getElementById('reset-settings-btn');

    /**
     * Sets the state of all form controls on the page to match the values stored in localStorage.
     */
    function loadControlStates() {
        // Set theme dropdown
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (themeSelect) themeSelect.value = savedTheme;

        // Set language dropdown
        const savedLang = localStorage.getItem('selectedLanguage') || 'en';
        if (languageSelect) languageSelect.value = savedLang;
        
        // Set all toggle switches
        document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(checkbox => {
            const savedState = localStorage.getItem(checkbox.id);
            if (savedState !== null) checkbox.checked = (savedState === 'true');
        });

        // Set other select elements
        document.querySelectorAll('.setting-select:not(#theme-select):not(#language-select)').forEach(select => {
            const savedValue = localStorage.getItem(select.id);
            if (savedValue !== null) select.value = savedValue;
        });

        console.log("Control states loaded from localStorage.");
    }

    loadControlStates();

    // Theme select listener
    if (themeSelect) {
        themeSelect.addEventListener('change', (event) => {
            const newTheme = event.target.value;
            document.body.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            showNotification(`Theme set to ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`);
        });
    }

    // Language select listener
    if (languageSelect) {
        languageSelect.addEventListener('change', (event) => {
            const selectedLang = event.target.value;
            localStorage.setItem('selectedLanguage', selectedLang);
            setGoogleTranslateCookie(selectedLang);
            // A page reload is required for the cookie change to take effect
            showNotification(`Applying language...`);
            setTimeout(() => window.location.reload(), 500);
        });
    }

    // Save Settings button listener
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            // The theme and language are already saved on change, so we just save the rest.
            document.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(checkbox => {
                localStorage.setItem(checkbox.id, checkbox.checked);
            });
            document.querySelectorAll('.setting-select:not(#theme-select):not(#language-select)').forEach(select => {
                localStorage.setItem(select.id, select.value);
            });
            showNotification('Settings saved successfully!');
        });
    }

    // Reset Settings button listener
    if (resetSettingsBtn) {
        resetSettingsBtn.addEventListener('click', () => {
            // Clear all related settings from localStorage
            const settingKeys = [
                'theme', 'selectedLanguage', 'maintenance-alerts', 'safety-warnings',
                'performance-updates', 'voice-commands', 'auto-response',
                'data-collection', 'location-services'
            ];
            settingKeys.forEach(key => localStorage.removeItem(key));

            // Reset language by clearing the cookie
            setGoogleTranslateCookie('en');
            
            showNotification('Settings reset to defaults. Reloading...');
            setTimeout(() => window.location.reload(), 500);
        });
    }
}

/**
 * Shows a temporary notification message on the screen.
 * @param {string} message - The message to display.
 */
function showNotification(message) {
    document.querySelector('.notification')?.remove();
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '90px',
        right: '20px',
        backgroundColor: 'var(--accent-blue)',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '8px',
        zIndex: '10001',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'transform 0.5s ease, opacity 0.5s ease'
    });
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 50);

    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}