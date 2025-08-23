/*ai-companion.js*/

document.addEventListener('DOMContentLoaded', function() {
    // Main entry point after the HTML document is loaded.
    
    // Step 1: Load the header component and its script.
    loadHeaderAndScripts(); 

    // Step 2: Initialize the page-specific features.
    initializeVoiceInterface();
    initializeChatInput();
    initializeClearChat();
    initializeSuggestedPrompts();

    // Smooth transition effect to prevent flash of unstyled content.
    document.body.style.transition = 'background 0.3s ease, color 0.3s ease';
});

/**
 * Fetches the header HTML, injects it into the placeholder,
 * and then loads the necessary JavaScript for the header to function correctly.
 */
function loadHeaderAndScripts() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (!headerPlaceholder) {
        console.error('Header placeholder not found!');
        return;
    }

    fetch('/header/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok for header.html.');
            }
            return response.text();
        })
        .then(html => {
            headerPlaceholder.innerHTML = html;
            const headerScript = document.createElement('script');
            headerScript.src = '/header/header.js'; 
            document.body.appendChild(headerScript);
        })
        .catch(error => {
            console.error('Error loading header:', error);
            headerPlaceholder.innerHTML = '<p style="color: red; text-align: center;">Error: Could not load navigation bar.</p>';
        });
}


/**
 * Initializes the voice control button and its associated animations.
 */
function initializeVoiceInterface() {
    const voiceButton = document.getElementById('voice-btn');
    const voiceWaves = document.querySelectorAll('.voice-wave');
    const voiceStatus = document.getElementById('voice-status');

    if (!voiceButton || voiceWaves.length === 0 || !voiceStatus) {
        console.error("Voice interface elements not found.");
        return;
    }

    voiceButton.addEventListener('click', () => {
        const isActive = voiceButton.classList.toggle('active');

        if (isActive) {
            voiceStatus.textContent = 'Listening...';
            voiceWaves.forEach(wave => {
                wave.style.animationPlayState = 'running';
            });

            setTimeout(() => {
                addMessage("I'm processing your voice command.", 'user');
                showTypingIndicator();
                setTimeout(() => {
                    addMessage("Voice command processed. Navigating to the nearest charging station.", 'ai');
                    voiceButton.classList.remove('active');
                    voiceStatus.textContent = 'Click to speak';
                    voiceWaves.forEach(wave => {
                        wave.style.animationPlayState = 'paused';
                    });
                }, 1500);
            }, 3000);
        } else {
            voiceStatus.textContent = 'Click to speak';
            voiceWaves.forEach(wave => {
                wave.style.animationPlayState = 'paused';
            });
        }
    });
}

/**
 * Initializes the chat input form for sending text messages.
 */
function initializeChatInput() {
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    
    if (!chatForm || !messageInput) {
        console.error("Chat form elements not found.");
        return;
    }

    chatForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        handleUserMessage(messageInput.value);
        messageInput.value = '';
    });
}

/**
 * Handles the logic for sending a user message and getting an AI response.
 * @param {string} text - The user's message text.
 */
function handleUserMessage(text) {
    const userText = text.trim();
    if (userText) {
        addMessage(userText, 'user');
        showTypingIndicator();
        setTimeout(() => {
            const aiResponse = getAIResponse(userText);
            addMessage(aiResponse, 'ai');
        }, 1200); // Simulate thinking delay
    }
}

/**
 * Initializes the clear chat button.
 */
function initializeClearChat() {
    const clearButton = document.getElementById('clear-chat-btn');
    const chatMessagesContainer = document.getElementById('chat-messages');

    if (!clearButton || !chatMessagesContainer) {
        console.error("Clear chat button or message container not found.");
        return;
    }

    clearButton.addEventListener('click', () => {
        chatMessagesContainer.innerHTML = '';
        addMessage("Hello! I'm JARVIS, your AI automotive companion. How can I assist you today?", 'ai');
    });
}

/**
 * Initializes the suggested prompt buttons.
 */
function initializeSuggestedPrompts() {
    const promptsContainer = document.getElementById('suggested-prompts');
    if (!promptsContainer) return;

    promptsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('prompt-btn')) {
            const promptText = e.target.textContent;
            handleUserMessage(promptText);
        }
    });
}

/**
 * Shows a typing indicator in the chat window.
 */
function showTypingIndicator() {
    const chatMessagesContainer = document.getElementById('chat-messages');
    if (!chatMessagesContainer) return;

    // Remove existing indicator if any
    const existingIndicator = chatMessagesContainer.querySelector('.typing-indicator-message');
    if (existingIndicator) {
        existingIndicator.remove();
    }

    const indicatorWrapper = document.createElement('div');
    indicatorWrapper.className = 'message ai-message typing-indicator-message';
    indicatorWrapper.innerHTML = `
        <i class="fas fa-robot"></i>
        <div>
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessagesContainer.appendChild(indicatorWrapper);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}


/**
 * A utility function to add a new message to the chat interface.
 * @param {string} text - The content of the message.
 * @param {string} type - The type of message ('user' or 'ai').
 */
function addMessage(text, type) {
    const chatMessagesContainer = document.getElementById('chat-messages');
    if (!chatMessagesContainer) return;

    // Remove typing indicator before adding new message
    const typingIndicator = chatMessagesContainer.querySelector('.typing-indicator-message');
    if (typingIndicator) {
        typingIndicator.remove();
    }

    const messageWrapper = document.createElement('div');
    const iconClass = type === 'user' ? 'fa-user' : 'fa-robot';
    const messageClass = type === 'user' ? 'user-message' : 'ai-message';

    messageWrapper.className = `message ${messageClass}`;
    
    const messageContent = document.createElement('div');
    messageContent.textContent = text;

    messageWrapper.innerHTML = `<i class="fas ${iconClass}"></i>`;
    messageWrapper.appendChild(messageContent);

    chatMessagesContainer.appendChild(messageWrapper);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

/**
 * Simulates an AI response based on user input.
 * @param {string} userInput - The text sent by the user.
 * @returns {string} - The AI's reply.
 */
function getAIResponse(userInput) {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes('engine')) {
        return 'Engine status: All systems are nominal. Coolant Temperature is at 92°C, and Oil Pressure is stable at 45 PSI.';
    }
    if (lowerInput.includes('nav') || lowerInput.includes('destination') || lowerInput.includes('route')) {
        return 'Navigation system is ready. Please state your destination, or I can suggest nearby points of interest.';
    }
    if (lowerInput.includes('tire') || lowerInput.includes('pressure')) {
        return 'Tire pressure is optimal on all four wheels, reading at 32 PSI.';
    }
    if (lowerInput.includes('music') || lowerInput.includes('song')) {
        return 'Accessing media player. What would you like to listen to?';
    }
    if (lowerInput.includes('climate') || lowerInput.includes('temp')) {
        return 'Climate control is currently set to 22°C in auto mode. Air quality is optimal. Would you like to make an adjustment?';
    }
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
        return 'Hello there! How can I assist you with the vehicle today?';
    }
    
    return "I've received your message. I am processing the information now.";
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}