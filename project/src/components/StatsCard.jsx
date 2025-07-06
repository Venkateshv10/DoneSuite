import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'green': return 'bg-green-50 text-green-600 border-green-200';
      case 'orange': return 'bg-orange-50 text-orange-600 border-orange-200';
      case 'red': return 'bg-red-50 text-red-600 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg border ${getColorClasses(color)}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;