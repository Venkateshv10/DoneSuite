// DoneSuite - Hackathon Management System
// Powered by VENKATESH STACKS

class DoneSuite {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'participants';
        this.currentFilter = 'all';
        this.darkMode = localStorage.getItem('darkMode') === 'true';
        this.searchTerm = '';
        
        // Sample data
        this.participants = [
            {
                id: '1',
                name: 'Alex Johnson',
                email: 'alex.johnson@email.com',
                team: 'Code Crushers',
                skills: ['React', 'Node.js', 'Python'],
                experience: 'Intermediate',
                project: 'AI Task Manager',
                status: 'active',
                joinDate: '2024-01-15',
                progress: 75
            },
            {
                id: '2',
                name: 'Sarah Chen',
                email: 'sarah.chen@email.com',
                team: 'Code Crushers',
                skills: ['UI/UX', 'Figma', 'React'],
                experience: 'Advanced',
                project: 'AI Task Manager',
                status: 'active',
                joinDate: '2024-01-15',
                progress: 80
            },
            {
                id: '3',
                name: 'Mike Rodriguez',
                email: 'mike.rodriguez@email.com',
                team: 'Data Warriors',
                skills: ['Python', 'Machine Learning', 'TensorFlow'],
                experience: 'Advanced',
                project: 'Predictive Analytics Dashboard',
                status: 'completed',
                joinDate: '2024-01-16',
                progress: 100
            },
            {
                id: '4',
                name: 'Emma Wilson',
                email: 'emma.wilson@email.com',
                team: 'Tech Innovators',
                skills: ['JavaScript', 'Vue.js', 'MongoDB'],
                experience: 'Intermediate',
                project: 'Smart Inventory System',
                status: 'pending',
                joinDate: '2024-01-17',
                progress: 45
            }
        ];

        this.projects = [
            {
                id: '1',
                title: 'AI Task Manager',
                description: 'An intelligent task management system with AI-powered prioritization and scheduling.',
                team: 'Code Crushers',
                participants: ['Alex Johnson', 'Sarah Chen'],
                category: 'AI/ML',
                status: 'development',
                progress: 78,
                technologies: ['React', 'Node.js', 'OpenAI API', 'MongoDB'],
                githubUrl: 'https://github.com/codecrushers/ai-task-manager',
                demoUrl: 'https://ai-task-manager-demo.vercel.app'
            },
            {
                id: '2',
                title: 'Predictive Analytics Dashboard',
                description: 'Real-time data visualization and predictive analytics for business intelligence.',
                team: 'Data Warriors',
                participants: ['Mike Rodriguez'],
                category: 'Data Science',
                status: 'completed',
                progress: 100,
                submissionDate: '2024-01-20',
                technologies: ['Python', 'Streamlit', 'Pandas', 'Scikit-learn'],
                githubUrl: 'https://github.com/datawarriors/analytics-dashboard',
                demoUrl: 'https://analytics-dashboard-demo.streamlit.app'
            },
            {
                id: '3',
                title: 'Smart Inventory System',
                description: 'IoT-based inventory management with real-time tracking and automated reordering.',
                team: 'Tech Innovators',
                participants: ['Emma Wilson'],
                category: 'IoT',
                status: 'planning',
                progress: 25,
                technologies: ['Vue.js', 'Express.js', 'PostgreSQL', 'Arduino'],
                githubUrl: 'https://github.com/techinnovators/smart-inventory'
            }
        ];

        this.tasks = [
            {
                id: '1',
                title: 'Project Proposal Submission',
                description: 'Submit your initial project proposal with team details and technology stack.',
                category: 'Documentation',
                difficulty: 'easy',
                points: 100,
                deadline: '2024-01-25',
                requirements: ['Project title and description', 'Team member details', 'Technology stack'],
                status: 'completed',
                assignedTo: 'All Teams'
            },
            {
                id: '2',
                title: 'MVP Development',
                description: 'Develop a minimum viable product with core functionality.',
                category: 'Development',
                difficulty: 'hard',
                points: 500,
                deadline: '2024-02-15',
                requirements: ['Core functionality implemented', 'Basic UI/UX', 'Database integration'],
                status: 'active',
                assignedTo: 'All Teams'
            },
            {
                id: '3',
                title: 'Code Review & Testing',
                description: 'Conduct thorough code review and implement comprehensive testing.',
                category: 'Quality Assurance',
                difficulty: 'medium',
                points: 300,
                deadline: '2024-02-20',
                requirements: ['Unit tests', 'Integration tests', 'Code documentation'],
                status: 'pending',
                assignedTo: 'All Teams'
            },
            {
                id: '4',
                title: 'Final Presentation',
                description: 'Prepare and deliver final project presentation to judges.',
                category: 'Presentation',
                difficulty: 'medium',
                points: 400,
                deadline: '2024-02-25',
                requirements: ['Demo video', 'Presentation slides', 'Technical documentation'],
                status: 'pending',
                assignedTo: 'All Teams'
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.updateIcons();
    }

    setupEventListeners() {
        // Login form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            this.handleLogout();
        });

        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this.renderContent();
        });

        // Filter toggle
        document.getElementById('filterToggle').addEventListener('click', () => {
            this.toggleFilterPanel();
        });

        // Export functionality
        document.getElementById('exportBtn').addEventListener('click', () => {
            this.exportData();
        });
    }

    handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Simple authentication (in real app, this would be server-side)
        if (username && password) {
            this.currentUser = { username, loginTime: new Date() };
            document.getElementById('loginPage').classList.add('hidden');
            document.getElementById('dashboard').classList.remove('hidden');
            this.loadDashboard();
        } else {
            alert('Please enter valid credentials');
        }
    }

    handleLogout() {
        this.currentUser = null;
        document.getElementById('dashboard').classList.add('hidden');
        document.getElementById('loginPage').classList.remove('hidden');
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode);
        this.applyTheme();
    }

    applyTheme() {
        if (this.darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        this.updateIcons();
    }

    updateIcons() {
        // Update theme toggle icon
        const themeIcon = document.querySelector('#themeToggle i');
        if (themeIcon) {
            themeIcon.setAttribute('data-lucide', this.darkMode ? 'sun' : 'moon');
            lucide.createIcons();
        }
    }

    loadDashboard() {
        this.updateStatistics();
        this.renderContent();
        this.setupFilterButtons();
    }

    updateStatistics() {
        const totalParticipants = this.participants.length;
        const activeProjects = this.projects.filter(p => p.status !== 'completed').length;
        const completedTasks = this.tasks.filter(t => t.status === 'completed').length;
        const overallProgress = Math.round(
            this.projects.reduce((sum, p) => sum + p.progress, 0) / this.projects.length
        );

        document.getElementById('totalParticipants').textContent = totalParticipants;
        document.getElementById('activeProjects').textContent = activeProjects;
        document.getElementById('completedTasks').textContent = completedTasks;
        document.getElementById('overallProgress').textContent = `${overallProgress}%`;
    }

    switchTab(tab) {
        this.currentTab = tab;
        this.currentFilter = 'all';
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-blue-600', 'text-white');
            btn.classList.add('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');
        });
        
        const activeBtn = document.querySelector(`[data-tab="${tab}"]`);
        activeBtn.classList.add('active', 'bg-blue-600', 'text-white');
        activeBtn.classList.remove('text-gray-600', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700');

        this.setupFilterButtons();
        this.renderContent();
    }

    setupFilterButtons() {
        const filterContainer = document.getElementById('filterButtons');
        filterContainer.innerHTML = '';

        let filters = ['all'];
        
        if (this.currentTab === 'participants') {
            filters.push('active', 'pending', 'completed');
        } else if (this.currentTab === 'projects') {
            filters.push('planning', 'development', 'testing', 'completed');
        } else if (this.currentTab === 'tasks') {
            filters.push('pending', 'active', 'completed');
        }

        filters.forEach(filter => {
            const button = document.createElement('button');
            button.className = `px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                this.currentFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`;
            button.textContent = filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ');
            button.addEventListener('click', () => {
                this.currentFilter = filter;
                this.setupFilterButtons();
                this.renderContent();
            });
            filterContainer.appendChild(button);
        });
    }

    toggleFilterPanel() {
        const panel = document.getElementById('filterPanel');
        panel.classList.toggle('hidden');
    }

    getFilteredData() {
        let data = [];
        
        if (this.currentTab === 'participants') {
            data = this.participants;
        } else if (this.currentTab === 'projects') {
            data = this.projects;
        } else if (this.currentTab === 'tasks') {
            data = this.tasks;
        }

        // Apply search filter
        if (this.searchTerm) {
            data = data.filter(item => {
                const searchFields = this.currentTab === 'participants' 
                    ? [item.name, item.email, item.team]
                    : this.currentTab === 'projects'
                    ? [item.title, item.team, item.category]
                    : [item.title, item.category];
                
                return searchFields.some(field => 
                    field.toLowerCase().includes(this.searchTerm)
                );
            });
        }

        // Apply status filter
        if (this.currentFilter !== 'all') {
            data = data.filter(item => item.status === this.currentFilter);
        }

        return data;
    }

    renderContent() {
        const contentArea = document.getElementById('contentArea');
        const data = this.getFilteredData();

        if (data.length === 0) {
            contentArea.innerHTML = this.renderEmptyState();
            return;
        }

        if (this.currentTab === 'participants') {
            contentArea.innerHTML = this.renderParticipants(data);
        } else if (this.currentTab === 'projects') {
            contentArea.innerHTML = this.renderProjects(data);
        } else if (this.currentTab === 'tasks') {
            contentArea.innerHTML = this.renderTasks(data);
        }

        // Re-initialize Lucide icons
        lucide.createIcons();
    }

    renderParticipants(participants) {
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                ${participants.map(participant => `
                    <div class="glass dark:glass-dark rounded-xl p-6 card-hover">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    ${participant.name}
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${participant.email}</p>
                            </div>
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(participant.status)}">
                                ${participant.status}
                            </span>
                        </div>
                        
                        <div class="space-y-3">
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Team</p>
                                <p class="font-medium text-gray-900 dark:text-white">${participant.team}</p>
                            </div>
                            
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Skills</p>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    ${participant.skills.map(skill => `
                                        <span class="px-2 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs rounded-md">
                                            ${skill}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">${participant.progress}%</p>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div class="progress-bar h-2 rounded-full transition-all duration-300" style="width: ${participant.progress}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderProjects(projects) {
        return `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                ${projects.map(project => `
                    <div class="glass dark:glass-dark rounded-xl p-6 card-hover">
                        <div class="flex items-start justify-between mb-4">
                            <div class="flex-1">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                    ${project.title}
                                </h3>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${project.team}</p>
                            </div>
                            <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(project.status)}">
                                ${project.status}
                            </span>
                        </div>
                        
                        <p class="text-gray-700 dark:text-gray-300 mb-4">${project.description}</p>
                        
                        <div class="space-y-3">
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Category</p>
                                <p class="font-medium text-gray-900 dark:text-white">${project.category}</p>
                            </div>
                            
                            <div>
                                <p class="text-sm text-gray-600 dark:text-gray-400">Technologies</p>
                                <div class="flex flex-wrap gap-1 mt-1">
                                    ${project.technologies.map(tech => `
                                        <span class="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-200 text-xs rounded-md">
                                            ${tech}
                                        </span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <div>
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">${project.progress}%</p>
                                </div>
                                <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div class="progress-bar h-2 rounded-full transition-all duration-300" style="width: ${project.progress}%"></div>
                                </div>
                            </div>
                            
                            ${(project.githubUrl || project.demoUrl) ? `
                                <div class="flex space-x-2 pt-2">
                                    ${project.githubUrl ? `
                                        <a href="${project.githubUrl}" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center space-x-1">
                                            <i data-lucide="github" class="w-4 h-4"></i>
                                            <span>GitHub</span>
                                        </a>
                                    ` : ''}
                                    ${project.demoUrl ? `
                                        <a href="${project.demoUrl}" target="_blank" class="text-green-600 dark:text-green-400 hover:underline text-sm flex items-center space-x-1">
                                            <i data-lucide="external-link" class="w-4 h-4"></i>
                                            <span>Demo</span>
                                        </a>
                                    ` : ''}
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTasks(tasks) {
        return `
            <div class="space-y-4">
                ${tasks.map(task => `
                    <div class="glass dark:glass-dark rounded-xl p-6 card-hover">
                        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                            <div class="flex-1">
                                <div class="flex items-start justify-between mb-3">
                                    <div class="flex-1">
                                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                            ${task.title}
                                        </h3>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">${task.category}</p>
                                    </div>
                                    <div class="flex space-x-2 ml-4">
                                        <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getDifficultyClass(task.difficulty)}">
                                            ${task.difficulty}
                                        </span>
                                        <span class="px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClass(task.status)}">
                                            ${task.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>
                                
                                <p class="text-gray-700 dark:text-gray-300 mb-4">${task.description}</p>
                                
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">Points</p>
                                        <p class="font-bold text-blue-600 dark:text-blue-400">${task.points}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                                        <p class="font-medium text-gray-900 dark:text-white">${new Date(task.deadline).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">Assigned To</p>
                                        <p class="font-medium text-gray-900 dark:text-white">${task.assignedTo}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        ${task.requirements.length > 0 ? `
                            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">Requirements</p>
                                <ul class="list-disc list-inside space-y-1">
                                    ${task.requirements.map(req => `
                                        <li class="text-sm text-gray-700 dark:text-gray-300">${req}</li>
                                    `).join('')}
                                </ul>
                            </div>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderEmptyState() {
        return `
            <div class="text-center py-12">
                <div class="text-gray-400 dark:text-gray-600 mb-4">
                    <i data-lucide="search" class="w-12 h-12 mx-auto"></i>
                </div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
                <p class="text-gray-600 dark:text-gray-400">
                    Try adjusting your search terms or filters
                </p>
            </div>
        `;
    }

    getStatusClass(status) {
        const classes = {
            'completed': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
            'active': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
            'development': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
            'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
            'planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
            'testing': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
        };
        return classes[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }

    getDifficultyClass(difficulty) {
        const classes = {
            'easy': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
            'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
            'hard': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200'
        };
        return classes[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }

    exportData() {
        const data = {
            participants: this.participants,
            projects: this.projects,
            tasks: this.tasks,
            exportDate: new Date().toISOString(),
            exportedBy: this.currentUser.username
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `donesuite-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new DoneSuite();
    lucide.createIcons();
});