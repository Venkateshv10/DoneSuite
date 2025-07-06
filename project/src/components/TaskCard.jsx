import React, { useState } from 'react';
import { 
  MoreHorizontal, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Edit3, 
  Trash2,
  Play,
  Pause
} from 'lucide-react';

const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: task.title,
    description: task.description,
    priority: task.priority,
    dueDate: task.dueDate || '',
    project: task.project || '',
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-orange-600';
      case 'pending': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(task.id, { status: newStatus });
    setShowMenu(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    onUpdate(task.id, editForm);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditForm({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate || '',
      project: task.project || '',
    });
    setIsEditing(false);
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className={`bg-white rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
      isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200'
    }`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`${getStatusColor(task.status)}`}>
              {getStatusIcon(task.status)}
            </div>
            <span className={`px-2 py-1 text-xs font-medium rounded-md border ${getPriorityColor(task.priority)}`}>
              {task.priority.toUpperCase()}
            </span>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MoreHorizontal className="h-4 w-4 text-gray-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleStatusChange('pending')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Mark as Pending</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Play className="h-4 w-4" />
                    <span>Mark as In Progress</span>
                  </button>
                  <button
                    onClick={() => handleStatusChange('completed')}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark as Complete</span>
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit3 className="h-4 w-4" />
                    <span>Edit Task</span>
                  </button>
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Task</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editForm.title}
              onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Task title"
            />
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Task description"
              rows={3}
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={editForm.priority}
                onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input
                type="date"
                value={editForm.dueDate}
                onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <input
              type="text"
              value={editForm.project}
              onChange={(e) => setEditForm({ ...editForm, project: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Project name (optional)"
            />
            <div className="flex space-x-3">
              <button
                onClick={handleSaveEdit}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancelEdit}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>
            
            {/* Metadata */}
            <div className="space-y-2">
              {task.project && (
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Project:</span> {task.project}
                </div>
              )}
              {task.dueDate && (
                <div className={`flex items-center space-x-1 text-xs ${
                  isOverdue ? 'text-red-600' : 'text-gray-500'
                }`}>
                  <Calendar className="h-3 w-3" />
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  {isOverdue && <span className="font-medium">(Overdue)</span>}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;