export interface RawMCQOption {
  id: string;
  text: string;
}

export interface RawMCQQuestion {
  id: string;
  question: string;
  options: RawMCQOption[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface RawAssessment {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  timeLimit: number;
  passingScore: number;
  questions: RawMCQQuestion[];
}

export const rawAssessments: RawAssessment[] = [
  // 1. Android - Kotlin Basics
  {
    id: 'assessment-kt-basics',
    nodeId: 'kt-basics',
    title: 'Kotlin Fundamentals Assessment',
    description: 'Test your knowledge of Kotlin variables, null safety, lambdas, and control flow.',
    timeLimit: 900,
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
        explanation: '`val` declares a read-only immutable reference in Kotlin.',
        difficulty: 'easy',
      },
      {
        id: 'q-kt-2',
        question: 'What does the `?` operator signify in `String?`?',
        options: [
          { id: 'a', text: 'Optional chaining' },
          { id: 'b', text: 'Nullable type' },
          { id: 'c', text: 'Elvis operator' },
          { id: 'd', text: 'Ternary operator' },
        ],
        correctAnswer: 'b',
        explanation: 'Appending `?` to a type in Kotlin makes it nullable.',
        difficulty: 'easy',
      },
    ],
  },

  // 2. iOS - Swift Core
  {
    id: 'assessment-swift-core',
    nodeId: 'swift-core',
    title: 'Swift Language Mastery Assessment',
    description: 'Evaluate your Swift fundamentals: structs, optionals, protocols, and closures.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-sw-1',
        question: 'What is the key difference between a struct and a class in Swift?',
        options: [
          { id: 'a', text: 'Structs are reference types; classes are value types' },
          { id: 'b', text: 'Structs are value types; classes are reference types' },
          { id: 'c', text: 'Structs cannot have methods' },
          { id: 'd', text: 'Classes cannot have initializers' },
        ],
        correctAnswer: 'b',
        explanation: 'In Swift, structs are copied on assignment (value types) while classes share references.',
        difficulty: 'easy',
      },
      {
        id: 'q-sw-2',
        question: 'Which keyword is used to unwrap an optional safely with early exit?',
        options: [
          { id: 'a', text: 'guard let' },
          { id: 'b', text: 'force unwrap' },
          { id: 'c', text: 'try unwrap' },
          { id: 'd', text: 'defer' },
        ],
        correctAnswer: 'a',
        explanation: '`guard let` provides safe optional binding with guaranteed early exit.',
        difficulty: 'easy',
      },
    ],
  },

  // 3. Frontend - HTML & CSS
  {
    id: 'assessment-fe-html-semantics',
    nodeId: 'fe-html-semantics',
    title: 'HTML5 & Web Semantics Assessment',
    description: 'Test your understanding of semantic HTML tags, ARIA roles, and accessible structure.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-fe-1',
        question: 'Which HTML5 semantic element should contain the main navigation links?',
        options: [
          { id: 'a', text: '<header>' },
          { id: 'b', text: '<nav>' },
          { id: 'c', text: '<section>' },
          { id: 'd', text: '<aside>' },
        ],
        correctAnswer: 'b',
        explanation: 'The `<nav>` element is designated for major navigation link blocks.',
        difficulty: 'easy',
      },
      {
        id: 'q-fe-2',
        question: 'What attribute is used to provide alternate text for screen readers on images?',
        options: [
          { id: 'a', text: 'title' },
          { id: 'b', text: 'alt' },
          { id: 'c', text: 'aria-image' },
          { id: 'd', text: 'src-desc' },
        ],
        correctAnswer: 'b',
        explanation: 'The `alt` attribute specifies alternative text for accessibility and screen readers.',
        difficulty: 'easy',
      },
    ],
  },

  // 4. Full Stack - TypeScript & React
  {
    id: 'assessment-fs-ts-react-core',
    nodeId: 'fs-ts-react-core',
    title: 'Full Stack TypeScript & React Assessment',
    description: 'Verify your knowledge of type-safe React components and hooks.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-fs-1',
        question: 'Which React hook should be used to memorize a computed value across re-renders?',
        options: [
          { id: 'a', text: 'useCallback' },
          { id: 'b', text: 'useMemo' },
          { id: 'c', text: 'useRef' },
          { id: 'd', text: 'useEffect' },
        ],
        correctAnswer: 'b',
        explanation: '`useMemo` returns a memoized value calculated by a compute function.',
        difficulty: 'easy',
      },
      {
        id: 'q-fs-2',
        question: 'What TypeScript utility type transforms all properties of a type T into optional ones?',
        options: [
          { id: 'a', text: 'Required<T>' },
          { id: 'b', text: 'Partial<T>' },
          { id: 'c', text: 'Record<T>' },
          { id: 'd', text: 'Omit<T>' },
        ],
        correctAnswer: 'b',
        explanation: '`Partial<T>` constructs a type with all properties of T set to optional.',
        difficulty: 'easy',
      },
    ],
  },

  // 5. Backend - Node.js
  {
    id: 'assessment-be-nodejs-go',
    nodeId: 'be-nodejs-go',
    title: 'Node.js & Backend Systems Assessment',
    description: 'Test your understanding of the Node.js event loop, async I/O, and HTTP servers.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-be-1',
        question: 'How does Node.js handle non-blocking asynchronous I/O operations?',
        options: [
          { id: 'a', text: 'Multi-threading on CPU cores' },
          { id: 'b', text: 'Libuv event loop and thread pool' },
          { id: 'c', text: 'Synchronous blocking calls' },
          { id: 'd', text: 'Separate processes for each connection' },
        ],
        correctAnswer: 'b',
        explanation: 'Node.js uses the Libuv event loop and worker thread pool for async non-blocking I/O.',
        difficulty: 'medium',
      },
    ],
  },

  // 6. Machine Learning - Python & NumPy
  {
    id: 'assessment-py-numpy-core',
    nodeId: 'py-numpy-core',
    title: 'Python for ML & NumPy Computing Assessment',
    description: 'Evaluate array vectorization, broadcasting, and Pandas data structures.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-ml-1',
        question: 'Why is vectorized array arithmetic in NumPy faster than standard Python loops?',
        options: [
          { id: 'a', text: 'It uses interpreted bytecode' },
          { id: 'b', text: 'Underlying contiguous C arrays and SIMD vector instructions' },
          { id: 'c', text: 'It avoids memory allocation entirely' },
          { id: 'd', text: 'It compiles to JavaScript' },
        ],
        correctAnswer: 'b',
        explanation: 'NumPy executes optimized compiled C loops using contiguous memory buffers and SIMD.',
        difficulty: 'easy',
      },
    ],
  },

  // 7. Cybersecurity - TCP & Networking
  {
    id: 'assessment-eh-tcp-protocols',
    nodeId: 'eh-tcp-protocols',
    title: 'Networking & Security Foundations Assessment',
    description: 'Test TCP three-way handshake, port scanning basics, and packet inspection.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-eh-1',
        question: 'What is the correct flag sequence in a standard TCP 3-way handshake?',
        options: [
          { id: 'a', text: 'SYN, SYN-ACK, ACK' },
          { id: 'b', text: 'ACK, SYN, FIN' },
          { id: 'c', text: 'SYN, ACK, RST' },
          { id: 'd', text: 'PING, PONG, ACK' },
        ],
        correctAnswer: 'a',
        explanation: 'Client sends SYN, server responds with SYN-ACK, client sends ACK.',
        difficulty: 'easy',
      },
    ],
  },

  // 8. Generative AI - Python API
  {
    id: 'assessment-genai-python-api',
    nodeId: 'genai-python-api',
    title: 'Generative AI & LLM APIs Assessment',
    description: 'Verify token streaming, structured JSON schemas, and async function calls.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-genai-1',
        question: 'What is the primary benefit of streaming token responses from an LLM endpoint?',
        options: [
          { id: 'a', text: 'Reduces total tokens consumed' },
          { id: 'b', text: 'Decreases Time-To-First-Token (TTFT) for user experience' },
          { id: 'c', text: 'Eliminates model hallucination' },
          { id: 'd', text: 'Guarantees 100% deterministic output' },
        ],
        correctAnswer: 'b',
        explanation: 'Streaming allows the user to see words immediately, reducing perceived latency.',
        difficulty: 'easy',
      },
    ],
  },

  // 9. Data Engineering - SQL
  {
    id: 'assessment-de-advanced-sql',
    nodeId: 'de-advanced-sql',
    title: 'Data Engineering & SQL Assessment',
    description: 'Test dimensional modeling, window functions, and partitioning.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-de-1',
        question: 'What is a Star Schema in dimensional data modeling?',
        options: [
          { id: 'a', text: 'A single flat table with no keys' },
          { id: 'b', text: 'A central Fact table surrounded by Dimension tables' },
          { id: 'c', text: 'A fully normalized 3NF database' },
          { id: 'd', text: 'A graph database topology' },
        ],
        correctAnswer: 'b',
        explanation: 'Star schemas feature numeric facts surrounded by descriptive dimension tables.',
        difficulty: 'easy',
      },
    ],
  },

  // 10. Cloud Computing - VPC
  {
    id: 'assessment-cloud-networking-vpc',
    nodeId: 'cloud-networking-vpc',
    title: 'Cloud Networking & VPC Architecture Assessment',
    description: 'Test subnets, Internet Gateways, NAT Gateways, and CIDR blocks.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-cloud-1',
        question: 'What allows EC2 instances in a private subnet to access the internet while blocking inbound traffic?',
        options: [
          { id: 'a', text: 'Internet Gateway (IGW)' },
          { id: 'b', text: 'NAT Gateway' },
          { id: 'c', text: 'Direct Connect' },
          { id: 'd', text: 'VPC Peering' },
        ],
        correctAnswer: 'b',
        explanation: 'A NAT Gateway translates outbound traffic for private subnets without exposing them to inbound connections.',
        difficulty: 'easy',
      },
    ],
  },

  // 11. DevOps - Linux
  {
    id: 'assessment-devops-linux-admin',
    nodeId: 'devops-linux-admin',
    title: 'DevOps & Linux Administration Assessment',
    description: 'Test process management, systemd, permissions, and shell utilities.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-devops-1',
        question: 'Which Linux command is used to inspect running systemd service status?',
        options: [
          { id: 'a', text: 'systemctl status <service>' },
          { id: 'b', text: 'service-check' },
          { id: 'c', text: 'ps aux --systemd' },
          { id: 'd', text: 'top -s' },
        ],
        correctAnswer: 'a',
        explanation: '`systemctl status <service>` displays service state, logs, and PID.',
        difficulty: 'easy',
      },
    ],
  },

  // 12. Database Administrator - Relational
  {
    id: 'assessment-dba-relational-internals',
    nodeId: 'dba-relational-internals',
    title: 'Relational Database Internals Assessment',
    description: 'Test WAL logs, ACID guarantees, and buffer pool caching.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-dba-1',
        question: 'What is the purpose of Write-Ahead Logging (WAL) in relational databases?',
        options: [
          { id: 'a', text: 'To compress queries' },
          { id: 'b', text: 'To guarantee durability and crash recovery before disk writes' },
          { id: 'c', text: 'To encrypt table columns' },
          { id: 'd', text: 'To index text fields' },
        ],
        correctAnswer: 'b',
        explanation: 'WAL ensures changes are written sequentially to a log first so crashed transactions can be restored.',
        difficulty: 'medium',
      },
    ],
  },

  // 13. Blockchain - Crypto
  {
    id: 'assessment-bc-crypto-basics',
    nodeId: 'bc-crypto-basics',
    title: 'Blockchain Cryptography & EVM Assessment',
    description: 'Test cryptographic hashing, Merkle trees, and gas computation.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-bc-1',
        question: 'Which cryptographic data structure enables efficient, secure verification of contents in large sets on blockchains?',
        options: [
          { id: 'a', text: 'B-Tree' },
          { id: 'b', text: 'Merkle Tree' },
          { id: 'c', text: 'Linked List' },
          { id: 'd', text: 'Red-Black Tree' },
        ],
        correctAnswer: 'b',
        explanation: 'Merkle Trees allow proving that a transaction exists in a block with a logarithmic cryptographic proof.',
        difficulty: 'easy',
      },
    ],
  },

  // 14. Embedded - C Pointers
  {
    id: 'assessment-emb-c-pointers',
    nodeId: 'emb-c-pointers',
    title: 'Embedded C & Memory Registers Assessment',
    description: 'Test pointer dereferencing, bit manipulation, and the volatile keyword.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-emb-1',
        question: 'Why is the `volatile` keyword essential when declaring memory-mapped hardware register pointers in C?',
        options: [
          { id: 'a', text: 'It makes the variable thread-safe' },
          { id: 'b', text: 'It prevents the compiler from optimizing away repeated reads/writes' },
          { id: 'c', text: 'It allocates RAM memory' },
          { id: 'd', text: 'It prevents buffer overflows' },
        ],
        correctAnswer: 'b',
        explanation: '`volatile` instructs the compiler that the value can change outside program control, preventing optimizations.',
        difficulty: 'medium',
      },
    ],
  },

  // 15. Networks - OSI Model
  {
    id: 'assessment-net-osi-tcp-model',
    nodeId: 'net-osi-tcp-model',
    title: 'OSI Model & Network Protocols Assessment',
    description: 'Test OSI layers, encapsulation, and packet headers.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-net-1',
        question: 'At which layer of the OSI model does an IP router operate?',
        options: [
          { id: 'a', text: 'Layer 2 (Data Link)' },
          { id: 'b', text: 'Layer 3 (Network)' },
          { id: 'c', text: 'Layer 4 (Transport)' },
          { id: 'd', text: 'Layer 7 (Application)' },
        ],
        correctAnswer: 'b',
        explanation: 'IP routers operate at Layer 3 (Network Layer) inspecting IP addresses to route packets.',
        difficulty: 'easy',
      },
    ],
  },

  // 16. QA - Testing Theory
  {
    id: 'assessment-qa-testing-fundamentals',
    nodeId: 'qa-testing-fundamentals',
    title: 'Software Testing Fundamentals Assessment',
    description: 'Test test pyramid proportions, regression suites, and bug lifecycles.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-qa-1',
        question: 'According to the Test Pyramid, which layer should contain the largest quantity of tests?',
        options: [
          { id: 'a', text: 'Manual UI Tests' },
          { id: 'b', text: 'End-to-End Tests' },
          { id: 'c', text: 'Unit Tests' },
          { id: 'd', text: 'Performance Tests' },
        ],
        correctAnswer: 'c',
        explanation: 'Unit tests form the base of the pyramid because they are fast, isolated, and cheap to run.',
        difficulty: 'easy',
      },
    ],
  },

  // 17. Business Analyst - Excel & SQL
  {
    id: 'assessment-ba-excel-advanced',
    nodeId: 'ba-excel-advanced',
    title: 'Business Analysis & Data Modeling Assessment',
    description: 'Test Excel formulas, business metrics (CAC/LTV), and SQL aggregations.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-ba-1',
        question: 'What does Customer Acquisition Cost (CAC) represent?',
        options: [
          { id: 'a', text: 'Total revenue divided by customer count' },
          { id: 'b', text: 'Total marketing and sales expense divided by new customers acquired' },
          { id: 'c', text: 'Gross margin per user' },
          { id: 'd', text: 'Average monthly subscription cost' },
        ],
        correctAnswer: 'b',
        explanation: 'CAC measures the total sales and marketing spend needed to gain one paying customer.',
        difficulty: 'easy',
      },
    ],
  },

  // 18. Security Analyst - Network Telemetry
  {
    id: 'assessment-soc-networking-basics',
    nodeId: 'soc-networking-basics',
    title: 'Security Operations & Telemetry Assessment',
    description: 'Test SIEM event correlation, packet capture filters, and incident triage.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-soc-1',
        question: 'Which Wireshark display filter isolates all HTTP POST requests?',
        options: [
          { id: 'a', text: 'http.request.method == "POST"' },
          { id: 'b', text: 'tcp.port == 80 and post' },
          { id: 'c', text: 'ip.proto == http' },
          { id: 'd', text: 'filter:post' },
        ],
        correctAnswer: 'a',
        explanation: '`http.request.method == "POST"` filters HTTP protocol packets with the POST method.',
        difficulty: 'easy',
      },
    ],
  },

  // 19. Product Designer - Visual Principles
  {
    id: 'assessment-pd-visual-principles',
    nodeId: 'pd-visual-principles',
    title: 'UI/UX Visual Design & Heuristics Assessment',
    description: 'Test spatial grids, typography hierarchy, contrast ratios, and Jakob\'s law.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-pd-1',
        question: 'What does Jakob\'s Law of Internet User Experience state?',
        options: [
          { id: 'a', text: 'Users prefer interfaces that are completely novel' },
          { id: 'b', text: 'Users spend most of their time on other sites, so they prefer your site to work similarly' },
          { id: 'c', text: 'Users always read all body text' },
          { id: 'd', text: 'Dark mode increases conversion by 50%' },
        ],
        correctAnswer: 'b',
        explanation: 'Jakob\'s Law states users expect familiar design patterns from their everyday web usage.',
        difficulty: 'easy',
      },
    ],
  },

  // 20. Unity - C# & Game Math
  {
    id: 'assessment-unity-csharp-core',
    nodeId: 'unity-csharp-core',
    title: 'Unity Engine & C# Game Development Assessment',
    description: 'Test game loop lifecycles, vector mathematics, and rigidbodies.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-unity-1',
        question: 'In Unity, which MonoBehaviour method is called every fixed framerate-rate frame and should be used for physics updates?',
        options: [
          { id: 'a', text: 'Update()' },
          { id: 'b', text: 'FixedUpdate()' },
          { id: 'c', text: 'LateUpdate()' },
          { id: 'd', text: 'OnGUI()' },
        ],
        correctAnswer: 'b',
        explanation: '`FixedUpdate()` is synchronized with the Unity physics calculation engine timer.',
        difficulty: 'easy',
      },
    ],
  },

  // 21. Flutter - Dart Core
  {
    id: 'assessment-dart-core',
    nodeId: 'dart-core',
    title: 'Dart & Flutter Widget Architecture Assessment',
    description: 'Test Dart null safety, Widget trees, and state management.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-dart-1',
        question: 'What is the primary difference between a StatelessWidget and a StatefulWidget in Flutter?',
        options: [
          { id: 'a', text: 'StatelessWidget can rebuild when internal state changes' },
          { id: 'b', text: 'StatefulWidget maintains mutable state across widget rebuilds' },
          { id: 'c', text: 'StatelessWidget cannot have child widgets' },
          { id: 'd', text: 'StatefulWidget only runs on Android' },
        ],
        correctAnswer: 'b',
        explanation: 'StatefulWidgets have an associated `State` object that stores mutable values.',
        difficulty: 'easy',
      },
    ],
  },

  // 22. React Native - TS & Hooks
  {
    id: 'assessment-rn-ts-core',
    nodeId: 'rn-ts-core',
    title: 'React Native & Mobile Architecture Assessment',
    description: 'Test React Native core components, Expo, and bridge architecture.',
    timeLimit: 900,
    passingScore: 70,
    questions: [
      {
        id: 'q-rn-1',
        question: 'Which component should be used in React Native to efficiently render long lists of items with view recycling?',
        options: [
          { id: 'a', text: '<ScrollView>' },
          { id: 'b', text: '<FlatList>' },
          { id: 'c', text: '<View>' },
          { id: 'd', text: '<Column>' },
        ],
        correctAnswer: 'b',
        explanation: '`<FlatList>` recycles views and only renders visible elements for high performance.',
        difficulty: 'easy',
      },
    ],
  },
];
