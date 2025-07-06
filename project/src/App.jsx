import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Users, Trophy, Clock, Filter, Eye } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import { Header } from './components/Header';
import { StatCard } from './components/StatCard';
import { sampleParticipants, sampleProjects, sampleTasks } from './data/sampleData';
import { exportToJSON, exportToCSV } from './utils/dataExport';
import { getStatusColor, getDifficultyColor } from './utils/statusColors';

function AppContent() {
  // All hooks at the top
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('participants');
  const [searchTerm, setSearchTerm] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [participants] = useState(sampleParticipants);
  const [projects] = useState(sampleProjects);
  const [tasks] = useState(sampleTasks);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

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
    exportToJSON(data);
  };

  const getFilterOptions = () => {
    if (activeTab === 'participants') {
      return ['all', 'registered', 'active', 'submitted', 'completed'];
    } else if (activeTab === 'projects') {
      return ['all', 'planning', 'development', 'testing', 'submitted'];
    } else if (activeTab === 'tasks') {
      return ['all', 'pending', 'in-progress', 'completed'];
    }
    return ['all'];
  };

  const getCurrentData = () => {
    if (activeTab === 'participants') return filteredParticipants;
    if (activeTab === 'projects') return filteredProjects;
    if (activeTab === 'tasks') return filteredTasks;
    return [];
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedFilter('all');
    setSearchTerm('');
  };

  // Only do conditional rendering after all hooks
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <Header 
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onExportData={exportData}
        user={user}
      />

      <div className="container mx-auto px-4 py-6">
        {/* Welcome Message */}
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Signed in with {user.provider === 'email' ? 'email' : user.provider}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Participants"
            value={stats.totalParticipants}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={Trophy}
            color="purple"
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={Clock}
            color="green"
          />
          <StatCard
            title="Task Progress"
            value={`${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%`}
            icon={Trophy}
            color="yellow"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-1 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            {['participants', 'projects', 'tasks'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
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
              {getFilterOptions().map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-3 py-1 rounded-full text-sm capitalize transition-colors duration-200 ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {filter.replace('-', ' ')}
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
        {getCurrentData().length === 0 && (
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

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <p className="text-gray-600 dark:text-gray-400">
              © 2024 DoneSuite - Powered by <span className="font-semibold text-blue-600 dark:text-blue-400">VENKATESH STACKS</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;