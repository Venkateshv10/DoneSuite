export const getStatusColor = (status) => {
  const statusColors = {
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'submitted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'active': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'development': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'registered': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'testing': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};

export const getDifficultyColor = (difficulty) => {
  const difficultyColors = {
    'easy': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'medium': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'hard': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  
  return difficultyColors[difficulty] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
};