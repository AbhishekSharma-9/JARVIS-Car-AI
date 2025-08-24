/*
 * vehicle-health.js
 */

document.addEventListener('DOMContentLoaded', () => {

    /**
     * Fetches and injects an HTML component into a placeholder element.
     * Optionally loads a script associated with the component.
     * @param {string} componentUrl - The URL of the HTML file to load.
     * @param {string} placeholderId - The ID of the element to inject the HTML into.
     * @param {string} [scriptUrl] - Optional: The URL of the JS file to load after the HTML.
     */
    const loadComponent = async (componentUrl, placeholderId, scriptUrl) => {
        try {
            const response = await fetch(componentUrl);
            if (!response.ok) throw new Error(`Failed to load ${componentUrl}`);
            const html = await response.text();
            const placeholder = document.getElementById(placeholderId);

            if (placeholder) {
                placeholder.innerHTML = html;
                if (scriptUrl) {
                    const existingScript = document.querySelector(`script[src="${scriptUrl}"]`);
                    if(existingScript) existingScript.remove();

                    const script = document.createElement('script');
                    script.src = scriptUrl;
                    script.defer = true;
                    document.body.appendChild(script);
                }
            }
        } catch (error) {
            console.error(`Error loading component: ${error}`);
        }
    };

    /**
     * Main initialization function.
     */
    const initializePage = async () => {
        // Load shared components. The associated JS will handle their own functionality.
        await loadComponent('/header/header.html', 'header-placeholder', '/header/header.js');
        await loadComponent('/chatbot/chatbot.html', 'chatbot-placeholder', '/chatbot/chatbot.js');

        // Initialize the vehicle health dashboard features after components are ready.
        initializeDashboardLogic();
    };

    // --- Original Vehicle Health Dashboard JavaScript ---
    function initializeDashboardLogic() {
        let charts = {};
        let updateInterval;

        initializeCharts();
        startRealTimeUpdates();
        setupEventListeners();
        animateMetricCards();

        function initializeCharts() {
            // Engine Temperature Mini Chart
            const engineCtx = document.getElementById('engineChart').getContext('2d');
            charts.engine = new Chart(engineCtx, {
                type: 'line',
                data: {
                    labels: ['', '', '', '', '', '', ''],
                    datasets: [{
                        data: [85, 87, 86, 89, 87, 88, 87],
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    }
                }
            });

            // Performance Analytics Chart
            const performanceCtx = document.getElementById('performanceChart').getContext('2d');
            charts.performance = new Chart(performanceCtx, {
                type: 'line',
                data: {
                    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
                    datasets: [{
                        label: 'Engine Temp (°C)',
                        data: [85, 87, 92, 95, 88, 86, 84],
                        borderColor: '#ff8800',
                        backgroundColor: 'rgba(255, 136, 0, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Oil Quality (%)',
                        data: [84, 84, 83, 82, 83, 84, 84],
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Battery Voltage (V)',
                        data: [12.6, 12.7, 12.5, 12.4, 12.6, 12.7, 12.6],
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: { color: '#ffffff' }
                        }
                    },
                    scales: {
                        x: {
                            ticks: { color: '#a0a8b8' },
                            grid: { color: 'rgba(160, 168, 184, 0.1)' }
                        },
                        y: {
                            ticks: { color: '#a0a8b8' },
                            grid: { color: 'rgba(160, 168, 184, 0.1)' }
                        }
                    }
                }
            });
        }

        function startRealTimeUpdates() {
            updateInterval = setInterval(() => {
                updateMetrics();
            }, 3000);
        }

        function updateMetrics() {
            // Engine Temperature
            const engineTemp = 80 + Math.random() * 20;
            document.getElementById('engine-temp').textContent = Math.round(engineTemp);
            updateStatus('engine', engineTemp, 95, 105);

            // Oil Quality
            const oilQuality = 80 + Math.random() * 10;
            const oilElement = document.getElementById('oil-quality');
            const oilProgress = document.getElementById('oil-progress');
            oilElement.textContent = Math.round(oilQuality);
            oilProgress.style.width = oilQuality + '%';
            document.getElementById('oil-level').textContent = `${(90 + Math.random() * 10).toFixed(0)}%`;
            document.getElementById('oil-viscosity').textContent = Math.random() > 0.2 ? 'Good' : 'Fair';

            // Battery
            const batteryVoltage = 12.0 + Math.random() * 1.0;
            document.getElementById('battery-voltage').textContent = batteryVoltage.toFixed(1);
            const batteryCharge = 75 + Math.random() * 20;
            document.getElementById('battery-charge').textContent = `${Math.round(batteryCharge)}%`;
            document.getElementById('battery-level').style.width = `${batteryCharge}%`;
            document.getElementById('battery-health').textContent = batteryCharge > 80 ? 'Good' : 'Fair';

            // Tire Pressures
            ['fl', 'fr', 'rl', 'rr'].forEach(tire => {
                const pressure = 30 + Math.random() * 5;
                document.getElementById(`tire-${tire}`).textContent = Math.round(pressure);
            });
            const flPressure = parseInt(document.getElementById('tire-fl').textContent);
            updateStatus('tire', flPressure, 30, 28); // If FL is below 30, warning; below 28, critical

            // Coolant
            const coolantTemp = 85 + Math.random() * 10;
            document.getElementById('coolant-temp').textContent = Math.round(coolantTemp);
            document.getElementById('coolant-level').style.height = `${(70 + Math.random() * 20).toFixed(0)}%`;
            document.querySelector('.coolant-tank .level-indicator').textContent = document.getElementById('coolant-level').style.height;
            updateStatus('coolant', coolantTemp, 100, 110);

            updateChartData();
        }

        function updateStatus(metric, value, warningThreshold, criticalThreshold) {
            const statusElement = document.getElementById(`${metric}-status`);
            const card = document.querySelector(`[data-metric="${metric}"]`);

            if (statusElement && card) {
                if (value <= criticalThreshold) {
                    statusElement.className = 'status-badge critical';
                    statusElement.innerHTML = '<span class="status-dot"></span>CRITICAL';
                    card.classList.add('alert');
                } else if (value <= warningThreshold) {
                    statusElement.className = 'status-badge warning';
                    statusElement.innerHTML = '<span class="status-dot"></span>WARNING';
                    card.classList.remove('alert');
                } else {
                    statusElement.className = 'status-badge normal';
                    statusElement.innerHTML = '<span class="status-dot"></span>NORMAL';
                    card.classList.remove('alert');
                }
            }
        }

        function updateChartData() {
            if (charts.engine) {
                const newData = charts.engine.data.datasets[0].data;
                newData.shift();
                newData.push(parseInt(document.getElementById('engine-temp').textContent));
                charts.engine.update('none');
            }

            if (charts.performance) {
                const engineTempData = charts.performance.data.datasets[0].data;
                engineTempData.shift();
                engineTempData.push(parseInt(document.getElementById('engine-temp').textContent));

                const oilQualityData = charts.performance.data.datasets[1].data;
                oilQualityData.shift();
                oilQualityData.push(parseInt(document.getElementById('oil-quality').textContent));

                const batteryVoltageData = charts.performance.data.datasets[2].data;
                batteryVoltageData.shift();
                batteryVoltageData.push(parseFloat(document.getElementById('battery-voltage').textContent));

                charts.performance.update('none');
            }
        }

        function setupEventListeners() {
            document.querySelectorAll('.metric-card').forEach(card => {
                card.addEventListener('click', () => {
                    const metric = card.dataset.metric;
                    openMetricModal(metric);
                });
            });

            document.getElementById('closeModal').addEventListener('click', closeModal);
            document.getElementById('metricModal').addEventListener('click', (e) => {
                if (e.target.id === 'metricModal') closeModal();
            });

            document.querySelectorAll('.chart-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                });
            });

            document.querySelector('.book-service-btn').addEventListener('click', () => {
                showNotification('Booking service...');
            });
        }

        function animateMetricCards() {
            const cards = document.querySelectorAll('.metric-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        }

        function openMetricModal(metric) {
            const modal = document.getElementById('metricModal');
            const title = document.getElementById('modalTitle');
            const body = document.getElementById('modalBody');

            const metricData = {
                engine: {
                    title: 'Engine Temperature Details',
                    content: `
                        <div class="modal-metric">
                            <h4>Current Status</h4>
                            <p>Temperature: ${document.getElementById('engine-temp').textContent}°C</p>
                            <p>Status: ${document.getElementById('engine-status').textContent.trim().toLowerCase()}</p>
                            <h4>Recommendations</h4>
                            <ul>
                                <li>Ensure coolant levels are optimal.</li>
                                <li>Check radiator and fan for obstructions.</li>
                                <li>Monitor temperature during heavy loads or hot weather.</li>
                            </ul>
                            <h4>Historical Data</h4>
                            <div style="height: 150px;"><canvas id="modalEngineChart"></canvas></div>
                        </div>
                    `,
                    chartData: charts.engine.data.datasets[0].data
                },
                oil: {
                    title: 'Oil System Details',
                    content: `
                        <div class="modal-metric">
                            <h4>Current Status</h4>
                            <p>Quality: ${document.getElementById('oil-quality').textContent}%</p>
                            <p>Level: ${document.getElementById('oil-level').textContent}</p>
                            <p>Viscosity: ${document.getElementById('oil-viscosity').textContent}</p>
                            <h4>Next Service</h4>
                            <p>Oil change due in 2,450 miles or 1 month.</p>
                            <h4>Recommendations</h4>
                            <ul>
                                <li>Adhere to manufacturer's recommended oil change intervals.</li>
                                <li>Check oil level regularly, especially before long trips.</li>
                            </ul>
                        </div>
                    `
                },
                brakes: {
                    title: 'Brake System Details',
                    content: `
                        <div class="modal-metric">
                            <h4>Pad Thickness</h4>
                            <p>Front Left: 45% remaining</p>
                            <p>Front Right: 45% remaining</p>
                            <p>Rear Left: 68% remaining</p>
                            <p>Rear Right: 68% remaining</p>
                            <h4>Recommendation</h4>
                            <p class="warning">⚠️ Front brake pads need replacement soon. Consider a full brake system inspection.</p>
                            <h4>Safety Impact</h4>
                            <ul>
                                <li>Increased stopping distance.</li>
                                <li>Potential for rotor damage if ignored.</li>
                            </ul>
                        </div>
                    `
                },
                battery: {
                    title: 'Battery Health Details',
                    content: `
                        <div class="modal-metric">
                            <h4>Current Status</h4>
                            <p>Voltage: ${document.getElementById('battery-voltage').textContent}V</p>
                            <p>Charge: ${document.getElementById('battery-charge').textContent}</p>
                            <p>Health: ${document.getElementById('battery-health').textContent}</p>
                            <h4>Recommendations</h4>
                            <ul>
                                <li>Perform a battery load test annually.</li>
                                <li>Ensure terminals are clean and corrosion-free.</li>
                                <li>Avoid leaving accessories on when the engine is off.</li>
                            </ul>
                        </div>
                    `
                },
                tires: {
                    title: 'Tire Pressure Details (TPMS)',
                    content: `
                        <div class="modal-metric">
                            <h4>Current Pressures (PSI)</h4>
                            <p>Front Left: ${document.getElementById('tire-fl').textContent}</p>
                            <p>Front Right: ${document.getElementById('tire-fr').textContent}</p>
                            <p>Rear Left: ${document.getElementById('tire-rl').textContent}</p>
                            <p>Rear Right: ${document.getElementById('tire-rr').textContent}</p>
                            <h4>Recommendations</h4>
                            <ul>
                                <li>Maintain recommended tire pressure for optimal fuel efficiency and tire longevity.</li>
                                <li>Check pressure monthly and before long trips.</li>
                                <li>Rotate tires every 5,000-7,000 miles.</li>
                            </ul>
                        </div>
                    `
                },
                coolant: {
                    title: 'Coolant System Details',
                    content: `
                        <div class="modal-metric">
                            <h4>Current Status</h4>
                            <p>Temperature: ${document.getElementById('coolant-temp').textContent}°C</p>
                            <p>Level: ${document.getElementById('coolant-level').style.height}</p>
                            <h4>Recommendations</h4>
                            <ul>
                                <li>Ensure coolant levels are within the recommended range.</li>
                                <li>Flush and replace coolant as per manufacturer's schedule.</li>
                                <li>Monitor for any leaks or unusual temperature fluctuations.</li>
                            </ul>
                        </div>
                    `
                }
            };

            if (metricData[metric]) {
                title.textContent = metricData[metric].title;
                body.innerHTML = metricData[metric].content;

                if (metricData[metric].chartData) {
                    const modalChartCtx = document.getElementById('modalEngineChart')?.getContext('2d');
                    if (modalChartCtx) {
                        new Chart(modalChartCtx, {
                            type: 'line',
                            data: {
                                labels: ['-6h', '-5h', '-4h', '-3h', '-2h', '-1h', 'Now'],
                                datasets: [{
                                    label: 'Temperature (°C)',
                                    data: metricData[metric].chartData,
                                    borderColor: '#00d4ff',
                                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                                    borderWidth: 2,
                                    fill: true,
                                    tension: 0.4,
                                    pointRadius: 3
                                }]
                            },
                            options: {
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: { legend: { display: false } },
                                scales: {
                                    x: { ticks: { color: '#a0a8b8' }, grid: { color: 'rgba(160, 168, 184, 0.1)' } },
                                    y: { ticks: { color: '#a0a8b8' }, grid: { color: 'rgba(160, 168, 184, 0.1)' } }
                                }
                            }
                        });
                    }
                }
            }

            modal.classList.add('active');
        }

        function closeModal() {
            document.getElementById('metricModal').classList.remove('active');
            const modalCanvas = document.getElementById('modalEngineChart');
            if (modalCanvas) {
                const chartInstance = Chart.getChart(modalCanvas);
                if (chartInstance) {
                    chartInstance.destroy();
                }
            }
        }

        function showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.style.cssText = `
                position: fixed; top: 100px; right: 20px;
                background: var(--accent-blue); color: white;
                padding: 15px 20px; border-radius: 8px;
                z-index: 10000; animation: slideIn 0.3s ease;`;
            notification.textContent = message;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        window.addEventListener('beforeunload', () => {
            if (updateInterval) {
                clearInterval(updateInterval);
            }
        });
    }

    // Start the page initialization process
    initializePage();
});


function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        autoDisplay: false
    }, 'google_translate_element');
}