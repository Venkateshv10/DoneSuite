export const sampleParticipants = [
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
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    team: 'Tech Innovators',
    skills: ['JavaScript', 'Vue.js', 'MongoDB'],
    experience: 'Intermediate',
    project: 'Smart Inventory System',
    status: 'registered',
    joinDate: '2024-01-17',
    progress: 45
  }
];

export const sampleProjects = [
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

export const sampleTasks = [
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