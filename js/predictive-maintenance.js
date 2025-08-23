// predictive-maintenance.js

document.addEventListener('DOMContentLoaded', async () => {
    // Load shared components and wait for them to be ready
    await loadSharedComponents();

    // Initialize header functionality after it's loaded
    initializeThemeLogic();
    initializeActiveNav();
    initializeMobileMenu();

    // Initialize page-specific logic
    new PredictiveMaintenance();
});

/**
 * Loads shared HTML components like the header and chatbot.
 */
async function loadSharedComponents() {
    try {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const response = await fetch('/header/header.html');
            headerPlaceholder.innerHTML = await response.text();
        }
        
        const chatbotPlaceholder = document.getElementById('chatbot-placeholder');
        if(chatbotPlaceholder){
            const response = await fetch('/chatbot/chatbot.html');
            chatbotPlaceholder.innerHTML = await response.text();
            // Load chatbot script after its HTML is in place
            const script = document.createElement('script');
            script.src = '/chatbot/chatbot.js';
            document.body.appendChild(script);
        }

    } catch (error) {
        console.error('Error loading shared components:', error);
    }
}

/**
 * Sets up the theme toggling functionality.
 */
function initializeThemeLogic() {
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    if (!themeToggleButton) return;

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

    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    themeToggleButton.addEventListener('click', () => {
        const isLight = document.body.classList.contains('light-theme');
        const newTheme = isLight ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
}

/**
 * Sets the 'active' class on the correct navigation link.
 */
function initializeActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
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
            toggleIcon.className = mobileMenu.classList.contains('open') ? 'fas fa-times' : 'fas fa-bars';
        });

        document.addEventListener('click', (event) => {
            if (!navbar.contains(event.target) && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
                menuToggleBtn.querySelector('i').className = 'fas fa-bars';
            }
        });
    }
}


// Advanced Predictive Maintenance JavaScript
class PredictiveMaintenance {
    constructor() {
        this.selectedComponent = null;
        this.components = {
            brakes: {
                name: 'Brake System',
                health: 45,
                days: 14,
                miles: 1200,
                rul: '2 weeks',
                impact: 'Hard braking detected → 15% faster wear',
                confidence: {total: 92, obd: 45, history: 25, behavior: 22},
                history: [85, 80, 75, 68, 60, 45],
                costs: {now: 280, later: 650},
                maintenance: ['Brake pad thickness: 2.8mm', 'Brake fluid: Good', 'Rotor condition: Fair'],
                sensors: ['Brake pad sensor', 'ABS sensor', 'Brake fluid level'],
                recommendations: ['Replace brake pads immediately', 'Check brake fluid', 'Inspect rotors']
            },
            engine: {
                name: 'Engine',
                health: 85,
                days: 45,
                miles: 3500,
                rul: '6 weeks',
                impact: 'Aggressive acceleration → Oil degradation 8% faster',
                confidence: {total: 87, obd: 55, history: 20, behavior: 12},
                history: [95, 92, 90, 88, 86, 85],
                costs: {now: 150, later: 380},
                maintenance: ['Oil life: 15%', 'Air filter: Good', 'Spark plugs: Fair'],
                sensors: ['Oil life sensor', 'Temperature sensor', 'O2 sensor'],
                recommendations: ['Schedule oil change', 'Replace air filter', 'Check spark plugs']
            },
            transmission: {
                name: 'Transmission',
                health: 92,
                days: 120,
                miles: 8500,
                rul: '4 months',
                impact: 'Smooth driving → Extended life by 12%',
                confidence: {total: 78, obd: 40, history: 25, behavior: 13},
                history: [95, 94, 93, 93, 92, 92],
                costs: {now: 300, later: 1200},
                maintenance: ['Fluid level: Good', 'Filter: Good', 'Clutch: Excellent'],
                sensors: ['Transmission temp', 'Fluid level sensor', 'Pressure sensor'],
                recommendations: ['Continue current maintenance', 'Monitor fluid levels', 'Regular service intervals']
            },
            suspension: {
                name: 'Suspension',
                health: 25,
                days: 7,
                miles: 500,
                rul: '1 week',
                impact: 'Rough road driving → Shock wear 25% faster',
                confidence: {total: 95, obd: 30, history: 35, behavior: 30},
                history: [75, 65, 50, 40, 30, 25],
                costs: {now: 450, later: 850},
                maintenance: ['Shock absorbers: Poor', 'Springs: Fair', 'Bushings: Poor'],
                sensors: ['Height sensor', 'Shock position', 'Load sensor'],
                recommendations: ['Replace shock absorbers urgently', 'Inspect springs', 'Check alignment']
            }
        };
        this.initializeEventListeners();
        this.initializeCharts();
        this.updateHealthMeters();
    }

    initializeEventListeners() {
        // Component selection
        document.querySelectorAll('.component-item').forEach(item => {
            item.addEventListener('click', () => {
                const component = item.dataset.component;
                this.selectComponent(component);
            });
        });

        // View toggles
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                this.switchView(view);
            });
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Car part hover
        document.querySelectorAll('.car-part').forEach(part => {
            part.addEventListener('click', () => {
                const component = part.dataset.part;
                this.selectComponent(component);
                this.switchView('list');
            });
        });

        // Action buttons
        document.querySelectorAll('.btn-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.classList.contains('schedule') ? 'schedule' :
                             btn.classList.contains('order') ? 'order' : 'ignore';
                this.handleAction(action);
            });
        });
    }

    selectComponent(componentKey) {
        const component = this.components[componentKey];
        if (!component) return;

        this.selectedComponent = componentKey;

        // Update selected component visual
        document.querySelectorAll('.component-item').forEach(item => {
            item.classList.remove('selected');
        });
        document.querySelector(`[data-component="${componentKey}"]`).classList.add('selected');

        // Update detail panel
        document.getElementById('selectedComponent').textContent = component.name;
        this.updateOverviewTab(component);
        this.updateHistoryChart(component);
        this.updateCostChart(component);
        this.updateServiceTab(component);
    }

    updateOverviewTab(component) {
        const overviewTab = document.getElementById('overviewTab');
        overviewTab.innerHTML = `
            <div class="component-overview">
                <div class="overview-stats">
                    <div class="stat-card">
                        <h4>Health Score</h4>
                        <div class="health-score ${component.health < 50 ? 'critical' : component.health < 75 ? 'warning' : 'good'}">
                            ${component.health}%
                        </div>
                    </div>
                    <div class="stat-card">
                        <h4>Time Remaining</h4>
                        <div class="time-remaining">${component.days} days</div>
                    </div>
                    <div class="stat-card">
                        <h4>Miles Remaining</h4>
                        <div class="miles-remaining">${component.miles.toLocaleString()} miles</div>
                    </div>
                    <div class="stat-card">
                        <h4>RUL Estimate</h4>
                        <div class="rul-estimate">${component.rul}</div>
                    </div>
                </div>

                <div class="confidence-analysis">
                    <h4>AI Confidence Breakdown</h4>
                    <div class="confidence-bars">
                        <div class="confidence-bar">
                            <span>OBD-II Sensors</span>
                            <div class="bar"><div class="fill" style="width: ${component.confidence.obd}%"></div></div>
                            <span>${component.confidence.obd}%</span>
                        </div>
                        <div class="confidence-bar">
                            <span>Historical Patterns</span>
                            <div class="bar"><div class="fill" style="width: ${component.confidence.history}%"></div></div>
                            <span>${component.confidence.history}%</span>
                        </div>
                        <div class="confidence-bar">
                            <span>Driving Behavior</span>
                            <div class="bar"><div class="fill" style="width: ${component.confidence.behavior}%"></div></div>
                            <span>${component.confidence.behavior}%</span>
                        </div>
                    </div>
                    <div class="total-confidence">
                        Total Confidence: <strong>${component.confidence.total}%</strong>
                    </div>
                </div>

                <div class="driving-impact-analysis">
                    <h4>Driving Behavior Impact</h4>
                    <p>${component.impact}</p>
                </div>

                <div class="current-readings">
                    <h4>Current Maintenance Status</h4>
                    <ul>
                        ${component.maintenance.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>

                <div class="sensor-data">
                    <h4>Active Sensors</h4>
                    <div class="sensor-list">
                        ${component.sensors.map(sensor => `<span class="sensor-chip">${sensor}</span>`).join('')}
                    </div>
                </div>

                <div class="repair-recommendations">
                    <h4>Repair Recommendations</h4>
                    <ul>
                        ${component.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    updateHistoryChart(component) {
        const ctx = document.getElementById('historyChart');
        if (this.historyChart) {
            this.historyChart.destroy();
        }
        const isLightTheme = document.body.classList.contains('light-theme');
        const textColor = isLightTheme ? '#212529' : '#ffffff';
        const gridColor = isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';


        this.historyChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['6 months ago', '5 months ago', '4 months ago', '3 months ago', '2 months ago', 'Now'],
                datasets: [{
                    label: 'Health %',
                    data: component.history,
                    borderColor: '#00d4ff',
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                }
            }
        });
    }

    updateCostChart(component) {
        const ctx = document.getElementById('costChart');
        if (this.costChart) {
            this.costChart.destroy();
        }
        
        const isLightTheme = document.body.classList.contains('light-theme');
        const textColor = isLightTheme ? '#212529' : '#ffffff';
        const gridColor = isLightTheme ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

        this.costChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Fix Now', 'Fix Later'],
                datasets: [{
                    label: 'Cost ($)',
                    data: [component.costs.now, component.costs.later],
                    backgroundColor: ['#00d4ff', '#ff6b6b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor,
                            callback: function(value) {
                                return '$' + value;
                            }
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    x: {
                        ticks: {
                            color: textColor
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                }
            }
        });
    }

    updateServiceTab(component) {
        const serviceTab = document.getElementById('serviceTab');
        serviceTab.innerHTML = `
            <div class="service-options">
                <h4>Nearby Service Centers</h4>
                <div class="service-center">
                    <div class="center-info">
                        <h5>AutoCare Plus</h5>
                        <p>2.3 miles away • 4.8★</p>
                        <p>Parts Available: ✓ | Est. Time: 2 hours</p>
                        <p>Specializes in: ${component.name}</p>
                    </div>
                    <div class="service-pricing">
                        <span class="price">$${component.costs.now}</span>
                        <button class="btn-book-now">Book Now</button>
                    </div>
                </div>
                <div class="service-center">
                    <div class="center-info">
                        <h5>QuickFix Motors</h5>
                        <p>4.1 miles away • 4.6★</p>
                        <p>Parts Available: ✓ | Est. Time: 3 hours</p>
                        <p>Specializes in: ${component.name}</p>
                    </div>
                    <div class="service-pricing">
                        <span class="price">$${component.costs.now + 50}</span>
                        <button class="btn-book-now">Book Now</button>
                    </div>
                </div>
                <div class="service-center">
                    <div class="center-info">
                        <h5>Premium Auto Service</h5>
                        <p>6.8 miles away • 4.9★</p>
                        <p>Parts Available: Next day | Est. Time: 1.5 hours</p>
                        <p>Specializes in: ${component.name}</p>
                    </div>
                    <div class="service-pricing">
                        <span class="price">$${component.costs.now - 30}</span>
                        <button class="btn-book-now">Book Now</button>
                    </div>
                </div>
            </div>
        `;
    }

    switchView(view) {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        document.getElementById('listView').classList.toggle('active', view === 'list');
        document.getElementById('carView').classList.toggle('active', view === 'car');
    }

    switchTab(tab) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tab}Tab`).classList.add('active');
    }

    updateHealthMeters() {
        document.querySelectorAll('.meter-circle').forEach(meter => {
            const health = parseInt(meter.dataset.health);
            const radius = 30; // SVG circle radius
            const circumference = 2 * Math.PI * radius;
            const progressValue = (health / 100) * circumference;
            
            const progressCircle = meter.querySelector('.gauge-progress');
            if (progressCircle) {
                progressCircle.style.strokeDasharray = `${progressValue}, ${circumference}`;
            }
        });
    }

    handleAction(action) {
        let message = '';
        switch(action) {
            case 'schedule':
                message = 'Service appointment scheduled successfully!';
                break;
            case 'order':
                message = 'Parts ordered and will arrive in 2-3 business days!';
                break;
            case 'ignore':
                message = 'Alert ignored. We\'ll remind you again in 3 days.';
                break;
        }

        // Show notification
        const notification = document.createElement('div');
        notification.className = 'action-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    initializeCharts() {
    }
}

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}