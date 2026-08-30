export const rawTasks = [
  {
    id: 'task-capstone-android',
    nodeId: 'capstone-project',
    title: 'Build a Production Android App',
    description: `Build a complete, production-quality Android application and deploy it to the Google Play Store (or prepare a signed APK).

Your app should solve a real-world problem, demonstrate all the skills learned in this roadmap, and be something you'd be proud to show in a job interview.

Some ideas:
- A habit tracker with streaks and analytics
- A recipe finder with API integration
- A weather dashboard with offline support
- A personal finance tracker`,
    difficulty: 'advanced',
    durationHours: 168,
    githubRequired: true,
    liveUrlRequired: false,
    technologies: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Room', 'Retrofit', 'Firebase'],
    deliverables: [
      'Fully functional Android APK',
      'Complete GitHub repository with README',
      'Architecture documentation',
      'Screenshots / demo video',
    ],
    requirements: [
      { id: 'req-1', text: 'Uses Jetpack Compose for all UI', isRequired: true },
      { id: 'req-2', text: 'Implements MVVM architecture', isRequired: true },
      { id: 'req-3', text: 'Has at least 3 distinct screens', isRequired: true },
      { id: 'req-4', text: 'Integrates a REST API or Firebase', isRequired: true },
      { id: 'req-5', text: 'Implements local data persistence (Room)', isRequired: true },
      { id: 'req-6', text: 'Has unit tests for ViewModel', isRequired: false },
      { id: 'req-7', text: 'Deployed to Play Store', isRequired: false },
    ],
    evaluationCriteria: [
      'Code quality and organization',
      'Architecture pattern adherence',
      'UI/UX design quality',
      'Error handling and edge cases',
      'Git commit history',
    ],
    resources: [
      { title: 'Android App Quality Guidelines', url: 'https://developer.android.com/quality' },
      { title: 'Play Store Publishing Guide', url: 'https://developer.android.com/distribute' },
    ],
  },
  {
    id: 'task-android-midpoint',
    nodeId: 'android-midpoint',
    title: 'Build a Notes App',
    description: `Build a complete CRUD Notes application that demonstrates all the Android skills you've learned.

The app should allow users to create, read, update, and delete notes. It must use Room for local storage and follow MVVM architecture.`,
    difficulty: 'intermediate',
    durationHours: 72,
    githubRequired: true,
    liveUrlRequired: false,
    technologies: ['Kotlin', 'Jetpack Compose', 'MVVM', 'Room', 'Coroutines'],
    deliverables: ['Working Notes app APK', 'GitHub repository', 'README with screenshots'],
    requirements: [
      { id: 'req-1', text: 'Create new notes with title and body', isRequired: true },
      { id: 'req-2', text: 'Display all notes in a scrollable list', isRequired: true },
      { id: 'req-3', text: 'Edit existing notes', isRequired: true },
      { id: 'req-4', text: 'Delete notes with confirmation', isRequired: true },
      { id: 'req-5', text: 'Notes persist after app restart using Room', isRequired: true },
      { id: 'req-6', text: 'Search/filter notes', isRequired: false },
      { id: 'req-7', text: 'Note timestamps', isRequired: false },
    ],
    evaluationCriteria: [
      'Correct CRUD operations',
      'Room database integration',
      'Compose UI quality',
      'Error handling',
    ],
    resources: [
      { title: 'Room Persistence Library', url: 'https://developer.android.com/training/data-storage/room' },
    ],
  },
  {
    id: 'task-ml-capstone',
    nodeId: 'ml-capstone',
    title: 'End-to-End ML Project',
    description: `Build and deploy a complete machine learning project from data collection to model deployment.

Choose a dataset and ML problem that interests you — classification, regression, or NLP. Document your entire process.`,
    difficulty: 'advanced',
    durationHours: 120,
    githubRequired: true,
    liveUrlRequired: true,
    technologies: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow/PyTorch', 'FastAPI/Flask', 'Docker'],
    deliverables: [
      'Jupyter Notebook with EDA and model training',
      'REST API serving the model',
      'GitHub repository',
      'Live demo URL (Hugging Face Spaces or Render)',
    ],
    requirements: [
      { id: 'req-1', text: 'Exploratory Data Analysis (EDA)', isRequired: true },
      { id: 'req-2', text: 'Data preprocessing pipeline', isRequired: true },
      { id: 'req-3', text: 'Trained and evaluated model', isRequired: true },
      { id: 'req-4', text: 'API endpoint serving predictions', isRequired: true },
      { id: 'req-5', text: 'Deployed and accessible online', isRequired: true },
      { id: 'req-6', text: 'Model performance comparison (multiple algorithms)', isRequired: false },
    ],
    evaluationCriteria: [
      'Data analysis quality',
      'Model performance metrics',
      'Code organization and documentation',
      'API design',
      'Deployment success',
    ],
    resources: [{ title: 'Hugging Face Spaces', url: 'https://huggingface.co/spaces' }],
  },
  {
    id: 'task-frontend-capstone',
    nodeId: 'frontend-capstone',
    title: 'Build a Full-Stack React Application',
    description: `Build a complete, deployable React application that demonstrates your frontend mastery.

Requirements: Authentication, API integration, responsive design, and deployment to Vercel or Netlify.`,
    difficulty: 'advanced',
    durationHours: 96,
    githubRequired: true,
    liveUrlRequired: true,
    technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'REST APIs'],
    deliverables: [
      'Deployed application (live URL)',
      'GitHub repository with README',
      'Mobile-responsive design',
    ],
    requirements: [
      { id: 'req-1', text: 'Authentication (login/register)', isRequired: true },
      { id: 'req-2', text: 'At least 5 distinct pages/views', isRequired: true },
      { id: 'req-3', text: 'Consumes a public or custom API', isRequired: true },
      { id: 'req-4', text: 'Fully responsive on mobile', isRequired: true },
      { id: 'req-5', text: 'Deployed and accessible live', isRequired: true },
      { id: 'req-6', text: 'Unit tests', isRequired: false },
    ],
    evaluationCriteria: [
      'UI/UX quality',
      'Code organization',
      'TypeScript usage',
      'Performance',
      'Deployment',
    ],
    resources: [{ title: 'Vercel Deployment', url: 'https://vercel.com/docs' }],
  },
];
