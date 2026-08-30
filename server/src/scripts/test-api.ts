import dns from 'node:dns';
import axios from 'axios';
import { env } from '../config/env.js';

// Ensure public DNS resolver
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

const BASE_URL = `http://localhost:${env.PORT}/api/v1`;

interface TestResult {
  name: string;
  passed: boolean;
  durationMs: number;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

async function runTest(name: string, fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    results.push({ name, passed: true, durationMs: Date.now() - start });
    console.log(`  ✅ PASS: ${name} (${Date.now() - start}ms)`);
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || err.message;
    results.push({
      name,
      passed: false,
      durationMs: Date.now() - start,
      error: errorMsg,
      details: err.response?.data,
    });
    console.error(`  ❌ FAIL: ${name} (${Date.now() - start}ms) -> ${errorMsg}`);
  }
}

async function main() {
  console.log(`\n🧪 Starting Comprehensive Full-Stack API Test Suite against ${BASE_URL}...\n`);

  let authToken1 = '';
  const testEmail1 = `qa_user1_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  // 1. Health Check
  await runTest('1. Health Check (GET /health)', async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (!res.data.success || res.data.data.database !== 'connected') {
      throw new Error('Health check returned unhealthy status');
    }
  });

  // 2. User 1 Registration & Token
  await runTest('2. User 1 Registration (POST /auth/register)', async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'QA Test User 1',
      email: testEmail1,
      password: testPassword,
    });
    if (!res.data.data.token) throw new Error('No JWT token returned from registration');
    authToken1 = res.data.data.token;
  });

  const authHeaders1 = () => ({ headers: { Authorization: `Bearer ${authToken1}` } });

  // 3. User 1 Profile
  await runTest('3. User 1 Profile (GET /auth/me)', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, authHeaders1());
    if (res.data.data.email !== testEmail1) throw new Error('Profile email mismatch');
  });

  // 4. Save Onboarding for User 1
  await runTest('4. Save Onboarding Preferences (POST /users/onboarding)', async () => {
    const res = await axios.post(
      `${BASE_URL}/users/onboarding`,
      {
        interests: ['building-apps', 'ai-robotics'],
        experienceLevel: 'intermediate',
        preferredEnvironment: 'remote-first',
        currentSkills: ['kotlin', 'javascript'],
      },
      authHeaders1()
    );
    if (!res.data.success) throw new Error('Failed to save onboarding');
  });

  // 5. Complete Onboarding
  await runTest('5. Complete Onboarding (POST /users/onboarding/complete)', async () => {
    const res = await axios.post(`${BASE_URL}/users/onboarding/complete`, {}, authHeaders1());
    if (!res.data.data.onboardingCompleted) throw new Error('Onboarding status not updated');
  });

  // 6. Get 3D Domains Catalog
  await runTest('6. Get 3D Domains Catalog (GET /domains)', async () => {
    const res = await axios.get(`${BASE_URL}/domains`);
    if (!Array.isArray(res.data.data) || res.data.data.length < 8) {
      throw new Error(`Expected at least 8 domains, got ${res.data.data?.length}`);
    }
  });

  // 7. Explainable AI Recommendations
  await runTest('7. AI Career Recommendations (GET /recommendations)', async () => {
    const res = await axios.get(`${BASE_URL}/recommendations`, authHeaders1());
    if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
      throw new Error('Recommendations array is empty');
    }
    const top = res.data.data[0];
    if (!top.factors || !top.matchReasons || top.matchReasons.length === 0) {
      throw new Error('Explainable recommendation factors missing');
    }
  });

  // 8. AI Fit Explanation for Specific Career
  await runTest('8. AI Fit Explanation (GET /recommendations/explain/:careerId)', async () => {
    const res = await axios.get(
      `${BASE_URL}/recommendations/explain/android-developer`,
      authHeaders1()
    );
    if (res.data.data.careerId !== 'android-developer' || !res.data.data.factors) {
      throw new Error('AI fit explanation failed');
    }
  });

  // 9. All 11 Careers have >= 15 Node Roadmaps (Zero 404s)
  const careerIds = [
    'android-developer',
    'ios-developer',
    'flutter-developer',
    'react-native-developer',
    'ml-engineer',
    'data-scientist',
    'frontend-developer',
    'fullstack-developer',
    'product-designer',
    'unity-developer',
    'ethical-hacker',
  ];

  for (const cid of careerIds) {
    await runTest(`9. Roadmap for "${cid}" (GET /roadmaps/${cid})`, async () => {
      const res = await axios.get(`${BASE_URL}/roadmaps/${cid}`, authHeaders1());
      if (!res.data.success || !res.data.data || !Array.isArray(res.data.data.nodes)) {
        throw new Error(`Invalid roadmap structure for ${cid}`);
      }
      if (res.data.data.nodes.length < 15) {
        throw new Error(`Roadmap for ${cid} has ${res.data.data.nodes.length} nodes, expected >= 15`);
      }
    });
  }

  // 10. User 1 Selects Initial Career (Android Developer)
  await runTest('10. User 1 Selects Android Developer (POST /careers/select)', async () => {
    const res = await axios.post(
      `${BASE_URL}/careers/select`,
      { careerId: 'android-developer' },
      authHeaders1()
    );
    if (res.data.data.user.selectedCareerId !== 'android-developer') {
      throw new Error('Failed to select career');
    }
  });

  // 11. User 1 Completes a Node on Android Roadmap
  await runTest('11. User 1 Completes Node on Android (POST /roadmaps/nodes/:nodeId/complete)', async () => {
    const res = await axios.post(`${BASE_URL}/roadmaps/nodes/kotlin-basics/complete`, {}, authHeaders1());
    if (!res.data.data.user.progress.completedNodeIds.includes('kotlin-basics')) {
      throw new Error('Node completion was not recorded');
    }
  });

  // 12. User 1 Switches Career to Cyber Security (Ethical Hacker)
  await runTest('12. User 1 Switches to Ethical Hacker (POST /careers/select)', async () => {
    const res = await axios.post(
      `${BASE_URL}/careers/select`,
      { careerId: 'ethical-hacker' },
      authHeaders1()
    );
    if (res.data.data.user.selectedCareerId !== 'ethical-hacker') {
      throw new Error('Career switch to ethical-hacker failed');
    }

    // Verify current user roadmap now serves Ethical Hacker
    const roadmapRes = await axios.get(`${BASE_URL}/roadmaps/current`, authHeaders1());
    if (roadmapRes.data.data.careerId !== 'ethical-hacker') {
      throw new Error(`Expected current roadmap to be ethical-hacker, got ${roadmapRes.data.data.careerId}`);
    }
  });

  // 13. Multi-User Isolation: Register User 2
  let authToken2 = '';
  const testEmail2 = `qa_user2_${Date.now()}@example.com`;

  await runTest('13. Multi-User Isolation: User 2 Registration', async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'QA Test User 2',
      email: testEmail2,
      password: testPassword,
    });
    authToken2 = res.data.data.token;
  });

  const authHeaders2 = () => ({ headers: { Authorization: `Bearer ${authToken2}` } });

  // 14. Verify User 2 has fresh progress and no leakage from User 1
  await runTest('14. Multi-User Isolation: User 2 Data Freshness', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, authHeaders2());
    if (res.data.data.email !== testEmail2) throw new Error('User 2 email mismatch');
    if (res.data.data.selectedCareerId) {
      throw new Error('User 2 should have no initial selected career');
    }
    if (res.data.data.progress.completedNodeIds.length > 0) {
      throw new Error('User 2 should have 0 completed nodes');
    }
  });

  // 15. User 2 selects ML Engineer independently
  await runTest('15. Multi-User Isolation: User 2 Selects ML Engineer', async () => {
    const res = await axios.post(
      `${BASE_URL}/careers/select`,
      { careerId: 'ml-engineer' },
      authHeaders2()
    );
    if (res.data.data.user.selectedCareerId !== 'ml-engineer') {
      throw new Error('User 2 failed to select ML Engineer');
    }

    // Check User 1 is still Ethical Hacker
    const u1Res = await axios.get(`${BASE_URL}/auth/me`, authHeaders1());
    if (u1Res.data.data.selectedCareerId !== 'ethical-hacker') {
      throw new Error('User 1 selected career was affected by User 2 action');
    }
  });

  // 16. Edit Profile Verification
  await runTest('16. Edit Profile (PUT /users/me)', async () => {
    const res = await axios.put(
      `${BASE_URL}/users/me`,
      { name: 'Updated QA Master', avatar: '🚀' },
      authHeaders1()
    );
    if (res.data.data.name !== 'Updated QA Master' || res.data.data.avatar !== '🚀') {
      throw new Error('Profile update failed to save');
    }
  });

  // 17. Course Lesson Progress
  await runTest('17. Course Lesson Progress (POST /courses/:nodeId/lessons/:lessonId/toggle)', async () => {
    const res = await axios.post(
      `${BASE_URL}/courses/kotlin-basics/lessons/l-kt-1/toggle`,
      { completed: true },
      authHeaders1()
    );
    if (!res.data.data.courseProgress?.lessonsCompleted?.includes('l-kt-1')) {
      throw new Error('Lesson progress was not updated');
    }
  });

  // 18. MCQ Assessment Grading
  await runTest('18. MCQ Assessment Grading (POST /assessments/:nodeId/submit)', async () => {
    const res = await axios.post(
      `${BASE_URL}/assessments/kotlin-basics/submit`,
      {
        answers: {
          'q-kt-1': 'b',
          'q-kt-2': 'b',
          'q-kt-3': 'd',
          'q-kt-4': 'c',
          'q-kt-5': 'a',
          'q-kt-6': 'b',
          'q-kt-7': 'c',
          'q-kt-8': 'b',
          'q-kt-9': 'b',
          'q-kt-10': 'b',
        },
      },
      authHeaders1()
    );
    if (!res.data.data.passed || res.data.data.score !== 100) {
      throw new Error(`Expected passed with score 100%, got score ${res.data.data.score}`);
    }
  });

  // 19. Coding Challenge Solution
  await runTest('19. Coding Challenge Solution (POST /challenges/:nodeId/submit)', async () => {
    const solutionCode = `@Composable
fun CounterApp() {
    var count by remember { mutableStateOf(0) }
    Column(modifier = Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally) {
        Text(text = "Count: $count")
        Button(onClick = { count++ }) { Text("Increment") }
        Button(onClick = { if (count > 0) count-- }) { Text("Decrement") }
    }
}`;
    const res = await axios.post(
      `${BASE_URL}/challenges/android-ui/submit`,
      { code: solutionCode },
      authHeaders1()
    );
    if (!res.data.data.passed || typeof res.data.data.score !== 'number') {
      throw new Error('Coding challenge submission failed');
    }
  });

  // 20. Practical Task Submission
  await runTest('20. Practical Task Submission (POST /tasks/:nodeId/submit)', async () => {
    await axios.post(`${BASE_URL}/tasks/capstone-project/start`, {}, authHeaders1());
    const res = await axios.post(
      `${BASE_URL}/tasks/capstone-project/submit`,
      {
        githubUrl: 'https://github.com/test-user/android-capstone',
        liveUrl: 'https://play.google.com/store/apps/details?id=com.test.capstone',
      },
      authHeaders1()
    );
    if (res.data.data.submission?.status !== 'submitted') {
      throw new Error('Practical task submission status mismatch');
    }
  });

  // 21. WOW Panel Tech News
  await runTest('21. WOW Panel Tech News (GET /news)', async () => {
    const res = await axios.get(`${BASE_URL}/news?careerId=android-developer`, authHeaders1());
    if (!Array.isArray(res.data.data) || res.data.data.length === 0) {
      throw new Error('Expected tech news articles');
    }
  });

  // 22. Achievements Unlocked
  await runTest('22. Achievements Unlocked (GET /achievements)', async () => {
    const res = await axios.get(`${BASE_URL}/achievements`, authHeaders1());
    const earned = res.data.data.filter((a: any) => a.isEarned);
    if (earned.length === 0) {
      throw new Error('Expected achievements to be unlocked');
    }
  });

  // Summary
  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;
  console.log(`\n======================================================`);
  console.log(`📊 Test Results: ${passedCount} Passed, ${failedCount} Failed (${results.length} Total)`);
  console.log(`======================================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
