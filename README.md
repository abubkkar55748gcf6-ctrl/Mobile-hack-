# 📱 Professional Device Monitoring Dashboard

A modern, responsive web-based monitoring dashboard for managing and viewing authorized mobile devices in real-time. Built with vanilla HTML, CSS, and JavaScript.

## 🎯 Features

### Core Dashboard Features
- **Live Screen Preview** - Real-time display of connected device screens with full-screen capability
- **Device Management** - Add, remove, and manage multiple authorized devices
- **Connection Status** - Track online/offline status and battery levels
- **Activity Logs** - Comprehensive logging of all device interactions and events
- **Analytics & Charts** - Visual representation of device connections and activity timelines

### User Interface
- **Responsive Design** - Optimized for desktop, tablet, and mobile views
- **Dark Theme** - Modern dark interface with smooth animations
- **Sidebar Navigation** - Easy access to Dashboard, Devices, Activity, and Settings
- **Real-time Updates** - Auto-refresh with configurable intervals
- **Zoom Controls** - 50-200% zoom on device previews with smooth scaling

### Device Controls
- Device list with status indicators
- Battery percentage display
- IP address information
- Last active timestamp
- Online/Offline status badges

### Advanced Features
- **Fullscreen Preview Mode** - Expanded view of device screens
- **Activity Filtering** - Filter logs by event type or date range
- **Auto-Refresh** - Background updates with configurable intervals
- **System Settings** - Customize refresh rates, notifications, and display options

## 📁 Project Structure

```
Mobile-hack-/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and responsive design
├── script.js           # JavaScript functionality and interactivity
└── README.md           # This file
```

## 🚀 Getting Started

### Installation
1. Clone or download this repository
2. No dependencies required - runs completely in the browser
3. Simply open `index.html` in any modern web browser

### Usage
1. **View Dashboard**: The dashboard loads automatically with mock devices
2. **Select Device**: Click any device in the "Available Devices" panel to view its preview
3. **Add Device**: Navigate to "Devices" tab and click "+ Add Device" to register new devices
4. **Monitor Activity**: Check the "Activity History" tab to view all device interactions
5. **Adjust Settings**: Use the Settings tab to customize refresh rates and notifications

## 🎨 UI Components

### Navigation
- **Sidebar**: Contains main navigation menu with Dashboard, Devices, Activity, and Settings
- **Header**: Shows current section title, search box, and notification badge
- **Status Indicator**: System status with online/offline indicator

### Panels & Cards
- **Stats Grid**: 4-card overview showing connected devices, online count, active sessions, and uptime
- **Live Preview**: Large preview area for selected device with zoom controls
- **Device List**: Scrollable list of all connected devices with status indicators
- **Charts**: Connection status (doughnut chart) and activity timeline (line chart)
- **Activity Table**: Detailed log of all events with timestamp, device, event type, and status

### Modals
- **Fullscreen Preview**: Expanded device viewing mode with independent zoom controls
- **Add Device Modal**: Form to register new devices with name, ID, connection URL, and token

## ⚙️ Configuration

### Settings Available
- **Auto Refresh**: Enable/disable automatic dashboard updates
- **Refresh Interval**: Set update frequency (1-60 seconds)
- **Dark Mode**: Toggle dark/light theme (experimental)
- **Enable Notifications**: Control system notifications
- **Connection Alerts**: Notifications for device connection/disconnection
- **Activity Alerts**: Notifications for device activities

### Mock Data
The dashboard includes pre-loaded mock data:
- 4 sample devices (iPhone, Samsung, iPad, Pixel)
- 5 activity log entries
- Realistic battery levels and statuses

## 📊 Data Structure

### Device Object
```javascript
{
    id: 'device_001',
    name: 'iPhone 14 Pro',
    model: 'iOS 17.0',
    status: 'online',           // 'online' or 'offline'
    battery: 85,                // 0-100
    lastActive: Date,           // Last interaction timestamp
    ip: '192.168.1.100'
}
```

### Activity Object
```javascript
{
    timestamp: Date,
    device: 'iPhone 14 Pro',
    event: 'Screen Update',     // Type of event
    details: 'Display refreshed',
    status: 'success'           // 'success' or 'error'
}
```

## 🎯 Key Functions

### Navigation & Display
- `switchSection(sectionName)` - Switch between Dashboard/Devices/Activity/Settings
- `selectDevice(deviceId)` - Select and display a device
- `updatePreview(device)` - Render device preview

### Device Management
- `addNewDevice(e)` - Add new device from modal form
- `removeDevice(deviceId)` - Remove device from dashboard
- `renderDeviceList()` - Render sidebar device list
- `renderDevicesGrid()` - Render devices management grid

### Analytics & Monitoring
- `updateStats()` - Update statistics cards
- `renderActivityLogs()` - Render recent activity table
- `filterActivityLogs(type)` - Filter logs by event type
- `addActivity(device, event, details, status)` - Log new activity

### Charts
- `initConnectionChart()` - Initialize device connection status chart
- `initActivityChart()` - Initialize hourly activity timeline chart

### Zoom & Preview
- `zoomPreview(delta)` - Zoom main preview (±10%)
- `zoomModalPreview(delta)` - Zoom fullscreen preview
- `openFullscreen()` - Open fullscreen modal
- `closeFullscreen()` - Close fullscreen modal

## 🌐 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Modern mobile browsers

## 📦 Dependencies

- **Chart.js 3.9.1** - For data visualization (CDN link included)
- No other external dependencies required

## 🔒 Security Notes

This is a frontend-only dashboard. For production use:
1. Implement backend authentication
2. Use secure WebSocket connections (wss://)
3. Validate and sanitize all inputs
4. Implement proper authorization checks
5. Use secure token storage (HTTP-only cookies)

## 🎨 Customization

### Color Scheme
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #1e40af;
    --success-color: #10b981;
    --danger-color: #ef4444;
    /* ... */
}
```

### Sidebar Width
```css
--sidebar-width: 280px;
```

### Animations
All animations use CSS transitions with 0.3s duration for smooth interactions.

## 📈 Performance

- Lightweight - No heavy frameworks or libraries (except Chart.js)
- Fast rendering - Efficient DOM manipulation
- Smooth animations - GPU-accelerated CSS transforms
- Responsive - Mobile-first design approach

## 🐛 Troubleshooting

### Charts not displaying?
- Check Chart.js CDN link in index.html
- Ensure canvas elements have IDs matching the code

### Zoom not working?
- Verify CSS transform properties are applied
- Check browser console for JavaScript errors

### Devices not loading?
- Mock data loads automatically on page load
- Check browser console for initialization errors

## 🚀 Future Enhancements

- [ ] Backend API integration
- [ ] Real WebSocket connections
- [ ] Device screenshot capture
- [ ] Remote control functionality
- [ ] Video stream preview
- [ ] Advanced analytics dashboard
- [ ] Export reports to PDF
- [ ] Multi-user support
- [ ] Device grouping/tagging
- [ ] Custom alerts and thresholds

## 📝 License

MIT License - Feel free to use this project for personal or commercial purposes.

## 👤 Author

Created for professional device monitoring and management use cases.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests to improve the dashboard.

---

## Quick Start Guide

1. **Open Dashboard**: Load `index.html` in your browser
2. **View Devices**: Mock devices load automatically on the left panel
3. **Select Device**: Click any device to see its preview
4. **Check Activity**: Navigate to Activity tab to view logs
5. **Add Device**: Go to Devices tab and click "+ Add Device"
6. **Customize**: Visit Settings to adjust refresh rates and alerts
7. **Full Screen**: Click ⛶ button to expand preview to full screen

Enjoy monitoring your devices with this professional dashboard! 🚀
