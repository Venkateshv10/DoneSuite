import React, { useState, useEffect, useMemo } from 'react';
import { Plus, CheckCircle, Edit, Trash2, PartyPopper, Search, Filter, Calendar, Tag, Star, Clock, BarChart3, CheckSquare, Square } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import { sampleTodos, categories, priorities } from './data/sampleData';
import './index.css';
import Header from './components/Header';

function AppContent() {
  const { user, loading } = useAuth();
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : sampleTodos;
  });
  const [newTodo, setNewTodo] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium',
    dueDate: '',
    category: 'personal',
    tags: []
  });
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTodos, setSelectedTodos] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const overdue = todos.filter(todo => !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date()).length;
    const highPriority = todos.filter(todo => !todo.completed && todo.priority === 'high').length;
    
    return { total, completed, pending, overdue, highPriority };
  }, [todos]);

  // Filter and sort todos
  const filteredTodos = useMemo(() => {
    let filtered = todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           todo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           todo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || todo.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
      const matchesStatus = filterStatus === 'all' || 
                           (filterStatus === 'completed' && todo.completed) ||
                           (filterStatus === 'pending' && !todo.completed);
      
      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });

    // Sort todos
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'dueDate':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [todos, searchTerm, filterCategory, filterPriority, filterStatus, sortBy]);

  const addTodo = () => {
    if (!newTodo.title.trim()) return;
    
    const todo = {
      id: Date.now().toString(),
      ...newTodo,
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setTodos([todo, ...todos]);
    setNewTodo({ 
      title: '', 
      description: '', 
      priority: 'medium',
      dueDate: '',
      category: 'personal',
      tags: []
    });
  };

  const updateTodo = (id, updates) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ));
    setEditId(null);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    setSelectedTodos(selectedTodos.filter(todoId => todoId !== id));
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
        : todo
    ));
  };

  const toggleSelectTodo = (id) => {
    setSelectedTodos(prev => 
      prev.includes(id) 
        ? prev.filter(todoId => todoId !== id)
        : [...prev, id]
    );
  };

  const bulkComplete = () => {
    setTodos(todos.map(todo => 
      selectedTodos.includes(todo.id)
        ? { ...todo, completed: true, updatedAt: new Date().toISOString() }
        : todo
    ));
    setSelectedTodos([]);
  };

  const bulkDelete = () => {
    setTodos(todos.filter(todo => !selectedTodos.includes(todo.id)));
    setSelectedTodos([]);
  };

  const addTag = () => {
    if (newTag.trim() && !newTodo.tags.includes(newTag.trim())) {
      setNewTodo({ ...newTodo, tags: [...newTodo.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setNewTodo({ ...newTodo, tags: newTodo.tags.filter(tag => tag !== tagToRemove) });
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Star className="w-4 h-4 text-red-500 fill-current" />;
      case 'medium': return <Star className="w-4 h-4 text-yellow-500 fill-current" />;
      case 'low': return <Star className="w-4 h-4 text-gray-400" />;
      default: return null;
    }
  };

  const isOverdue = (todo) => {
    return todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((d) => !d)} />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-2xl text-gray-700 dark:text-gray-200 animate-pulse">Loading DoneSuite...</div>
        </main>
      </div>
    );
  }
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((d) => !d)} />
        <main className="flex-1 flex items-center justify-center">
          <AuthPage />
        </main>
      </div>
    );
  }

  const allDone = todos.length > 0 && todos.every(todo => todo.completed);
  const completionPercentage = todos.length > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((d) => !d)} />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Title */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-indigo-700 dark:text-white tracking-tight drop-shadow-lg flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="inline-block align-middle mr-1">
              <circle cx="16" cy="16" r="16" fill="#6366f1" fillOpacity="0.15"/>
              <path d="M12 8l-2 8h6l-3 8 8-12h-6l2-4z" fill="#6366f1" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            DoneSuite Dashboard
          </h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-indigo-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
              <Calendar className="w-8 h-8 text-red-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">High Priority</p>
                <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
              </div>
              <Star className="w-8 h-8 text-red-500 fill-current" />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {todos.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Celebratory Message */}
        {allDone && (
          <div className="mb-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-6 text-white text-center animate-bounce">
            <PartyPopper className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-xl font-bold mb-2">🎉 All Tasks Completed! 🎉</h3>
            <p>Amazing job! You've completed all your tasks!</p>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="createdAt">Date Created</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
            </select>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>

              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority.id} value={priority.id}>{priority.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedTodos.length > 0 && (
          <div className="mb-6 flex items-center gap-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              {selectedTodos.length} task(s) selected
            </span>
            <button
              onClick={bulkComplete}
              className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm"
            >
              <CheckSquare className="w-4 h-4" />
              Mark Complete
            </button>
            <button
              onClick={bulkDelete}
              className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
            <button
              onClick={() => setSelectedTodos([])}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Clear Selection
            </button>
          </div>
        )}

        {/* Add New Todo Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add New Task</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <input
              type="text"
              placeholder="Task title..."
              value={newTodo.title}
              onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <select
              value={newTodo.priority}
              onChange={(e) => setNewTodo({ ...newTodo, priority: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>{priority.name} Priority</option>
              ))}
            </select>
            <input
              type="date"
              value={newTodo.dueDate}
              onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <select
              value={newTodo.category}
              onChange={(e) => setNewTodo({ ...newTodo, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Task description..."
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white mb-4"
            rows="2"
          />
          
          {/* Tags */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {newTodo.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-md text-sm">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              />
              <button
                onClick={addTag}
                className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
              >
                Add
              </button>
            </div>
          </div>

          <button
            onClick={addTodo}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>

        {/* Todos List */}
        {filteredTodos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No tasks found</h3>
            <p className="text-gray-500 dark:text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTodos.map(todo => (
              <div
                key={todo.id}
                className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-xl hover:scale-105 ${
                  todo.completed ? 'opacity-75' : ''
                } ${isOverdue(todo) ? 'border-red-300 dark:border-red-700' : ''}`}
              >
                {/* Selection Checkbox */}
                <div className="flex items-start justify-between mb-3">
                  <button
                    onClick={() => toggleSelectTodo(todo.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {selectedTodos.includes(todo.id) ? (
                      <CheckSquare className="w-5 h-5 text-indigo-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(todo.priority)}
                    {isOverdue(todo) && (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Overdue</span>
                    )}
                  </div>
                </div>

                {/* Todo Content */}
                <div className="mb-4">
                  <h3 className={`text-lg font-semibold mb-2 ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`text-sm mb-3 ${todo.completed ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                      {todo.description}
                    </p>
                  )}
                  
                  {/* Category and Due Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${categories.find(c => c.id === todo.category)?.color}`}>
                      {categories.find(c => c.id === todo.category)?.name}
                    </span>
                    {todo.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(todo.dueDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {todo.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {todo.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-sm transition-colors ${
                      todo.completed
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {todo.completed ? <CheckCircle className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                    {todo.completed ? 'Completed' : 'Mark Complete'}
                  </button>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditId(todo.id)}
                      className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
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