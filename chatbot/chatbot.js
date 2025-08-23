// Chatbot Functionality
function initializeChatbot() {
    try {
        const chatbotFloat = document.querySelector('.chatbot-float');
        const chatbotToggle = document.getElementById('chatbot-toggle');
        const chatbotWidget = document.getElementById('chatbot-widget');
        const chatbotClose = document.getElementById('chatbot-close');
        const chatbotInput = document.getElementById('chatbot-input');
        const chatbotSend = document.getElementById('chatbot-send');
        const chatbotMessages = document.getElementById('chatbot-messages');

        if (!chatbotToggle || !chatbotWidget) {
            console.log('JARVIS: Chatbot elements not found');
            return;
        }

        const responses = {
            'hello': 'Hello! I\'m JARVIS, your automotive AI assistant. How can I help you today?',
            'hi': 'Hi there! What can I help you with regarding your vehicle?',
            'engine': 'Your engine is running smoothly. Current temperature: 92°C, Oil pressure: 45 PSI. All systems normal.',
            'diagnostics': 'Running full vehicle diagnostics... All systems are operational. Battery: 92%, Brakes: 45% (service recommended), Engine: 85%.',
            'maintenance': 'Based on your driving patterns, I recommend scheduling maintenance in 2 weeks. Your brake pads need attention soon.',
            'navigation': 'Navigation system is ready. Where would you like to go? I can provide real-time traffic updates.',
            'music': 'Music system activated. What would you like to listen to? I can play from your connected devices.',
            'climate': 'Climate control is set to 22°C in auto mode. Air quality is good. Would you like to adjust settings?',
            'help': 'I can assist with: Vehicle diagnostics, Navigation, Music control, Climate settings, Maintenance scheduling, and Safety monitoring. What would you like to know?',
            'status': 'Vehicle status: All systems operational. Current location secured. Battery at 92%. Next service due in 18 days.',
            'default': 'I understand you\'re asking about your vehicle. Could you be more specific? I can help with diagnostics, navigation, maintenance, or general vehicle status.'
        };

        let isDragging = false;
        let startX, startY;
        let initialX, initialY;

        function updateWidgetPosition() {
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const iconRect = chatbotFloat.getBoundingClientRect();

            // Calculate the horizontal and vertical center of the icon
            const iconCenterX = iconRect.left + iconRect.width / 2;
            const iconCenterY = iconRect.top + iconRect.height / 2;

            const isTopHalf = iconCenterY < viewportHeight / 2;
            const isLeftHalf = iconCenterX < viewportWidth / 2;

            chatbotWidget.classList.remove('top-right', 'top-left', 'bottom-right', 'bottom-left');

            if (isTopHalf && !isLeftHalf) {
                // Quadrant 1 (Top-Right)
                chatbotWidget.classList.add('top-right');
            } else if (isTopHalf && isLeftHalf) {
                // Quadrant 2 (Top-Left)
                chatbotWidget.classList.add('top-left');
            } else if (!isTopHalf && isLeftHalf) {
                // Quadrant 3 (Bottom-Left)
                chatbotWidget.classList.add('bottom-left');
            } else if (!isTopHalf && !isLeftHalf) {
                // Quadrant 4 (Bottom-Right)
                chatbotWidget.classList.add('bottom-right');
            }
        }

        function toggleChatbot() {
            chatbotWidget.classList.toggle('active');
            updateWidgetPosition();
        }

        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.className = `chatbot-message ${isUser ? 'user' : 'bot'}`;
            messageDiv.innerHTML = `
                <i class="fas fa-${isUser ? 'user' : 'robot'}"></i>
                <div>${message}</div>
            `;
            chatbotMessages.appendChild(messageDiv);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }

        function getResponse(userMessage) {
            const lowerMessage = userMessage.toLowerCase();

            for (const [key, response] of Object.entries(responses)) {
                if (lowerMessage.includes(key)) {
                    return response;
                }
            }
            return responses.default;
        }

        function sendMessage() {
            const message = chatbotInput.value.trim();
            if (message) {
                addMessage(message, true);
                chatbotInput.value = '';

                // Simulate typing delay
                setTimeout(() => {
                    const response = getResponse(message);
                    addMessage(response);
                }, 1000);
            }
        }

        // Dragging functionality
        function dragStart(e) {
            if (e.target.closest('.chatbot-widget')) return;

            isDragging = true;
            chatbotToggle.style.cursor = 'grabbing';
            chatbotToggle.style.transition = 'none';

            // Get initial position relative to the viewport
            const rect = chatbotFloat.getBoundingClientRect();
            initialX = rect.left;
            initialY = rect.top;

            startX = e.clientX || e.touches[0].clientX;
            startY = e.clientY || e.touches[0].clientY;
        }

        function drag(e) {
            if (!isDragging) return;
            e.preventDefault();

            const currentX = e.clientX || e.touches[0].clientX;
            const currentY = e.clientY || e.touches[0].clientY;

            const dx = currentX - startX;
            const dy = currentY - startY;

            let newX = initialX + dx;
            let newY = initialY + dy;

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            // Get the height of the navbar dynamically
            const navBarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
            const iconWidth = chatbotFloat.offsetWidth;
            const iconHeight = chatbotFloat.offsetHeight;

            // Constrain movement within the viewport, below the navbar
            newX = Math.max(0, Math.min(newX, viewportWidth - iconWidth));
            newY = Math.max(navBarHeight, Math.min(newY, viewportHeight - iconHeight));

            chatbotFloat.style.left = `${newX}px`;
            chatbotFloat.style.top = `${newY}px`;
            chatbotFloat.style.right = 'auto';
            chatbotFloat.style.bottom = 'auto';
            updateWidgetPosition();
        }

        function dragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            chatbotToggle.style.cursor = 'grab';
            chatbotToggle.style.transition = 'all 0.3s ease';

            const iconRect = chatbotFloat.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            
            // Snap to the closest vertical edge
            if (iconRect.left < viewportWidth / 2) {
                chatbotFloat.style.left = '30px';
                chatbotFloat.style.right = 'auto';
            } else {
                chatbotFloat.style.right = '30px';
                chatbotFloat.style.left = 'auto';
            }

            // Snap to the closest horizontal edge with a minimum offset of 70px from the top
            const navBarHeight = document.querySelector('.navbar') ? document.querySelector('.navbar').offsetHeight : 0;
            const topBoundary = Math.max(navBarHeight, 70); 

            if (iconRect.top < viewportHeight / 2) {
                chatbotFloat.style.top = `${topBoundary}px`;
                chatbotFloat.style.bottom = 'auto';
            } else {
                chatbotFloat.style.bottom = '30px';
                chatbotFloat.style.top = 'auto';
            }
            updateWidgetPosition();
        }

        // Event listeners
        if (chatbotToggle) chatbotToggle.addEventListener('click', toggleChatbot);
        if (chatbotClose) chatbotClose.addEventListener('click', toggleChatbot);
        if (chatbotSend) chatbotSend.addEventListener('click', sendMessage);

        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        // Dragging Listeners
        if (chatbotToggle) {
            chatbotToggle.addEventListener('mousedown', dragStart);
            chatbotToggle.addEventListener('touchstart', dragStart);
        }
        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);

        // Set initial position and update widget placement
        chatbotFloat.style.bottom = '30px';
        chatbotFloat.style.right = '30px';
        updateWidgetPosition();

    } catch (error) {
        console.error('JARVIS: Chatbot initialization failed.', error);
    }
}

// Initialize chatbot immediately upon script execution.
initializeChatbot();