// TODO: Connect to backend API — replace mock data with GET /api/v1/challenges/:nodeId

export type ChallengeLanguage = 'kotlin' | 'python' | 'javascript' | 'typescript' | 'java';

export interface TestCase {
  id: string;
  description: string;
  input: string;
  expectedOutput: string;
  isPassing?: boolean; // set after mock evaluation
}

export interface CodingChallenge {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: ChallengeLanguage;
  timeLimit: number; // seconds
  starterCode: string;
  solutionCode?: string;
  testCases: TestCase[];
  hints: string[];
  explanation: string;
}

export const codingChallenges: CodingChallenge[] = [
  // ─── Jetpack Compose Challenge ─────────────────────────────────
  {
    id: 'challenge-android-ui',
    nodeId: 'android-ui',
    title: 'Build a Counter Component',
    description: `Create a simple counter application using Jetpack Compose.

The component should:
1. Display the current count
2. Have an "Increment" button that increases the count by 1
3. Have a "Decrement" button that decreases the count by 1
4. Prevent the count from going below 0
5. Display the count prominently in the center`,
    difficulty: 'intermediate',
    language: 'kotlin',
    timeLimit: 1800,
    starterCode: `@Composable
fun CounterApp() {
    // TODO: Implement your counter here
    // Hint: Use remember { mutableStateOf(0) } for state
    
    var count by remember { mutableStateOf(0) }
    
    Column(
        modifier = Modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // TODO: Display count
        
        // TODO: Add Increment button
        
        // TODO: Add Decrement button (disable or prevent going below 0)
    }
}`,
    hints: [
      'Use `remember { mutableStateOf(0) }` to create reactive state',
      'Use `Button(onClick = { ... })` for click handlers',
      'Add a condition to prevent count from going below 0',
      'Use `Text(text = count.toString(), style = MaterialTheme.typography.displayLarge)` for the counter display',
    ],
    explanation: 'This challenge tests your understanding of Compose state management. The key is using `remember` with `mutableStateOf` to create state that triggers recomposition.',
    testCases: [
      { id: 'tc-1', description: 'Initial count is 0', input: 'Initial render', expectedOutput: 'Count displays: 0' },
      { id: 'tc-2', description: 'Increment increases count', input: 'Click Increment once', expectedOutput: 'Count displays: 1' },
      { id: 'tc-3', description: 'Decrement decreases count', input: 'Click Decrement from 2', expectedOutput: 'Count displays: 1' },
      { id: 'tc-4', description: 'Count does not go below 0', input: 'Click Decrement at 0', expectedOutput: 'Count remains: 0' },
    ],
  },
  // ─── MVVM Challenge ────────────────────────────────────────────
  {
    id: 'challenge-android-architecture',
    nodeId: 'android-architecture',
    title: 'Implement a ViewModel for User Profile',
    description: `Create a ViewModel that manages a user profile state.

Requirements:
1. Create a \`UserProfile\` data class with name, email, and bio fields
2. Create a \`ProfileViewModel\` that exposes the profile as StateFlow
3. Add an \`updateName\` function
4. Add an \`updateEmail\` function  
5. Profile should have a loading state`,
    difficulty: 'intermediate',
    language: 'kotlin',
    timeLimit: 2400,
    starterCode: `data class UserProfile(
    val name: String = "",
    val email: String = "",
    val bio: String = "",
    val isLoading: Boolean = false
)

class ProfileViewModel : ViewModel() {
    // TODO: Create a private MutableStateFlow
    // TODO: Expose it as a public StateFlow
    
    // TODO: Add updateName function
    
    // TODO: Add updateEmail function
    
    // TODO: Add loadProfile function that simulates loading
}`,
    hints: [
      'Use `MutableStateFlow(UserProfile())` for the private state',
      'Expose via `val profile: StateFlow<UserProfile> = _profile.asStateFlow()`',
      'In update functions, use `_profile.value = _profile.value.copy(name = newName)`',
      'Use `viewModelScope.launch` for the loading simulation',
    ],
    explanation: 'ViewModels separate UI logic from business logic. StateFlow is the modern way to expose reactive state from a ViewModel.',
    testCases: [
      { id: 'tc-1', description: 'ViewModel initializes with empty profile', input: 'Create ViewModel', expectedOutput: 'profile.value.name == ""' },
      { id: 'tc-2', description: 'updateName changes name', input: 'updateName("Alice")', expectedOutput: 'profile.value.name == "Alice"' },
      { id: 'tc-3', description: 'updateEmail changes email', input: 'updateEmail("a@b.com")', expectedOutput: 'profile.value.email == "a@b.com"' },
    ],
  },
  // ─── Python ML Challenge ───────────────────────────────────────
  {
    id: 'challenge-python-ml',
    nodeId: 'python-ml',
    title: 'Data Analysis with Pandas',
    description: `Given a list of student scores, perform basic data analysis.

Requirements:
1. Create a Pandas DataFrame from the provided data
2. Calculate the mean score
3. Find the student with the highest score
4. Filter students who passed (score >= 60)
5. Add a 'grade' column based on score ranges`,
    difficulty: 'beginner',
    language: 'python',
    timeLimit: 1800,
    starterCode: `import pandas as pd

data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'],
    'score': [85, 52, 91, 67, 78]
}

# TODO: Create a DataFrame
df = None

# TODO: Calculate mean score
mean_score = None

# TODO: Find student with highest score
top_student = None

# TODO: Filter passing students (score >= 60)
passing_students = None

# TODO: Add grade column
# A: 90-100, B: 80-89, C: 70-79, D: 60-69, F: below 60
`,
    hints: [
      'Use `pd.DataFrame(data)` to create the DataFrame',
      'Use `df["score"].mean()` for mean',
      'Use `df.loc[df["score"].idxmax()]` for top student',
      'Use `df[df["score"] >= 60]` for filtering',
      'Use `pd.cut()` or a function with `apply()` for grades',
    ],
    explanation: 'Pandas is the foundation of data science in Python. These operations — creating DataFrames, aggregating, filtering — are used daily.',
    testCases: [
      { id: 'tc-1', description: 'DataFrame created correctly', input: 'pd.DataFrame(data)', expectedOutput: 'DataFrame with 5 rows, columns: name, score' },
      { id: 'tc-2', description: 'Mean score is correct', input: 'mean calculation', expectedOutput: '74.6' },
      { id: 'tc-3', description: 'Top student identified', input: 'max score finder', expectedOutput: 'Charlie with score 91' },
      { id: 'tc-4', description: 'Passing students filtered', input: 'score >= 60 filter', expectedOutput: '4 students pass' },
    ],
  },
  // ─── React Challenge ───────────────────────────────────────────
  {
    id: 'challenge-react-core',
    nodeId: 'react-core',
    title: 'Build a Todo List with React',
    description: `Build a functional Todo list application.

Requirements:
1. Display a list of todos
2. Add new todos via an input field
3. Mark todos as complete/incomplete
4. Delete todos
5. Show count of remaining incomplete todos`,
    difficulty: 'intermediate',
    language: 'typescript',
    timeLimit: 2400,
    starterCode: `import { useState } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');

  // TODO: Add addTodo function
  const addTodo = () => {};

  // TODO: Add toggleTodo function
  const toggleTodo = (id: number) => {};

  // TODO: Add deleteTodo function
  const deleteTodo = (id: number) => {};

  return (
    <div>
      {/* TODO: Build your UI here */}
      <h1>Todo App</h1>
      <p>Remaining: {/* TODO: count */}</p>
    </div>
  );
}`,
    hints: [
      'Use `Date.now()` for unique IDs',
      'For toggleTodo: `setTodos(todos.map(t => t.id === id ? {...t, completed: !t.completed} : t))`',
      'For deleteTodo: `setTodos(todos.filter(t => t.id !== id))`',
      'Remaining count: `todos.filter(t => !t.completed).length`',
    ],
    explanation: 'This tests your understanding of React state management, event handling, and list rendering with keys.',
    testCases: [
      { id: 'tc-1', description: 'Renders empty list initially', input: 'Initial render', expectedOutput: 'Empty todo list, 0 remaining' },
      { id: 'tc-2', description: 'Can add a todo', input: 'Type "Buy milk", click Add', expectedOutput: 'List shows "Buy milk"' },
      { id: 'tc-3', description: 'Can mark todo complete', input: 'Click on todo', expectedOutput: 'Todo shows completed style, count decreases' },
      { id: 'tc-4', description: 'Can delete a todo', input: 'Click delete button', expectedOutput: 'Todo removed from list' },
    ],
  },
];

export function getChallengeByNodeId(nodeId: string): CodingChallenge | undefined {
  return codingChallenges.find((c) => c.nodeId === nodeId);
}
