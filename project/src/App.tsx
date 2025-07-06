import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Download, Users, Trophy, Clock, Filter, Moon, Sun, Edit, Trash2, Eye } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  team: string;
  skills: string[];
  experience: string;
  project?: string;
  status: 'registered' | 'active' | 'submitted' | 'completed';
  joinDate: string;
  progress: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  team: string;
  participants: string[];
  category: string;
  status: 'planning' | 'development' | 'testing' | 'submitted';
  progress: number;
  submissionDate?: string;
  technologies: string[];
  githubUrl?: string;
  demoUrl?: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  deadline: string;
  requirements: string[];
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
}

function App() {
  const [activeTab, setActiveTab] = useState<'participants' | 'projects' | 'tasks'>('participants');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Sample data
  const [participants, setParticipants] = useState<Participant[]>([
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
      status: 'submitted',
      joinDate: '2024-01-16',
      progress: 100
    }
  ]);

  const [projects, setProjects] = useState<Project[]>([
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
      status: 'submitted',
      progress: 100,
      submissionDate: '2024-01-20',
      technologies: ['Python', 'Streamlit', 'Pandas', 'Scikit-learn'],
      githubUrl: 'https://github.com/datawarriors/analytics-dashboard',
      demoUrl: 'https://analytics-dashboard-demo.streamlit.app'
    }
  ]);

  const [tasks, setTasks] = useState<Task[]>([
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
      status: 'in-progress',
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
    }
  ]);

  // Filter functions
  const filteredParticipants = useMemo(() => {
    return participants.filter(participant => {
      const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           participant.team.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || participant.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [participants, searchTerm, selectedFilter]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || project.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [projects, searchTerm, selectedFilter]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           task.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter;
      return matchesSearch && matchesFilter;
    });
  }, [tasks, searchTerm, selectedFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      totalParticipants: participants.length,
      activeProjects: projects.filter(p => p.status !== 'submitted').length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      totalTasks: tasks.length
    };
  }, [participants, projects, tasks]);

  const exportData = () => {
    const data = {
      participants,
      projects,
      tasks,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hackathon-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'submitted':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'active':
      case 'development':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'registered':
      case 'planning':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'testing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Hackathon Data Manager
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Manage participants, projects, and tasks efficiently
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 text-gray-600 dark:text-gray-300"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Download className="h-4 w-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Participants</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalParticipants}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Task Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            {['participants', 'projects', 'tasks'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-md transition-all duration-200 capitalize font-medium ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white w-full sm:w-64"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                showFilters ? 'bg-blue-50 dark:bg-blue-900 border-blue-300 dark:border-blue-600' : 'bg-white dark:bg-gray-800'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                  selectedFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                All
              </button>
              {activeTab === 'participants' && ['registered', 'active', 'submitted', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm capitalize transition-colors duration-200 ${
                    selectedFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
              {activeTab === 'projects' && ['planning', 'development', 'testing', 'submitted'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm capitalize transition-colors duration-200 ${
                    selectedFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status}
                </button>
              ))}
              {activeTab === 'tasks' && ['pending', 'in-progress', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm capitalize transition-colors duration-200 ${
                    selectedFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className="space-y-6">
          {/* Participants */}
          {activeTab === 'participants' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParticipants.map((participant) => (
                <div key={participant.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {participant.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{participant.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(participant.status)}`}>
                      {participant.status}
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Team</p>
                      <p className="font-medium text-gray-900 dark:text-white">{participant.team}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Skills</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {participant.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{participant.progress}%</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${participant.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {activeTab === 'projects' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {project.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.team}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Category</p>
                      <p className="font-medium text-gray-900 dark:text-white">{project.category}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Technologies</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {project.technologies.map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-md">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{project.progress}%</p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {(project.githubUrl || project.demoUrl) && (
                      <div className="flex space-x-2 pt-2">
                        {project.githubUrl && (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                          >
                            GitHub
                          </a>
                        )}
                        {project.demoUrl && (
                          <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 dark:text-green-400 hover:underline text-sm"
                          >
                            Demo
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tasks */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{task.category}</p>
                        </div>
                        <div className="flex space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(task.difficulty)}`}>
                            {task.difficulty}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('-', ' ')}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-4">{task.description}</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
                          <p className="font-bold text-blue-600 dark:text-blue-400">{task.points}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                          <p className="font-medium text-gray-900 dark:text-white">{new Date(task.deadline).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Assigned To</p>
                          <p className="font-medium text-gray-900 dark:text-white">{task.assignedTo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {task.requirements.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Requirements</p>
                      <ul className="list-disc list-inside space-y-1">
                        {task.requirements.map((req, index) => (
                          <li key={index} className="text-sm text-gray-700 dark:text-gray-300">{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {((activeTab === 'participants' && filteredParticipants.length === 0) ||
          (activeTab === 'projects' && filteredProjects.length === 0) ||
          (activeTab === 'tasks' && filteredTasks.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;