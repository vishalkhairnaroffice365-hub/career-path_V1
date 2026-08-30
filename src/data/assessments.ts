// TODO: Connect to backend API — replace mock data with GET /api/v1/assessments/:nodeId

export interface MCQOption {
  id: string;
  text: string;
}

export interface MCQQuestion {
  id: string;
  question: string;
  options: MCQOption[];
  correctAnswer: string; // option id
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Assessment {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  passingScore: number; // percentage 0-100
  questions: MCQQuestion[];
}

export const assessments: Assessment[] = [
  // ─── Kotlin Fundamentals Assessment ───────────────────────────
  {
    id: 'assessment-kotlin-basics',
    nodeId: 'kotlin-basics',
    title: 'Kotlin Fundamentals Assessment',
    description: 'Test your knowledge of Kotlin basics including variables, functions, OOP, and null safety.',
    timeLimit: 900, // 15 minutes
    passingScore: 70,
    questions: [
      {
        id: 'q-kt-1',
        question: 'Which keyword is used to declare an immutable variable in Kotlin?',
        options: [
          { id: 'a', text: 'var' },
          { id: 'b', text: 'val' },
          { id: 'c', text: 'let' },
          { id: 'd', text: 'const' },
        ],
        correctAnswer: 'b',
        explanation: '`val` declares a read-only (immutable) variable. `var` declares a mutable variable.',
        difficulty: 'easy',
      },
      {
        id: 'q-kt-2',
        question: 'What does the `?` operator signify in Kotlin?',
        options: [
          { id: 'a', text: 'Optional chaining' },
          { id: 'b', text: 'Nullable type' },
          { id: 'c', text: 'Elvis operator' },
          { id: 'd', text: 'Ternary expression' },
        ],
        correctAnswer: 'b',
        explanation: 'In Kotlin, appending `?` to a type makes it nullable, e.g., `String?` can hold `null`.',
        difficulty: 'easy',
      },
      {
        id: 'q-kt-3',
        question: 'Which keyword is used for inheritance in Kotlin?',
        options: [
          { id: 'a', text: 'implements' },
          { id: 'b', text: 'extends' },
          { id: 'c', text: 'inherit' },
          { id: 'd', text: ':' },
        ],
        correctAnswer: 'd',
        explanation: 'Kotlin uses `:` for both class inheritance and interface implementation.',
        difficulty: 'easy',
      },
      {
        id: 'q-kt-4',
        question: 'What is the output of: `val result = if (5 > 3) "yes" else "no"`?',
        options: [
          { id: 'a', text: '"no"' },
          { id: 'b', text: 'null' },
          { id: 'c', text: '"yes"' },
          { id: 'd', text: 'Compilation error' },
        ],
        correctAnswer: 'c',
        explanation: 'In Kotlin, `if` is an expression and can return a value. 5 > 3 is true, so result is "yes".',
        difficulty: 'easy',
      },
      {
        id: 'q-kt-5',
        question: 'Which Kotlin feature allows you to call a function on a nullable receiver without crashing?',
        options: [
          { id: 'a', text: 'Safe call operator (?.)' },
          { id: 'b', text: 'Elvis operator (?:)' },
          { id: 'c', text: 'Non-null assertion (!!)' },
          { id: 'd', text: 'let block' },
        ],
        correctAnswer: 'a',
        explanation: 'The safe call operator `?.` returns null if the receiver is null instead of throwing NullPointerException.',
        difficulty: 'medium',
      },
      {
        id: 'q-kt-6',
        question: 'What does `data class` automatically provide in Kotlin?',
        options: [
          { id: 'a', text: 'Only a constructor' },
          { id: 'b', text: 'equals(), hashCode(), toString(), and copy()' },
          { id: 'c', text: 'Serialization support' },
          { id: 'd', text: 'Thread safety' },
        ],
        correctAnswer: 'b',
        explanation: 'Data classes automatically generate equals(), hashCode(), toString(), copy(), and componentN() functions.',
        difficulty: 'medium',
      },
      {
        id: 'q-kt-7',
        question: 'What is a Kotlin coroutine?',
        options: [
          { id: 'a', text: 'A type of thread' },
          { id: 'b', text: 'A design pattern' },
          { id: 'c', text: 'A lightweight concurrency primitive for async code' },
          { id: 'd', text: 'A Java interop feature' },
        ],
        correctAnswer: 'c',
        explanation: 'Coroutines are lightweight concurrency primitives that make async code sequential and readable.',
        difficulty: 'medium',
      },
      {
        id: 'q-kt-8',
        question: 'Which of the following is true about Kotlin\'s `object` keyword?',
        options: [
          { id: 'a', text: 'It creates a new class instance' },
          { id: 'b', text: 'It declares a singleton' },
          { id: 'c', text: 'It creates an abstract class' },
          { id: 'd', text: 'It is used for companion functions only' },
        ],
        correctAnswer: 'b',
        explanation: '`object` declarations in Kotlin create singletons — a class with only one instance.',
        difficulty: 'medium',
      },
      {
        id: 'q-kt-9',
        question: 'What is the difference between `launch` and `async` in Kotlin coroutines?',
        options: [
          { id: 'a', text: '`launch` returns a result, `async` does not' },
          { id: 'b', text: '`async` returns a Deferred result, `launch` returns a Job' },
          { id: 'c', text: 'They are identical' },
          { id: 'd', text: '`launch` is for UI, `async` is for IO' },
        ],
        correctAnswer: 'b',
        explanation: '`async` returns `Deferred<T>` and can return a result via `.await()`. `launch` returns a `Job` and is fire-and-forget.',
        difficulty: 'hard',
      },
      {
        id: 'q-kt-10',
        question: 'What is a `sealed class` best used for in Kotlin?',
        options: [
          { id: 'a', text: 'Preventing inheritance completely' },
          { id: 'b', text: 'Representing restricted class hierarchies for when expressions' },
          { id: 'c', text: 'Encrypting data' },
          { id: 'd', text: 'Singleton creation' },
        ],
        correctAnswer: 'b',
        explanation: 'Sealed classes restrict class hierarchies. When used in `when` expressions, the compiler can verify exhaustiveness.',
        difficulty: 'hard',
      },
    ],
  },
  // ─── Jetpack Compose Assessment ────────────────────────────────
  {
    id: 'assessment-android-ui',
    nodeId: 'android-ui',
    title: 'Jetpack Compose UI Assessment',
    description: 'Test your understanding of Jetpack Compose including composables, state, and theming.',
    timeLimit: 720,
    passingScore: 70,
    questions: [
      {
        id: 'q-ui-1',
        question: 'What annotation is required on every Compose UI function?',
        options: [
          { id: 'a', text: '@Component' },
          { id: 'b', text: '@Composable' },
          { id: 'c', text: '@UI' },
          { id: 'd', text: '@Layout' },
        ],
        correctAnswer: 'b',
        explanation: 'Every Compose UI function must be annotated with `@Composable` to participate in the Compose tree.',
        difficulty: 'easy',
      },
      {
        id: 'q-ui-2',
        question: 'How do you correctly hold UI state in a Compose function?',
        options: [
          { id: 'a', text: 'Using a global variable' },
          { id: 'b', text: 'Using `remember { mutableStateOf() }`' },
          { id: 'c', text: 'Using `staticValue()`' },
          { id: 'd', text: 'Using a companion object' },
        ],
        correctAnswer: 'b',
        explanation: '`remember { mutableStateOf() }` creates state that survives recompositions within a composable.',
        difficulty: 'easy',
      },
      {
        id: 'q-ui-3',
        question: 'Which Compose layout is equivalent to a horizontal LinearLayout?',
        options: [
          { id: 'a', text: 'Column' },
          { id: 'b', text: 'Box' },
          { id: 'c', text: 'Row' },
          { id: 'd', text: 'Grid' },
        ],
        correctAnswer: 'c',
        explanation: '`Row` arranges children horizontally, similar to a horizontal LinearLayout.',
        difficulty: 'easy',
      },
      {
        id: 'q-ui-4',
        question: 'What does `LazyColumn` provide in Jetpack Compose?',
        options: [
          { id: 'a', text: 'A horizontal scrollable list' },
          { id: 'b', text: 'An efficient vertically scrolling list that only composes visible items' },
          { id: 'c', text: 'A static column that cannot scroll' },
          { id: 'd', text: 'A grid layout' },
        ],
        correctAnswer: 'b',
        explanation: '`LazyColumn` is the Compose equivalent of `RecyclerView` — it only composes items that are visible.',
        difficulty: 'medium',
      },
      {
        id: 'q-ui-5',
        question: 'What is "recomposition" in Jetpack Compose?',
        options: [
          { id: 'a', text: 'Recreating the entire Activity' },
          { id: 'b', text: 'Re-executing composable functions when state changes' },
          { id: 'c', text: 'Redrawing the screen every frame' },
          { id: 'd', text: 'Restarting the app' },
        ],
        correctAnswer: 'b',
        explanation: 'Recomposition is when Compose re-executes composable functions in response to state changes, updating the UI efficiently.',
        difficulty: 'medium',
      },
    ],
  },
  // ─── React Assessment ──────────────────────────────────────────
  {
    id: 'assessment-react-core',
    nodeId: 'react-core',
    title: 'React Core Assessment',
    description: 'Test your knowledge of React components, hooks, and state management.',
    timeLimit: 720,
    passingScore: 70,
    questions: [
      {
        id: 'q-re-1',
        question: 'What hook is used to manage state in a functional React component?',
        options: [
          { id: 'a', text: 'useEffect' },
          { id: 'b', text: 'useState' },
          { id: 'c', text: 'useContext' },
          { id: 'd', text: 'useReducer' },
        ],
        correctAnswer: 'b',
        explanation: '`useState` returns a state variable and a setter function for managing component state.',
        difficulty: 'easy',
      },
      {
        id: 'q-re-2',
        question: 'When does `useEffect` run by default?',
        options: [
          { id: 'a', text: 'Only on initial mount' },
          { id: 'b', text: 'After every render' },
          { id: 'c', text: 'Before every render' },
          { id: 'd', text: 'Only when state changes' },
        ],
        correctAnswer: 'b',
        explanation: 'With no dependency array, `useEffect` runs after every render. An empty `[]` makes it run only on mount.',
        difficulty: 'medium',
      },
      {
        id: 'q-re-3',
        question: 'What is the purpose of a React key in list rendering?',
        options: [
          { id: 'a', text: 'Styling list items' },
          { id: 'b', text: 'Helping React identify which items changed, added, or removed' },
          { id: 'c', text: 'Sorting list items' },
          { id: 'd', text: 'Preventing re-renders' },
        ],
        correctAnswer: 'b',
        explanation: 'Keys help React efficiently update the DOM by identifying which list items have changed.',
        difficulty: 'easy',
      },
    ],
  },
];

export function getAssessmentByNodeId(nodeId: string): Assessment | undefined {
  return assessments.find((a) => a.nodeId === nodeId);
}
