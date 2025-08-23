document.addEventListener('DOMContentLoaded', () => {
    // First load shared components
    loadSharedComponents().then(() => {
        // Then initialize our page functionality
        initializePage();
    }).catch(error => {
        console.error('Initialization error:', error);
    });
});

async function loadSharedComponents() {
    try {
        // Load Header
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch('/header/header.html');
            if (!headerResponse.ok) throw new Error('Header load failed');
            headerPlaceholder.innerHTML = await headerResponse.text();
            
            // Load header script
            const headerScript = document.createElement('script');
            headerScript.src = '/header/header.js';
            document.body.appendChild(headerScript);
        }

        // Load Chatbot
        const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
        if (chatbotPlaceholder) {
            const chatbotResponse = await fetch('/chatbot/chatbot.html');
            if (!chatbotResponse.ok) throw new Error('Chatbot load failed');
            chatbotPlaceholder.innerHTML = await chatbotResponse.text();
            
            // Load chatbot script
            const chatbotScript = document.createElement('script');
            chatbotScript.src = '/chatbot/chatbot.js';
            document.body.appendChild(chatbotScript);
        }
    } catch (error) {
        console.error('Component loading error:', error);
        throw error;
    }
}

function initializePage() {
    startDriverMonitoringSimulation();
    setupCameraToggle();
    
    // Verify theme is working
    document.addEventListener('themeChanged', (e) => {
        console.log('Theme changed to:', e.detail.theme);
    });
}

let monitoringInterval;
let isCameraOn = true;

function setupCameraToggle() {
    const toggleBtn = document.getElementById('camera-toggle');
    const cameraPreview = document.querySelector('.camera-preview');
    const cameraStatus = document.querySelector('.camera-status');
    
    if (!toggleBtn || !cameraPreview || !cameraStatus) return;

    toggleBtn.addEventListener('click', () => {
        isCameraOn = !isCameraOn;
        
        if (isCameraOn) {
            // Camera ON
            cameraPreview.classList.remove('off');
            cameraStatus.textContent = 'LIVE';
            cameraStatus.style.backgroundColor = 'var(--accent-red)';
            toggleBtn.innerHTML = '<i class="fas fa-power-off"></i> Turn Off';
            toggleBtn.style.backgroundColor = 'var(--accent-red)';
            
            // Update stats
            updateSimulatedData();
            
            addAlert('good', 'Camera Activated', 'Camera is now active', 'Just now');
        } else {
            // Camera OFF
            cameraPreview.classList.add('off');
            cameraStatus.textContent = 'OFF';
            cameraStatus.style.backgroundColor = '#666';
            toggleBtn.innerHTML = '<i class="fas fa-power-off"></i> Turn On';
            toggleBtn.style.backgroundColor = 'var(--accent-green)';
            
            // Clear stats
            updateStat(document.getElementById('attention-level-value'), '-', 100, 75, 50, true);
            updateStat(document.getElementById('eye-closure-value'), '-', 100, 70, 40, true);
            updateStat(document.getElementById('head-position-value'), '-', 100, 70, 40, true);
            
            addAlert('warning', 'Camera Deactivated', 'Camera is turned off', 'Just now');
        }
    });
}

function startDriverMonitoringSimulation() {
    addAlert('good', 'System Initialized', 'Driver monitoring is now active.', 'Just now');

    // Stop any previous interval to prevent duplicates
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }

    monitoringInterval = setInterval(updateSimulatedData, 3500);
}

function updateSimulatedData() {
    if (!isCameraOn) return;

    const elements = {
        attentionValue: document.getElementById('attention-level-value'),
        eyeValue: document.getElementById('eye-closure-value'),
        headValue: document.getElementById('head-position-value')
    };
        
    // Simulate data fluctuations
    let attentionLevel = 85 + Math.floor(Math.random() * 15);
    let eyeStatus = 'Normal';
    let headStatus = 'Centered';
    let newAlert = null;

    const randomFactor = Math.random();

    if (randomFactor < 0.15 && randomFactor >= 0.05) {
        attentionLevel = 60 + Math.floor(Math.random() * 15);
        eyeStatus = 'Brief Closure';
        newAlert = { type: 'warning', strong: 'Slight Drowsiness', p: 'Brief eye closure detected.' };
    } else if (randomFactor < 0.05 && randomFactor >= 0.02) {
        attentionLevel = 70 + Math.floor(Math.random() * 10);
        headStatus = 'Off-center';
        newAlert = { type: 'warning', strong: 'Distraction Detected', p: 'Head position off-center.' };
    } else if (randomFactor < 0.02) {
        attentionLevel = 35 + Math.floor(Math.random() * 15);
        eyeStatus = 'Prolonged Closure';
        headStatus = 'Slumped';
        newAlert = { type: 'critical', strong: 'Severe Drowsiness', p: 'Take a break immediately!' };
    }
    
    // Update UI Elements
    updateStat(elements.attentionValue, `${attentionLevel}%`, attentionLevel, 75, 50);
    updateStat(elements.eyeValue, eyeStatus, eyeStatus === 'Normal' ? 100 : (eyeStatus === 'Brief Closure' ? 60 : 30), 70, 40);
    updateStat(elements.headValue, headStatus, headStatus === 'Centered' ? 100 : (headStatus === 'Off-center' ? 60 : 30), 70, 40);

    if (newAlert) {
        addAlert(newAlert.type, newAlert.strong, newAlert.p, 'Just now');
    }
}


function updateStat(element, text, value, warn, crit, isOff = false) {
    if (!element) return;
    element.textContent = text;
    element.className = 'stat-value'; // Reset classes

    if (isOff) {
        element.classList.add('status-off');
        return;
    }

    if (value <= crit) {
        element.classList.add('status-critical');
    } else if (value <= warn) {
        element.classList.add('status-warning');
    } else {
        element.classList.add('status-good');
    }
}

function addAlert(type, strongText, pText, smallText) {
    const alertList = document.getElementById('alert-list');
    if (!alertList) return;

    const alertItem = document.createElement('div');
    alertItem.className = `alert-item ${type}`;
    
    let iconClass = 'fas fa-check-circle';
    if (type === 'warning') iconClass = 'fas fa-exclamation-triangle';
    if (type === 'critical') iconClass = 'fas fa-skull-crossbones';

    alertItem.innerHTML = `
        <i class="${iconClass}"></i>
        <div>
            <strong>${strongText}</strong>
            <p>${pText}</p>
            <small>${smallText}</small>
        </div>
    `;
    
    alertList.prepend(alertItem);

    while (alertList.children.length > 8) {
        alertList.removeChild(alertList.lastChild);
    }
}

window.addEventListener('beforeunload', () => {
    if (monitoringInterval) {
        clearInterval(monitoringInterval);
    }
});

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}