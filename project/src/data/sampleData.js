export const sampleTodos = [
  {
    id: '1',
    title: 'Buy groceries',
    description: 'Milk, Bread, Eggs, Fruits',
    completed: false,
    priority: 'medium',
    dueDate: '2024-07-08',
    category: 'personal',
    tags: ['shopping', 'food'],
    createdAt: '2024-07-06T10:00:00Z',
    updatedAt: '2024-07-06T10:00:00Z'
  },
  {
    id: '2',
    title: 'Finish React project',
    description: 'Complete the CRUD operations and deploy to AWS Lambda',
    completed: false,
    priority: 'high',
    dueDate: '2024-07-10',
    category: 'work',
    tags: ['coding', 'react', 'aws'],
    createdAt: '2024-07-06T11:00:00Z',
    updatedAt: '2024-07-06T11:00:00Z'
  },
  {
    id: '3',
    title: 'Read a book',
    description: 'Read at least 30 pages of a new book',
    completed: true,
    priority: 'low',
    dueDate: '2024-07-05',
    category: 'personal',
    tags: ['reading', 'learning'],
    createdAt: '2024-07-05T18:00:00Z',
    updatedAt: '2024-07-06T09:00:00Z'
  },
  {
    id: '4',
    title: 'Call dentist',
    description: 'Schedule annual checkup appointment',
    completed: false,
    priority: 'medium',
    dueDate: '2024-07-12',
    category: 'health',
    tags: ['appointment', 'health'],
    createdAt: '2024-07-06T14:00:00Z',
    updatedAt: '2024-07-06T14:00:00Z'
  },
  {
    id: '5',
    title: 'Plan weekend trip',
    description: 'Research destinations and book accommodation',
    completed: false,
    priority: 'low',
    dueDate: '2024-07-15',
    category: 'personal',
    tags: ['travel', 'planning'],
    createdAt: '2024-07-06T16:00:00Z',
    updatedAt: '2024-07-06T16:00:00Z'
  }
];

export const categories = [
  { id: 'personal', name: 'Personal', color: 'bg-blue-100 text-blue-800' },
  { id: 'work', name: 'Work', color: 'bg-green-100 text-green-800' },
  { id: 'health', name: 'Health', color: 'bg-red-100 text-red-800' },
  { id: 'shopping', name: 'Shopping', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'learning', name: 'Learning', color: 'bg-purple-100 text-purple-800' }
];

export const priorities = [
  { id: 'low', name: 'Low', color: 'bg-gray-100 text-gray-800' },
  { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', name: 'High', color: 'bg-red-100 text-red-800' }
];