# Task Manager with Progress Tracker

A modern, responsive task management application built with HTML, CSS, JavaScript, and Tailwind CSS. This app helps users organize their daily tasks and track progress with a clean, intuitive interface.

## Features

### Core Functionality
- ✅ **Add Tasks**: Create new tasks with different priority levels
- ✅ **Edit Tasks**: Modify existing tasks with an easy-to-use modal
- ✅ **Complete Tasks**: Mark tasks as completed with visual feedback
- ✅ **Delete Tasks**: Remove individual tasks or clear all completed ones
- ✅ **Progress Tracking**: Visual progress bar and statistics

### Advanced Features
- 🎨 **Priority Levels**: High, Medium, and Low priority with color coding
- 🔍 **Filtering**: View All, Pending, or Completed tasks
- 📊 **Sorting**: Sort by newest, oldest, priority, or alphabetical order
- 💾 **Local Storage**: Automatic data persistence between sessions
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile
- ⚡ **Offline Support**: Service Worker for offline functionality
- 🎯 **Progress Overview**: Real-time statistics and completion percentage

### User Experience
- ⌨️ **Keyboard Shortcuts**: Ctrl/Cmd + Enter to quickly add tasks
- 🎭 **Smooth Animations**: CSS transitions for better UX
- 🎨 **Modern UI**: Clean design with Tailwind CSS
- ♿ **Accessibility**: Proper ARIA labels and keyboard navigation

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Storage**: Browser LocalStorage
- **Offline**: Service Worker API

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional installations required

### Installation
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start managing your tasks!

### File Structure
```
task-manager/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Custom CSS styles
├── js/
│   └── app.js          # Main JavaScript application
├── sw.js               # Service Worker for offline support
└── README.md           # This file
```

## Usage

### Adding Tasks
1. Enter your task in the input field
2. Select a priority level (Low, Medium, High)
3. Click "Add Task" or press Ctrl/Cmd + Enter

### Managing Tasks
- **Complete**: Click the checkbox next to any task
- **Edit**: Click the yellow edit button to modify a task
- **Delete**: Click the red delete button to remove a task

### Filtering and Sorting
- Use the filter buttons to show All, Pending, or Completed tasks
- Use the sort dropdown to organize tasks by date, priority, or alphabetically
- Click "Clear Completed" to remove all finished tasks

### Progress Tracking
- View your progress in the overview section
- See total, completed, and pending task counts
- Monitor completion percentage with the progress bar

## Offline Functionality

This app includes a Service Worker that enables offline functionality:
- Tasks are stored locally using browser LocalStorage
- The app can be used without an internet connection
- All features work offline after the initial load

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Data Privacy

- All data is stored locally in your browser
- No data is sent to external servers
- Tasks persist between browser sessions
- Clear browser data to reset the app

## Customization

### Styling
- Modify `css/style.css` to customize the appearance
- Tailwind CSS classes can be adjusted in `index.html`
- Color scheme can be changed by updating CSS variables

### Features
- Add new task properties by modifying the Task class in `js/app.js`
- Extend filtering and sorting options
- Add new task actions or bulk operations

## Troubleshooting

### Tasks Not Saving
- Check if LocalStorage is enabled in your browser
- Ensure you're not in private/incognito mode
- Clear browser cache and reload the page

### Offline Mode Not Working
- Check if Service Workers are supported in your browser
- Ensure the app is served over HTTPS (for production)
- Check browser console for Service Worker errors

## Contributing

This is a standalone project, but you can:
1. Fork the repository
2. Make your improvements
3. Test thoroughly across different browsers
4. Submit suggestions or improvements

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the browser console for error messages
2. Verify browser compatibility
3. Test in a different browser
4. Clear browser data and try again

---

**Happy Task Managing! 🎯**