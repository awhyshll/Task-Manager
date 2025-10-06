class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderTasks();
        this.updateProgress();
    }

    bindEvents() {
        document.getElementById('taskForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });

        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEditedTask();
        });

        document.getElementById('filterAll').addEventListener('click', () => this.setFilter('all'));
        document.getElementById('filterPending').addEventListener('click', () => this.setFilter('pending'));
        document.getElementById('filterCompleted').addEventListener('click', () => this.setFilter('completed'));

        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderTasks();
        });

        document.getElementById('clearCompleted').addEventListener('click', () => {
            this.clearCompletedTasks();
        });

        document.getElementById('cancelEdit').addEventListener('click', () => {
            this.closeEditModal();
        });

        document.getElementById('editModal').addEventListener('click', (e) => {
            if (e.target.id === 'editModal') {
                this.closeEditModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeEditModal();
            }
        });

        document.getElementById('fabButton').addEventListener('click', () => {
            this.toggleFabMenu();
        });

        document.addEventListener('click', (e) => {
            const fab = document.getElementById('fabButton');
            const fabMenu = document.getElementById('fabMenu');
            if (!fab.contains(e.target) && !fabMenu.contains(e.target)) {
                this.closeFabMenu();
            }
        });
    }

    addTask() {
        const taskInput = document.getElementById('taskInput');
        const prioritySelect = document.getElementById('prioritySelect');
        
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        const task = {
            id: Date.now().toString(),
            text: taskText,
            priority: prioritySelect.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateProgress();

        taskInput.value = '';
        prioritySelect.value = 'medium';

        taskInput.focus();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? new Date().toISOString() : null;
            
            this.saveTasks();
            this.renderTasks();
            this.updateProgress();
        }
    }

    deleteTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (!task) return;

        if (confirm(`Are you sure you want to delete "${task.text}"?`)) {
            const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
            if (taskElement) {
                taskElement.classList.add('task-removing');
                setTimeout(() => {
                    this.tasks = this.tasks.filter(t => t.id !== taskId);
                    this.saveTasks();
                    this.renderTasks();
                    this.updateProgress();
                }, 200);
            }
        }
    }

    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            document.getElementById('editTaskId').value = task.id;
            document.getElementById('editTaskInput').value = task.text;
            document.getElementById('editPrioritySelect').value = task.priority;
            this.openEditModal();
        }
    }

    saveEditedTask() {
        const taskId = document.getElementById('editTaskId').value;
        const newText = document.getElementById('editTaskInput').value.trim();
        const newPriority = document.getElementById('editPrioritySelect').value;

        if (!newText) return;

        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.text = newText;
            task.priority = newPriority;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.renderTasks();
            this.closeEditModal();
        }
    }

    openEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.getElementById('editTaskInput').focus();
    }

    closeEditModal() {
        const modal = document.getElementById('editModal');
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('[id^="filter"]').forEach(btn => {
            btn.classList.remove('filter-active', 'bg-blue-600', 'text-white');
            btn.classList.add('bg-gray-300', 'text-black');
        });
        
        const activeButton = document.getElementById(`filter${filter.charAt(0).toUpperCase() + filter.slice(1)}`);
        activeButton.classList.add('filter-active', 'bg-blue-600', 'text-white');
        activeButton.classList.remove('bg-gray-300', 'text-black');
        
        this.renderTasks();
    }

    clearCompletedTasks() {
        const completedCount = this.tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
            this.tasks = this.tasks.filter(t => !t.completed);
            this.saveTasks();
            this.renderTasks();
            this.updateProgress();
        }
    }

    getFilteredTasks() {
        let filteredTasks = [...this.tasks];

        switch (this.currentFilter) {
            case 'pending':
                filteredTasks = filteredTasks.filter(t => !t.completed);
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(t => t.completed);
                break;
        }

        switch (this.currentSort) {
            case 'oldest':
                filteredTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                filteredTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'alphabetical':
                filteredTasks.sort((a, b) => a.text.toLowerCase().localeCompare(b.text.toLowerCase()));
                break;
            case 'newest':
            default:
                filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }

        return filteredTasks;
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.getFilteredTasks();

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        
        taskList.innerHTML = filteredTasks.map((task, index) => `
            <div class="task-item border-4 border-black p-6 priority-${task.priority} ${task.completed ? 'task-completed' : ''} w-full bg-transparent" 
                 data-task-id="${task.id}">
                <div class="flex items-center justify-between">
                    <div class="flex items-center space-x-4 flex-1">
                        <div>
                            <input 
                                type="checkbox" 
                                ${task.completed ? 'checked' : ''} 
                                onchange="taskManager.toggleTask('${task.id}')"
                                class="w-6 h-6 text-green-600 focus:ring-2 focus:ring-green-500 cursor-pointer"
                            >
                        </div>
                        <div class="flex-1">
                            <p class="task-text text-black text-lg font-medium ${task.completed ? 'line-through text-black' : ''}">
                                ${this.escapeHtml(task.text)}
                            </p>
                            <div class="flex items-center space-x-3 mt-2">
                                <span class="text-sm px-3 py-1 font-medium ${this.getPriorityColor(task.priority)}">
                                    ${this.getPriorityIcon(task.priority)} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                </span>
                                <span class="text-sm text-black flex items-center">
                                    <i class="fas fa-calendar-plus mr-1"></i>
                                    ${this.formatDate(task.createdAt)}
                                </span>
                                ${task.completedAt ? `
                                    <span class="text-sm text-green-600 flex items-center font-medium">
                                        <i class="fas fa-check-circle mr-1"></i>
                                        ${this.formatDate(task.completedAt)}
                                    </span>
                                ` : ''}
                                ${task.updatedAt ? `
                                    <span class="text-sm text-blue-600 flex items-center">
                                        <i class="fas fa-edit mr-1"></i>
                                        Updated: ${this.formatDate(task.updatedAt)}
                                    </span>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="task-actions flex space-x-2 ml-4">
                        <button 
                            onclick="taskManager.editTask('${task.id}')"
                            class="px-4 py-2 bg-yellow-500 text-white hover:bg-yellow-600 border border-black"
                            title="Edit task"
                        >
                            <i class="fas fa-edit"></i>
                        </button>
                        <button 
                            onclick="taskManager.deleteTask('${task.id}')"
                            class="px-4 py-2 bg-red-500 text-white hover:bg-red-600 border border-black"
                            title="Delete task"
                        >
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div class="mt-4 pt-4 border-t border-black">
                    <div class="flex items-center justify-between text-xs text-black">
                        <span class="flex items-center">
                            <i class="fas fa-clock mr-1"></i>
                            ${this.getTimeAgo(task.createdAt)}
                        </span>
                        <span class="flex items-center space-x-2">
                            ${task.completed ? 
                                '<span class="flex items-center text-green-600"><i class="fas fa-trophy mr-1"></i>Completed</span>' : 
                                '<span class="flex items-center text-orange-500"><i class="fas fa-hourglass-half mr-1"></i>In Progress</span>'
                            }
                        </span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateProgress() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(t => t.completed).length;
        const pendingTasks = totalTasks - completedTasks;
        const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        document.getElementById('totalTasks').textContent = totalTasks;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('pendingTasks').textContent = pendingTasks;
        document.getElementById('progressBar').style.width = `${progressPercentage}%`;
        document.getElementById('progressText').textContent = `${progressPercentage}% Complete`;
    }

    getPriorityColor(priority) {
        switch (priority) {
            case 'high':
                return 'bg-red-100 text-black border border-black';
            case 'medium':
                return 'bg-yellow-100 text-black border border-black';
            case 'low':
                return 'bg-green-100 text-black border border-black';
            default:
                return 'bg-gray-100 text-black border border-black';
        }
    }

    getPriorityIcon(priority) {
        switch (priority) {
            case 'high':
                return '🔴';
            case 'medium':
                return '🟡';
            case 'low':
                return '🟢';
            default:
                return '⚪';
        }
    }

    getTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        
        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return date.toLocaleDateString();
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    loadTasks() {
        try {
            const savedTasks = localStorage.getItem('taskManagerTasks');
            return savedTasks ? JSON.parse(savedTasks) : [];
        } catch (error) {
            console.error('Error loading tasks:', error);
            return [];
        }
    }

    saveTasks() {
        try {
            localStorage.setItem('taskManagerTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks:', error);
            alert('Unable to save tasks. Please check your browser storage settings.');
        }
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    importTasks(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedTasks = JSON.parse(e.target.result);
                if (Array.isArray(importedTasks)) {
                    if (confirm('This will replace all existing tasks. Continue?')) {
                        this.tasks = importedTasks;
                        this.saveTasks();
                        this.renderTasks();
                        this.updateProgress();
                        alert('Tasks imported successfully!');
                    }
                } else {
                    alert('Invalid file format.');
                }
            } catch (error) {
                alert('Error reading file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    toggleFabMenu() {
        const fabMenu = document.getElementById('fabMenu');
        const isOpen = fabMenu.classList.contains('opacity-100');
        
        if (isOpen) {
            this.closeFabMenu();
        } else {
            this.openFabMenu();
        }
    }

    openFabMenu() {
        const fabMenu = document.getElementById('fabMenu');
        
        fabMenu.classList.remove('opacity-0', 'scale-0');
        fabMenu.classList.add('opacity-100', 'scale-100');
    }

    closeFabMenu() {
        const fabMenu = document.getElementById('fabMenu');
        
        fabMenu.classList.remove('opacity-100', 'scale-100');
        fabMenu.classList.add('opacity-0', 'scale-0');
    }

    handleFileImport(event) {
        const file = event.target.files[0];
        if (file) {
            this.importTasks(file);
        }
        event.target.value = '';
        this.closeFabMenu();
    }

    showStats() {
        const stats = this.calculateStats();
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        
        modal.innerHTML = `
            <div class="bg-transparent border border-black p-8 w-full max-w-lg mx-4">
                <div class="text-center mb-6">
                    <div class="bg-gray-600 p-3 w-16 h-16 mx-auto mb-4">
                        <i class="fas fa-chart-bar text-white text-2xl"></i>
                    </div>
                    <h3 class="text-2xl font-bold text-black">
                        Task Statistics
                    </h3>
                </div>
                
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div class="bg-blue-500 p-4 text-white text-center border border-black">
                        <div class="text-2xl font-bold">${stats.total}</div>
                        <div class="text-blue-100">Total Tasks</div>
                    </div>
                    <div class="bg-green-500 p-4 text-white text-center border border-black">
                        <div class="text-2xl font-bold">${stats.completed}</div>
                        <div class="text-green-100">Completed</div>
                    </div>
                    <div class="bg-orange-500 p-4 text-white text-center border border-black">
                        <div class="text-2xl font-bold">${stats.pending}</div>
                        <div class="text-orange-100">Pending</div>
                    </div>
                    <div class="bg-purple-500 p-4 text-white text-center border border-black">
                        <div class="text-2xl font-bold">${stats.completionRate}%</div>
                        <div class="text-purple-100">Success Rate</div>
                    </div>
                </div>

                <div class="space-y-4 mb-6">
                    <div>
                        <div class="flex justify-between text-sm text-black mb-1">
                            <span>High Priority</span>
                            <span>${stats.priority.high}</span>
                        </div>
                        <div class="w-full bg-gray-200 h-2 border border-black">
                            <div class="bg-red-500 h-2" style="width: ${(stats.priority.high / stats.total) * 100}%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm text-black mb-1">
                            <span>Medium Priority</span>
                            <span>${stats.priority.medium}</span>
                        </div>
                        <div class="w-full bg-gray-200 h-2 border border-black">
                            <div class="bg-yellow-500 h-2" style="width: ${(stats.priority.medium / stats.total) * 100}%"></div>
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between text-sm text-black mb-1">
                            <span>Low Priority</span>
                            <span>${stats.priority.low}</span>
                        </div>
                        <div class="w-full bg-gray-200 h-2 border border-black">
                            <div class="bg-green-500 h-2" style="width: ${(stats.priority.low / stats.total) * 100}%"></div>
                        </div>
                    </div>
                </div>

                <div class="text-center">
                    <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 bg-gray-600 text-white hover:bg-gray-700 font-medium border border-black">
                        <i class="fas fa-times mr-2"></i>Close
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.closeFabMenu();

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        };
    }

    calculateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const pending = total - completed;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        const priority = {
            high: this.tasks.filter(t => t.priority === 'high').length,
            medium: this.tasks.filter(t => t.priority === 'medium').length,
            low: this.tasks.filter(t => t.priority === 'low').length
        };

        return { total, completed, pending, completionRate, priority };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.taskManager = new TaskManager();
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const taskInput = document.getElementById('taskInput');
            if (document.activeElement === taskInput && taskInput.value.trim()) {
                document.getElementById('taskForm').dispatchEvent(new Event('submit'));
            }
        }
    });
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}