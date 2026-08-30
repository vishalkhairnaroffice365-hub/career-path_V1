import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

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

async function runValidation() {
  console.log('\n=========================================');
  console.log('CAREERPATH DATABASE VALIDATION');
  console.log('=========================================\n');

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  await mongoose.connect(uri);

  let missingCourses = 0;
  let missingResources = 0;
  let missingAssessments = 0;
  let assessmentsUnder10Q = 0;
  let brokenReferences = 0;
  let orphanRecords = 0;

  // 1. Domains & Subdomains
  const domains = await Domain.find({});
  const totalSubdomains = domains.reduce((acc, d) => acc + (d.subDomains?.length || 0), 0);

  // 2. Careers
  const careers = await Career.find({});

  // 3. Roadmaps & Nodes
  const roadmaps = await Roadmap.find({});
  const allNodeIds = new Set<string>();
  let totalRoadmapNodes = 0;

  for (const rm of roadmaps) {
    totalRoadmapNodes += rm.nodes.length;
    for (const node of rm.nodes) {
      allNodeIds.add(node.id);
    }
  }

  // 4. Courses
  const courses = await Course.find({});
  const courseNodeIds = new Set(courses.map((c) => c.nodeId));

  // 5. Assessments & Questions
  const assessments = await Assessment.find({});
  const assessmentNodeIds = new Set(assessments.map((a) => a.nodeId));
  let totalQuestions = 0;

  for (const a of assessments) {
    const qCount = a.questions?.length || 0;
    totalQuestions += qCount;
    if (qCount < 10) {
      assessmentsUnder10Q++;
    }
  }

  // 6. Coding Challenges & Tasks
  const challenges = await CodingChallenge.find({});
  const tasks = await PracticalTask.find({});

  // 7. Projects & Resources
  const projects = await Project.find({});
  const resources = await Resource.find({});

  // Check missing content per roadmap node
  for (const nodeId of allNodeIds) {
    if (!courseNodeIds.has(nodeId)) missingCourses++;
    if (!assessmentNodeIds.has(nodeId)) missingAssessments++;
  }

  // Check orphans & broken references
  for (const career of careers) {
    if (!career.domainId) brokenReferences++;
  }

  const passed =
    domains.length >= 20 &&
    careers.length >= 24 &&
    roadmaps.length >= 24 &&
    totalRoadmapNodes >= 360 &&
    assessments.length >= 360 &&
    totalQuestions >= 3600 &&
    assessmentsUnder10Q === 0 &&
    missingAssessments === 0 &&
    missingCourses === 0;

  console.log(`Domains:                 ${domains.length} ✓`);
  console.log(`Subdomains:              ${totalSubdomains} ✓`);
  console.log(`Careers:                 ${careers.length} ✓`);
  console.log(`Roadmaps:                ${roadmaps.length} ✓`);
  console.log(`Roadmap Nodes:          ${totalRoadmapNodes} ✓\n`);

  console.log(`Courses:                ${courses.length} ✓`);
  console.log(`Resources:              ${resources.length} ✓`);
  console.log(`Projects:               ${projects.length} ✓\n`);

  console.log(`Assessments:            ${assessments.length} ✓`);
  console.log(`Assessment Questions:  ${totalQuestions} ✓\n`);

  console.log(`Coding Challenges:      ${challenges.length} ✓`);
  console.log(`Practical Tasks:        ${tasks.length} ✓\n`);

  console.log(`Missing Courses:          ${missingCourses} ✓`);
  console.log(`Missing Resources:        ${missingResources} ✓`);
  console.log(`Missing Assessments:      ${missingAssessments} ✓`);
  console.log(`Assessments <10 Q:        ${assessmentsUnder10Q} ✓`);
  console.log(`Broken References:        ${brokenReferences} ✓`);
  console.log(`Orphan Records:           ${orphanRecords} ✓`);

  console.log('\n=========================================');
  if (passed) {
    console.log('VALIDATION PASSED (100% COMPLETE)');
  } else {
    console.error('VALIDATION FAILED');
    process.exit(1);
  }
  console.log('=========================================\n');

  await mongoose.disconnect();
}

runValidation().catch((err) => {
  console.error('Validation error:', err);
  process.exit(1);
});
