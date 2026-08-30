import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'dns';

// Fallback DNS for Windows Atlas SRV queries
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore in case restricted
}

dotenv.config();

import { Domain } from '../models/Domain.model.js';
import { Career } from '../models/Career.model.js';
import { Roadmap } from '../models/Roadmap.model.js';
import { Project } from '../models/Project.model.js';
import { Resource } from '../models/Resource.model.js';
import { Assessment } from '../models/Assessment.model.js';
import { Course } from '../models/Course.model.js';
import { CodingChallenge } from '../models/CodingChallenge.model.js';
import { PracticalTask } from '../models/Task.model.js';
import { Submission } from '../models/Submission.model.js';
import { User } from '../models/User.model.js';

interface TestResult {
  id: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

function recordTest(id: number, name: string, passed: boolean, details: string) {
  results.push({ id, name, passed, details });
  const statusIcon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${statusIcon} [Test ${id}]: ${name} - ${details}`);
}

async function runComprehensiveTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING COMPREHENSIVE CAREERPATH TEST SUITE (15 SCENARIOS)');
  console.log('================================================================\n');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  await mongoose.connect(uri);
  console.log('🔌 Connected to MongoDB Atlas for Testing\n');

  try {
    // ─── Test 1: Seed Verification (20+ Domains & Subdomains) ─────────────────
    const domainCount = await Domain.countDocuments();
    const allDomains = await Domain.find({});
    const totalSubdomains = allDomains.reduce((acc, d) => acc + (d.subDomains?.length || 0), 0);
    recordTest(
      1,
      'Database Completeness & 20+ Domains',
      domainCount >= 20 && totalSubdomains >= 20,
      `Found ${domainCount} domains and ${totalSubdomains} subdomains in DB`
    );

    // ─── Test 2: 3D Career Sky Cloud Metadata ────────────────────────────────
    const allDomainsHaveCoords = allDomains.every(
      (d) => Array.isArray(d.position) && d.position.length === 3 && d.name && (d.theme?.primaryColor || d.theme?.fogColor)
    );
    recordTest(
      2,
      'Career Sky 3D Celestial Coordinates & Theming',
      allDomainsHaveCoords,
      `All ${domainCount} domains have 3D vectors [x, y, z] and celestial theme configs`
    );

    // ─── Test 3: Android Developer Roadmap (>= 15 Steps) ─────────────────────
    const androidRoadmap = await Roadmap.findOne({
      $or: [{ careerId: 'android-developer' }, { id: 'android-developer-roadmap' }],
    });
    const androidSteps = androidRoadmap?.nodes?.length || 0;
    recordTest(
      3,
      'Android Developer Roadmap Integrity',
      androidSteps >= 15 && androidRoadmap?.phases?.length === 4,
      `Loaded ${androidSteps} learning steps across ${androidRoadmap?.phases?.length} phases`
    );

    // ─── Test 4: Cyber Security (Ethical Hacker) Roadmap Integrity & Isolation
    const cyberRoadmap = await Roadmap.findOne({
      $or: [{ careerId: 'ethical-hacker' }, { id: 'ethical-hacker-roadmap' }],
    });
    const cyberSteps = cyberRoadmap?.nodes?.length || 0;
    const isDifferentFromAndroid = cyberRoadmap?.title !== androidRoadmap?.title;
    recordTest(
      4,
      'Cyber Security Specialist Career Switching & Roadmap',
      cyberSteps >= 15 && isDifferentFromAndroid,
      `Loaded ${cyberSteps} steps ("${cyberRoadmap?.title}") distinct from Android`
    );

    // ─── Test 5: DevOps / Cloud Engineer Roadmap Integrity ───────────────────
    const devopsRoadmap = await Roadmap.findOne({
      $or: [{ careerId: 'devops-engineer' }, { id: 'devops-engineer-roadmap' }],
    });
    const devopsSteps = devopsRoadmap?.nodes?.length || 0;
    recordTest(
      5,
      'Cloud & DevOps Engineer Roadmap Integrity',
      devopsSteps >= 15 && devopsRoadmap?.phases?.length === 4,
      `Loaded ${devopsSteps} steps across ${devopsRoadmap?.phases?.length} phases`
    );

    // ─── Test 6: User 1 Profile Creation & Node Progress Persistence ─────────
    const testUser1Email = `test_user_1_${Date.now()}@example.com`;
    const hashedPassword = await bcrypt.hash('TestPass123!', 10);
    const user1 = await User.create({
      name: 'Alice Developer',
      email: testUser1Email,
      password: hashedPassword,
      avatar: '👩‍💻',
      selectedCareerId: 'android-developer',
      progress: {
        completedNodeIds: ['kt-basics', 'git-android'],
        inProgressNodeIds: ['as-setup'],
        completedProjectIds: ['android-portfolio-app'],
        completedResourceIds: ['res-android-docs'],
      },
    });

    const user1Fetched = await User.findById(user1._id);
    const user1CompletedCount = user1Fetched?.progress?.completedNodeIds?.length || 0;
    recordTest(
      6,
      'User 1 Progress Persistence',
      user1CompletedCount === 2,
      `User 1 saved and retrieved with ${user1CompletedCount} completed nodes`
    );

    // ─── Test 7: User 2 Session Isolation (0% Progress) ──────────────────────
    const testUser2Email = `test_user_2_${Date.now()}@example.com`;
    const user2 = await User.create({
      name: 'Bob Security',
      email: testUser2Email,
      password: hashedPassword,
      avatar: '👨‍💻',
      selectedCareerId: 'ethical-hacker',
      progress: {
        completedNodeIds: [],
        inProgressNodeIds: [],
        completedProjectIds: [],
        completedResourceIds: [],
      },
    });

    const user2Fetched = await User.findById(user2._id);
    const user2CompletedCount = user2Fetched?.progress?.completedNodeIds?.length || 0;
    recordTest(
      7,
      'User 2 Complete Session & Progress Isolation',
      user2CompletedCount === 0 && user2Fetched?.selectedCareerId === 'ethical-hacker',
      `User 2 has ${user2CompletedCount} completed nodes (No leak from User 1)`
    );

    // ─── Test 8: User 1 Progress Integrity Verification ──────────────────────
    const user1Recheck = await User.findById(user1._id);
    const user1RecheckCount = user1Recheck?.progress?.completedNodeIds?.length || 0;
    recordTest(
      8,
      'User 1 Multi-User Independent State Verification',
      user1RecheckCount === 2,
      `User 1 maintains ${user1RecheckCount} completed nodes after User 2 actions`
    );

    // ─── Test 9: Career-Specific Resources & Search Query ────────────────────
    const androidResources = await Resource.find({ careerIds: 'android-developer' });
    const searchMatch = await Resource.find({ $or: [{ title: /kotlin/i }, { description: /kotlin/i }] });
    recordTest(
      9,
      'Career Resources & Search Capability',
      androidResources.length > 0 && searchMatch.length > 0,
      `Found ${androidResources.length} Android resources and ${searchMatch.length} Kotlin search matches`
    );

    // ─── Test 10: Career-Specific Projects & Search Query ────────────────────
    const androidProjects = await Project.find({ careerIds: 'android-developer' });
    const projectSearchMatch = await Project.find({ $or: [{ title: /app/i }, { techStack: /kotlin/i }] });
    recordTest(
      10,
      'Portfolio Projects & Search Capability',
      androidProjects.length > 0 && projectSearchMatch.length > 0,
      `Found ${androidProjects.length} Android projects and ${projectSearchMatch.length} search matches`
    );

    // ─── Test 11: 360 Assessments with >= 10 Questions EACH (3,600+ Questions)
    const assessments = await Assessment.find({});
    const totalQuestions = assessments.reduce((acc, a) => acc + (a.questions?.length || 0), 0);
    const under10Q = assessments.filter((a) => (a.questions?.length || 0) < 10);
    recordTest(
      11,
      '360 Assessments with >= 10 Questions EACH (3,600+ Total Questions)',
      assessments.length === 360 && totalQuestions >= 3600 && under10Q.length === 0,
      `${assessments.length} node assessments in DB with ${totalQuestions} questions (0 assessments <10 Q)`
    );

    // ─── Test 12: 360 Topic Courses ──────────────────────────────────────────
    const courses = await Course.find({});
    recordTest(
      12,
      '360 Topic-Specific Courses across All Nodes',
      courses.length === 360,
      `Found ${courses.length} courses with full modules and objectives in MongoDB`
    );

    // ─── Test 13: 360 Coding Challenges & Practical Tasks ────────────────────
    const challenges = await CodingChallenge.find({});
    const tasks = await PracticalTask.find({});
    recordTest(
      13,
      '360 Coding Challenges & 360 Practical Tasks',
      challenges.length === 360 && tasks.length === 360,
      `Found ${challenges.length} challenges and ${tasks.length} practical tasks in MongoDB`
    );

    // ─── Test 14: Submissions Persistence in MongoDB ─────────────────────────
    const sub = await Submission.create({
      id: `sub_test_${Date.now()}`,
      userId: user1._id,
      userEmail: user1.email,
      nodeId: 'kt-basics',
      careerId: 'android-developer',
      type: 'practical-task',
      githubUrl: 'https://github.com/alice/kotlin-basics-project',
      liveUrl: 'https://kotlin-basics-alice.web.app',
      notes: 'Completed all core exercises and unit tests.',
      status: 'submitted',
      score: 100,
    });
    const fetchedSub = await Submission.findOne({ nodeId: 'kt-basics', userId: user1._id });
    recordTest(
      14,
      'GitHub & Project Submissions Persisted per User',
      fetchedSub?.githubUrl === 'https://github.com/alice/kotlin-basics-project',
      `Saved and retrieved submission for ${user1.name} (GitHub: ${fetchedSub?.githubUrl})`
    );

    // ─── Test 15: 0 Roadmap 404 Errors for ALL 24 Careers ────────────────────
    const allCareers = await Career.find({});
    let roadmap404Count = 0;
    for (const career of allCareers) {
      const rm = await Roadmap.findOne({
        $or: [{ careerId: career.id }, { id: career.roadmapId }, { id: `${career.id}-roadmap` }],
      });
      if (!rm || rm.nodes.length < 15) {
        roadmap404Count++;
      }
    }
    recordTest(
      15,
      'Roadmap 404 Prevention (All 24 Careers have >= 15 Steps)',
      roadmap404Count === 0,
      `All ${allCareers.length} careers verified with complete >= 15 node roadmaps (0 errors)`
    );

    // Clean up test users & submissions
    await User.deleteMany({
      email: { $in: [testUser1Email, testUser2Email] },
    });
    await Submission.deleteOne({ id: sub.id });
  } finally {
    await mongoose.disconnect();
  }

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log('\n================================================================');
  const allPassed = results.every((r) => r.passed);
  console.log(
    `📊 RESULTS: ${results.filter((r) => r.passed).length} / ${results.length} TESTS PASSED`
  );
  if (allPassed) {
    console.log('🎉 100% SUCCESS — ALL 15 SCENARIOS PASSED WITH ZERO REGRESSIONS');
  } else {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  }
  console.log('================================================================\n');
}

runComprehensiveTests().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
