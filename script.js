// ==================== APP STATE ==================== 
const appState = {
    devices: [],
    selectedDeviceId: null,
    currentZoom: 100,
    autoRefresh: true,
    refreshInterval: 5000,
    activities: [],
    charts: {},
};

// Mock device data
const mockDevices = [
    {
        id: 'device_001',
        name: 'iPhone 14 Pro',
        model: 'iOS 17.0',
        status: 'online',
        battery: 85,
        lastActive: new Date(Date.now() - 2 * 60000),
        ip: '192.168.1.100',
    },
    {
        id: 'device_002',
        name: 'Samsung Galaxy S24',
        model: 'Android 14',
        status: 'online',
        battery: 62,
        lastActive: new Date(Date.now() - 5 * 60000),
        ip: '192.168.1.101',
    },
    {
        id: 'device_003',
        name: 'iPad Air',
        model: 'iPadOS 17.0',
        status: 'offline',
        battery: 0,
        lastActive: new Date(Date.now() - 30 * 60000),
        ip: '192.168.1.102',
    },
    {
        id: 'device_004',
        name: 'Pixel 8',
        model: 'Android 14',
        status: 'online',
        battery: 91,
        lastActive: new Date(Date.now() - 1 * 60000),
        ip: '192.168.1.103',
    },
];

// Mock activity data
const mockActivities = [
    { timestamp: new Date(Date.now() - 30000), device: 'iPhone 14 Pro', event: 'Screen Update', details: 'Display refreshed', status: 'success' },
    { timestamp: new Date(Date.now() - 60000), device: 'Samsung Galaxy S24', event: 'Connection', details: 'Device connected', status: 'success' },
    { timestamp: new Date(Date.now() - 90000), device: 'iPad Air', event: 'Connection', details: 'Connection lost', status: 'error' },
    { timestamp: new Date(Date.now() - 120000), device: 'Pixel 8', event: 'Interaction', details: 'Touch event detected', status: 'success' },
    { timestamp: new Date(Date.now() - 150000), device: 'iPhone 14 Pro', event: 'Screen Update', details: 'Display refreshed', status: 'success' },
];

// ==================== INITIALIZATION ==================== 
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    appState.devices = mockDevices;
    appState.activities = [...mockActivities];

    setupEventListeners();
    updateStats();
    renderDeviceList();
    renderActivityLogs();
    initializeCharts();
    
    // Auto-select first online device
    const firstOnline = appState.devices.find(d => d.status === 'online');
    if (firstOnline) {
        selectDevice(firstOnline.id);
    }

    // Setup auto-refresh
    if (appState.autoRefresh) {
        setInterval(refreshDashboard, appState.refreshInterval);
    }
}

// ==================== EVENT LISTENERS ==================== 
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const section = e.currentTarget.dataset.section;
            switchSection(section);
        });
    });

    // Fullscreen
    document.getElementById('fullscreen-btn').addEventListener('click', openFullscreen);
    document.getElementById('modal-close').addEventListener('click', closeFullscreen);
    document.getElementById('fullscreen-modal').addEventListener('click', (e) => {
        if (e.target.id === 'fullscreen-modal') closeFullscreen();
    });

    // Zoom controls (main)
    document.getElementById('zoom-in').addEventListener('click', () => zoomPreview(10));
    document.getElementById('zoom-out').addEventListener('click', () => zoomPreview(-10));

    // Zoom controls (modal)
    document.getElementById('modal-zoom-in').addEventListener('click', () => zoomModalPreview(10));
    document.getElementById('modal-zoom-out').addEventListener('click', () => zoomModalPreview(-10));

    // Refresh buttons
    document.getElementById('refresh-btn').addEventListener('click', refreshPreview);
    document.getElementById('refresh-devices').addEventListener('click', refreshDeviceList);

    // Device management
    document.getElementById('add-device-btn').addEventListener('click', openAddDeviceModal);
    document.getElementById('add-device-close').addEventListener('click', closeAddDeviceModal);
    document.getElementById('cancel-device').addEventListener('click', closeAddDeviceModal);
    document.getElementById('add-device-form').addEventListener('submit', addNewDevice);

    // Click outside modal to close
    document.getElementById('add-device-modal').addEventListener('click', (e) => {
        if (e.target.id === 'add-device-modal') closeAddDeviceModal();
    });

    // Settings
    document.getElementById('auto-refresh').addEventListener('change', (e) => {
        appState.autoRefresh = e.target.checked;
    });

    document.getElementById('refresh-interval').addEventListener('change', (e) => {
        appState.refreshInterval = parseInt(e.target.value) * 1000;
    });

    document.getElementById('dark-mode').addEventListener('change', (e) => {
        document.documentElement.style.filter = e.target.checked ? 'invert(1)' : 'invert(0)';
    });

    // Activity filter
    document.getElementById('filter-activity').addEventListener('change', (e) => {
        filterActivityLogs(e.target.value);
    });

    // Date range
    document.getElementById('date-from').addEventListener('change', updateActivityHistory);
    document.getElementById('date-to').addEventListener('change', updateActivityHistory);
}

// ==================== NAVIGATION ==================== 
function switchSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Show selected section
    const section = document.getElementById(`${sectionName}-section`);
    if (section) {
        section.classList.add('active');
    }

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.section === sectionName);
    });

    // Update header title
    const titles = {
        dashboard: 'Device Monitoring Dashboard',
        devices: 'Manage Devices',
        activity: 'Activity History',
        settings: 'System Settings',
    };
    document.getElementById('section-title').textContent = titles[sectionName] || 'Dashboard';

    // Reinitialize charts if switching to dashboard
    if (sectionName === 'dashboard') {
        setTimeout(() => {
            Object.values(appState.charts).forEach(chart => {
                if (chart) chart.resize();
            });
        }, 100);
    }
}

// ==================== STATS & DISPLAY ==================== 
function updateStats() {
    const connected = appState.devices.length;
    const online = appState.devices.filter(d => d.status === 'online').length;
    const active = appState.devices.filter(d => d.status === 'online' && Date.now() - d.lastActive < 5 * 60000).length;

    document.getElementById('stat-devices').textContent = connected;
    document.getElementById('stat-online').textContent = online;
    document.getElementById('stat-active').textContent = active;
}

function renderDeviceList() {
    const list = document.getElementById('device-list');
    
    if (appState.devices.length === 0) {
        list.innerHTML = '<div class="empty-state"><p>No devices connected</p></div>';
        return;
    }

    list.innerHTML = appState.devices.map(device => `
        <div class="device-item ${appState.selectedDeviceId === device.id ? 'active' : ''}" 
             onclick="selectDevice('${device.id}')">
            <div class="device-status ${device.status}"></div>
            <div class="device-avatar">${getDeviceIcon(device.model)}</div>
            <div class="device-info">
                <div class="device-name">${device.name}</div>
                <div class="device-meta">
                    ${device.model} • ${device.status === 'online' ? `${device.battery}%` : 'Offline'}
                </div>
            </div>
        </div>
    `).join('');
}

function renderDevicesGrid() {
    const grid = document.getElementById('devices-grid');
    
    if (appState.devices.length === 0) {
        grid.innerHTML = '<div class="empty-state" style="grid-column: 1/-1"><p>No devices configured</p></div>';
        return;
    }

    grid.innerHTML = appState.devices.map(device => `
        <div class="device-card">
            <div class="device-card-header">
                <div>
                    <div class="device-card-title">${device.name}</div>
                    <div class="device-card-meta">${device.model}</div>
                </div>
                <div class="device-card-badge">${device.status.toUpperCase()}</div>
            </div>
            <div class="device-card-meta">
                <div>IP: ${device.ip}</div>
                <div>Battery: ${device.status === 'online' ? device.battery + '%' : 'N/A'}</div>
                <div>Last Active: ${formatTime(device.lastActive)}</div>
            </div>
            <div class="device-card-actions">
                <button class="btn-primary" onclick="selectDevice('${device.id}'); switchSection('dashboard');">Preview</button>
                <button class="btn-secondary" onclick="removeDevice('${device.id}');">Remove</button>
            </div>
        </div>
    `).join('');
}

function selectDevice(deviceId) {
    appState.selectedDeviceId = deviceId;
    const device = appState.devices.find(d => d.id === deviceId);
    
    if (device) {
        // Update device list
        renderDeviceList();
        
        // Update preview
        updatePreview(device);
        
        // Reset zoom
        appState.currentZoom = 100;
        updateZoomDisplay();
    }
}

function updatePreview(device) {
    const container = document.getElementById('preview-container');
    const modalContainer = document.getElementById('modal-preview-container');
    
    const previewHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 20px;">${getDeviceIcon(device.model)}</div>
            <div style="color: var(--text-primary); font-size: 18px; font-weight: 600; margin-bottom: 8px;">${device.name}</div>
            <div style="color: var(--text-secondary); font-size: 14px; margin-bottom: 16px;">${device.model}</div>
            <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; color: var(--text-muted); font-size: 13px;">
                <span>🔌 ${device.ip}</span>
                <span>⚡ ${device.battery}%</span>
                <span>${device.status === 'online' ? '🟢 Online' : '🔴 Offline'}</span>
            </div>
        </div>
    `;
    
    if (container) {
        container.innerHTML = previewHTML;
        container.style.transform = `scale(${appState.currentZoom / 100})`;
    }
    
    if (modalContainer) {
        modalContainer.innerHTML = previewHTML;
        modalContainer.style.transform = `scale(${appState.currentZoom / 100})`;
    }
    
    // Update modal title
    document.getElementById('modal-device-name').textContent = `${device.name} - Live Preview`;
}

// ==================== ACTIVITY LOGS ==================== 
function renderActivityLogs() {
    const table = document.getElementById('activity-logs');
    
    if (appState.activities.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="empty-message">No activity logs yet</td></tr>';
        return;
    }

    table.innerHTML = appState.activities.slice(0, 10).map(activity => `
        <tr>
            <td>${formatTime(activity.timestamp)}</td>
            <td>${activity.device}</td>
            <td>${activity.event}</td>
            <td>${activity.details}</td>
            <td>
                <span class="status-badge ${activity.status}">
                    ${activity.status === 'success' ? '✓' : '✗'} ${activity.status}
                </span>
            </td>
        </tr>
    `).join('');
}

function filterActivityLogs(type) {
    const table = document.getElementById('activity-logs');
    
    let filtered = appState.activities;
    if (type) {
        filtered = appState.activities.filter(a => {
            const eventType = a.event.toLowerCase();
            return eventType.includes(type.toLowerCase());
        });
    }

    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="empty-message">No matching activities</td></tr>';
        return;
    }

    table.innerHTML = filtered.slice(0, 10).map(activity => `
        <tr>
            <td>${formatTime(activity.timestamp)}</td>
            <td>${activity.device}</td>
            <td>${activity.event}</td>
            <td>${activity.details}</td>
            <td>
                <span class="status-badge ${activity.status}">
                    ${activity.status === 'success' ? '✓' : '✗'} ${activity.status}
                </span>
            </td>
        </tr>
    `).join('');
}

function updateActivityHistory() {
    const fromDate = new Date(document.getElementById('date-from').value);
    const toDate = new Date(document.getElementById('date-to').value);
    const table = document.getElementById('full-activity-logs');

    if (!fromDate || !toDate) {
        renderActivityHistory();
        return;
    }

    const filtered = appState.activities.filter(a => 
        a.timestamp >= fromDate && a.timestamp <= toDate
    );

    if (filtered.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="empty-message">No activities in this date range</td></tr>';
        return;
    }

    table.innerHTML = filtered.map(activity => `
        <tr>
            <td>${activity.timestamp.toLocaleString()}</td>
            <td>${activity.device}</td>
            <td>${activity.event}</td>
            <td>${activity.details}</td>
            <td>
                <span class="status-badge ${activity.status}">
                    ${activity.status === 'success' ? '✓' : '✗'} ${activity.status}
                </span>
            </td>
        </tr>
    `).join('');
}

function renderActivityHistory() {
    const table = document.getElementById('full-activity-logs');
    
    if (appState.activities.length === 0) {
        table.innerHTML = '<tr><td colspan="5" class="empty-message">No activity history</td></tr>';
        return;
    }

    table.innerHTML = appState.activities.map(activity => `
        <tr>
            <td>${activity.timestamp.toLocaleString()}</td>
            <td>${activity.device}</td>
            <td>${activity.event}</td>
            <td>${activity.details}</td>
            <td>
                <span class="status-badge ${activity.status}">
                    ${activity.status === 'success' ? '✓' : '✗'} ${activity.status}
                </span>
            </td>
        </tr>
    `).join('');
}

// ==================== CHARTS ==================== 
function initializeCharts() {
    initConnectionChart();
    initActivityChart();
}

function initConnectionChart() {
    const ctx = document.getElementById('connection-chart');
    if (!ctx) return;

    const onlineCount = appState.devices.filter(d => d.status === 'online').length;
    const offlineCount = appState.devices.filter(d => d.status === 'offline').length;

    appState.charts.connection = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Online', 'Offline'],
            datasets: [{
                data: [onlineCount, offlineCount],
                backgroundColor: ['#10b981', '#ef4444'],
                borderColor: ['#06b66466', '#ef444466'],
                borderWidth: 2,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#f1f5f9',
                        font: { size: 12 },
                        padding: 15,
                    },
                },
            },
        },
    });
}

function initActivityChart() {
    const ctx = document.getElementById('activity-chart');
    if (!ctx) return;

    const hours = [];
    const data = [];
    const now = Date.now();

    for (let i = 23; i >= 0; i--) {
        const time = new Date(now - i * 60 * 60 * 1000);
        hours.push(time.getHours() + ':00');
        
        const count = appState.activities.filter(a => {
            const aHour = new Date(a.timestamp).getHours();
            return aHour === time.getHours();
        }).length;
        data.push(count);
    }

    appState.charts.activity = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hours,
            datasets: [{
                label: 'Activities',
                data: data,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 3,
                pointBackgroundColor: '#2563eb',
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#f1f5f9',
                        font: { size: 12 },
                    },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(51, 65, 85, 0.2)' },
                    ticks: { color: '#94a3b8' },
                },
                x: {
                    grid: { color: 'rgba(51, 65, 85, 0.2)' },
                    ticks: { color: '#94a3b8' },
                },
            },
        },
    });
}

// ==================== ZOOM CONTROLS ==================== 
function zoomPreview(delta) {
    appState.currentZoom = Math.max(50, Math.min(200, appState.currentZoom + delta));
    updateZoomDisplay();
    updatePreviewScale();
}

function zoomModalPreview(delta) {
    appState.currentZoom = Math.max(50, Math.min(200, appState.currentZoom + delta));
    updateZoomDisplay();
    updateModalPreviewScale();
}

function updateZoomDisplay() {
    document.getElementById('zoom-level').textContent = appState.currentZoom + '%';
    document.getElementById('modal-zoom-level').textContent = appState.currentZoom + '%';
}

function updatePreviewScale() {
    const container = document.getElementById('preview-container');
    if (container) {
        container.style.transform = `scale(${appState.currentZoom / 100})`;
    }
}

function updateModalPreviewScale() {
    const container = document.getElementById('modal-preview-container');
    if (container) {
        container.style.transform = `scale(${appState.currentZoom / 100})`;
    }
}

// ==================== FULLSCREEN MODE ==================== 
function openFullscreen() {
    const modal = document.getElementById('fullscreen-modal');
    modal.classList.add('active');
    
    const device = appState.devices.find(d => d.id === appState.selectedDeviceId);
    if (device) {
        updatePreview(device);
    }
}

function closeFullscreen() {
    document.getElementById('fullscreen-modal').classList.remove('active');
}

// ==================== DEVICE MANAGEMENT ==================== 
function openAddDeviceModal() {
    document.getElementById('add-device-modal').classList.add('active');
}

function closeAddDeviceModal() {
    document.getElementById('add-device-modal').classList.remove('active');
    document.getElementById('add-device-form').reset();
}

function addNewDevice(e) {
    e.preventDefault();
    const form = e.target;
    const inputs = form.querySelectorAll('input');
    
    const newDevice = {
        id: 'device_' + Date.now(),
        name: inputs[0].value,
        model: inputs[2].value.includes('ws://') ? 'Custom Device' : 'Mobile Device',
        status: 'online',
        battery: Math.floor(Math.random() * 40 + 60),
        lastActive: new Date(),
        ip: inputs[2].value,
    };

    appState.devices.push(newDevice);
    updateStats();
    renderDeviceList();
    renderDevicesGrid();
    closeAddDeviceModal();
    
    // Show success notification
    showNotification('Device added successfully!', 'success');
    
    // Add activity log
    addActivity(newDevice.name, 'Connection', 'Device added to dashboard', 'success');
}

function removeDevice(deviceId) {
    if (confirm('Are you sure you want to remove this device?')) {
        const device = appState.devices.find(d => d.id === deviceId);
        appState.devices = appState.devices.filter(d => d.id !== deviceId);
        
        if (appState.selectedDeviceId === deviceId) {
            appState.selectedDeviceId = null;
            const container = document.getElementById('preview-container');
            if (container) {
                container.innerHTML = `
                    <div class="placeholder">
                        <div class="placeholder-icon">📱</div>
                        <p>Select a device to preview</p>
                    </div>
                `;
            }
        }
        
        updateStats();
        renderDeviceList();
        renderDevicesGrid();
        addActivity(device.name, 'Connection', 'Device removed from dashboard', 'success');
    }
}

// ==================== REFRESH & UPDATES ==================== 
function refreshDashboard() {
    updateStats();
    renderActivityLogs();
    renderActivityHistory();
    
    // Simulate new activity
    if (Math.random() > 0.7) {
        const device = appState.devices[Math.floor(Math.random() * appState.devices.length)];
        const events = ['Screen Update', 'Interaction', 'Connection'];
        const event = events[Math.floor(Math.random() * events.length)];
        addActivity(device.name, event, `${event} event triggered`, 'success');
    }
}

function refreshPreview() {
    const device = appState.devices.find(d => d.id === appState.selectedDeviceId);
    if (device) {
        updatePreview(device);
        addActivity(device.name, 'Screen Update', 'Preview refreshed', 'success');
    }
}

function refreshDeviceList() {
    // Simulate device status change
    appState.devices.forEach(device => {
        if (Math.random() > 0.8) {
            device.status = device.status === 'online' ? 'offline' : 'online';
            device.battery = Math.floor(Math.random() * 40 + 60);
        }
    });
    
    updateStats();
    renderDeviceList();
    initConnectionChart();
}

function addActivity(device, event, details, status) {
    appState.activities.unshift({
        timestamp: new Date(),
        device,
        event,
        details,
        status,
    });
    
    // Keep only last 50 activities
    if (appState.activities.length > 50) {
        appState.activities.pop();
    }
    
    renderActivityLogs();
    renderActivityHistory();
}

// ==================== UTILITIES ==================== 
function formatTime(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    
    return date.toLocaleDateString();
}

function getDeviceIcon(model) {
    if (model.includes('iPhone') || model.includes('iOS')) return '🍎';
    if (model.includes('Samsung') || model.includes('Android')) return '🤖';
    if (model.includes('iPad')) return '📱';
    if (model.includes('Pixel')) return '🔵';
    return '📱';
}

function showNotification(message, type = 'info') {
    // Simple notification (could be enhanced with a toast library)
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// ==================== EXPORT DATA ==================== 
function exportActivityLogs() {
    const csv = 'Timestamp,Device,Event,Details,Status\n' + 
        appState.activities.map(a => 
            `"${a.timestamp.toISOString()}","${a.device}","${a.event}","${a.details}","${a.status}"`
        ).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${Date.now()}.csv`;
    a.click();
}

// Initialize app on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        renderDevicesGrid();
    });
} else {
    renderDevicesGrid();
}
