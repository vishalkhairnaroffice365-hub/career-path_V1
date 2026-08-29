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
    results.push({ name, passed: false, durationMs: Date.now() - start, error: errorMsg, details: err.response?.data });
    console.error(`  ❌ FAIL: ${name} (${Date.now() - start}ms) -> ${errorMsg}`);
  }
}

async function main() {
  console.log(`\n🧪 Starting Automated Backend API Test Suite against ${BASE_URL}...\n`);

  let authToken = '';
  const testEmail = `qa_test_${Date.now()}@example.com`;
  const testPassword = 'TestPassword123!';

  // 1. Health Check
  await runTest('1. Health Check (GET /health)', async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (!res.data.success || res.data.data.database !== 'connected') {
      throw new Error('Health check returned unhealthy status');
    }
  });

  // 2. User Registration
  await runTest('2. User Registration (POST /auth/register)', async () => {
    const res = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'QA Test Runner',
      email: testEmail,
      password: testPassword,
    });
    if (!res.data.data.token) throw new Error('No JWT token returned from registration');
    authToken = res.data.data.token;
  });

  // 3. User Login
  await runTest('3. User Login (POST /auth/login)', async () => {
    const res = await axios.post(`${BASE_URL}/auth/login`, {
      email: testEmail,
      password: testPassword,
    });
    if (!res.data.data.token) throw new Error('Login failed to return token');
  });

  const authHeaders = () => ({ headers: { Authorization: `Bearer ${authToken}` } });

  // 4. Authenticated Profile
  await runTest('4. Authenticated Profile (GET /auth/me)', async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, authHeaders());
    if (res.data.data.email !== testEmail) throw new Error('Profile email mismatch');
  });

  // 5. Onboarding Preferences Save
  await runTest('5. Save Onboarding Preferences (POST /users/onboarding)', async () => {
    const res = await axios.post(
      `${BASE_URL}/users/onboarding`,
      {
        interests: ['building-apps', 'ai-robotics'],
        experienceLevel: 'intermediate',
        preferredEnvironment: 'remote-first',
        currentSkills: ['kotlin', 'javascript'],
      },
      authHeaders()
    );
    if (!res.data.success) throw new Error('Failed to save onboarding');
  });

  // 6. Complete Onboarding
  await runTest('6. Complete Onboarding (POST /users/onboarding/complete)', async () => {
    const res = await axios.post(`${BASE_URL}/users/onboarding/complete`, {}, authHeaders());
    if (!res.data.data.onboardingCompleted) throw new Error('Onboarding status not updated');
  });

  // 7. Get Domains Catalog
  await runTest('7. Get 3D Domains Catalog (GET /domains)', async () => {
    const res = await axios.get(`${BASE_URL}/domains`);
    if (!Array.isArray(res.data.data) || res.data.data.length < 8) {
      throw new Error(`Expected at least 8 domains, got ${res.data.data?.length}`);
    }
  });

  // 8. Get Careers Catalog with Match Scores
  await runTest('8. Get Careers with Match Scores (GET /careers)', async () => {
    const res = await axios.get(`${BASE_URL}/careers`, authHeaders());
    if (!Array.isArray(res.data.data) || res.data.data.length < 11) {
      throw new Error(`Expected 11 careers, got ${res.data.data?.length}`);
    }
    const android = res.data.data.find((c: any) => c.id === 'android-developer');
    if (!android || typeof android.matchScore !== 'number') {
      throw new Error('Personalized match score missing on career');
    }
  });

  // 9. Career Selection
  await runTest('9. Select Active Career Path (POST /careers/select)', async () => {
    const res = await axios.post(`${BASE_URL}/careers/select`, { careerId: 'android-developer' }, authHeaders());
    if (res.data.data.user.selectedCareerId !== 'android-developer') {
      throw new Error('Failed to select career');
    }
  });

  // 10. Multi-Career Comparison
  await runTest('10. Career Comparison (POST /careers/compare)', async () => {
    const res = await axios.post(`${BASE_URL}/careers/compare`, { careerId: 'ios-developer' }, authHeaders());
    if (!Array.isArray(res.data.data) || !res.data.data.find((c: any) => c.id === 'ios-developer')) {
      throw new Error('Failed to add career to comparison');
    }
  });

  // 11. Skill Gap Analysis
  await runTest('11. Skill Gap Analysis (GET /skills/gap/:careerId)', async () => {
    const res = await axios.get(`${BASE_URL}/skills/gap/android-developer`, authHeaders());
    if (!res.data.data.counts || typeof res.data.data.overallReadiness !== 'number') {
      throw new Error('Skill gap analysis response invalid');
    }
  });

  // 12. Roadmap Node Completion & Streak Tracking
  await runTest('12. Complete Roadmap Node (POST /roadmaps/nodes/:nodeId/complete)', async () => {
    const res = await axios.post(`${BASE_URL}/roadmaps/nodes/android-ui/complete`, {}, authHeaders());
    if (!res.data.data.user.progress.completedNodeIds.includes('android-ui')) {
      throw new Error('Node completion was not recorded');
    }
    if (res.data.data.user.progress.streak < 1) {
      throw new Error('Streak counter failed to increment');
    }
  });

  // 13. Update Project Status
  await runTest('13. Update Project Status (POST /projects/:projectId/status)', async () => {
    const res = await axios.post(
      `${BASE_URL}/projects/weather-app/status`,
      { status: 'completed' },
      authHeaders()
    );
    if (!res.data.data.user.progress.completedProjectIds.includes('weather-app')) {
      throw new Error('Project completion not recorded in user progress');
    }
  });

  // 14. Complete Resource
  await runTest('14. Complete Learning Resource (POST /resources/:resourceId/complete)', async () => {
    const res = await axios.post(`${BASE_URL}/resources/android-dev-course/complete`, {}, authHeaders());
    if (!res.data.data.user.progress.completedResourceIds.includes('android-dev-course')) {
      throw new Error('Resource completion not recorded');
    }
  });

  // 15. Achievements Unlocking
  await runTest('15. Achievements Tracking (GET /achievements)', async () => {
    const res = await axios.get(`${BASE_URL}/achievements`, authHeaders());
    const earned = res.data.data.filter((a: any) => a.isEarned);
    if (earned.length === 0) {
      throw new Error('Expected at least one achievement to be unlocked from test actions');
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
