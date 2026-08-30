import { Domain } from '../models/Domain.model.js';
import { Career } from '../models/Career.model.js';
import { Roadmap } from '../models/Roadmap.model.js';
import { Skill } from '../models/Skill.model.js';
import { Project } from '../models/Project.model.js';
import { Resource } from '../models/Resource.model.js';
import { Achievement } from '../models/Achievement.model.js';
import { Course } from '../models/Course.model.js';
import { Assessment } from '../models/Assessment.model.js';
import { CodingChallenge } from '../models/CodingChallenge.model.js';
import { PracticalTask } from '../models/Task.model.js';
import { News } from '../models/News.model.js';
import { SYSTEM_ACHIEVEMENTS } from '../constants/achievements.js';
import { logger } from '../config/logger.js';

// Raw seed data
import { rawDomains } from './seedData/domains.data.js';
import { rawCareers } from './seedData/careers.data.js';
import { rawRoadmaps } from './seedData/roadmaps.data.js';
import { rawSkills } from './seedData/skills.data.js';
import { rawProjects } from './seedData/projects.data.js';
import { rawResources } from './seedData/resources.data.js';
import { rawAllCourses } from './seedData/allCourses.data.js';
import { rawAllAssessments } from './seedData/allAssessments.data.js';
import { rawAllChallenges } from './seedData/allChallenges.data.js';
import { rawAllTasks } from './seedData/allTasks.data.js';
import { rawNews } from './seedData/news.data.js';

export async function seedDatabase(): Promise<{
  domainsCount: number;
  careersCount: number;
  roadmapsCount: number;
  skillsCount: number;
  projectsCount: number;
  resourcesCount: number;
  achievementsCount: number;
  coursesCount: number;
  assessmentsCount: number;
  totalQuestionsCount: number;
  codingChallengesCount: number;
  tasksCount: number;
  newsCount: number;
}> {
  logger.info('🌱 Starting comprehensive idempotent MongoDB database seeding...');

  // 1. Seed Achievements
  const achievementOps: any[] = SYSTEM_ACHIEVEMENTS.map((achievement) => ({
    updateOne: {
      filter: { id: achievement.id },
      update: { $set: achievement },
      upsert: true,
    },
  }));
  await Achievement.bulkWrite(achievementOps);
  logger.info(`✅ Seeded ${SYSTEM_ACHIEVEMENTS.length} Achievements`);

  // 2. Seed Domains
  const domainOps: any[] = rawDomains.map((domain) => ({
    updateOne: {
      filter: { id: domain.id },
      update: { $set: domain },
      upsert: true,
    },
  }));
  await Domain.bulkWrite(domainOps);
  logger.info(`✅ Seeded ${rawDomains.length} Domains`);

  // 3. Seed Skills
  const skillOps: any[] = rawSkills.map((skill) => ({
    updateOne: {
      filter: { id: skill.id },
      update: { $set: skill },
      upsert: true,
    },
  }));
  await Skill.bulkWrite(skillOps);
  logger.info(`✅ Seeded ${rawSkills.length} Skills`);

  // 4. Seed Careers
  const careerOps: any[] = rawCareers.map((career) => ({
    updateOne: {
      filter: { id: career.id },
      update: { $set: career },
      upsert: true,
    },
  }));
  await Career.bulkWrite(careerOps);
  logger.info(`✅ Seeded ${rawCareers.length} Careers`);

  // 5. Seed Roadmaps
  const roadmapOps: any[] = rawRoadmaps.map((roadmap) => ({
    updateOne: {
      filter: { id: roadmap.id },
      update: { $set: roadmap },
      upsert: true,
    },
  }));
  await Roadmap.bulkWrite(roadmapOps);
  logger.info(`✅ Seeded ${rawRoadmaps.length} Roadmaps`);

  // Collect all active 360 node IDs
  const activeNodeIds: string[] = [];
  for (const rm of rawRoadmaps) {
    for (const node of rm.nodes) {
      activeNodeIds.push(node.id);
    }
  }

  // Clean obsolete legacy records before seeding active 360 nodes
  await Assessment.deleteMany({ nodeId: { $nin: activeNodeIds } });
  await Course.deleteMany({ nodeId: { $nin: activeNodeIds } });
  await CodingChallenge.deleteMany({ nodeId: { $nin: activeNodeIds } });
  await PracticalTask.deleteMany({ nodeId: { $nin: activeNodeIds } });

  // 6. Seed Projects
  const projectOps: any[] = rawProjects.map((project) => ({
    updateOne: {
      filter: { id: project.id },
      update: { $set: project },
      upsert: true,
    },
  }));
  await Project.bulkWrite(projectOps);
  logger.info(`✅ Seeded ${rawProjects.length} Projects`);

  // 7. Seed Resources
  const resourceOps: any[] = rawResources.map((resource) => ({
    updateOne: {
      filter: { id: resource.id },
      update: { $set: resource },
      upsert: true,
    },
  }));
  await Resource.bulkWrite(resourceOps);
  logger.info(`✅ Seeded ${rawResources.length} Resources`);

  // 8. Seed Complete 360 Courses
  const courseOps: any[] = rawAllCourses.map((course) => ({
    updateOne: {
      filter: { nodeId: course.nodeId },
      update: { $set: course },
      upsert: true,
    },
  }));
  await Course.bulkWrite(courseOps);
  logger.info(`✅ Seeded ${rawAllCourses.length} Courses across all roadmap nodes`);

  // 9. Seed Complete 360 Topic Assessments (3,600+ Questions)
  const assessmentOps: any[] = rawAllAssessments.map((assessment) => ({
    updateOne: {
      filter: { nodeId: assessment.nodeId },
      update: { $set: assessment },
      upsert: true,
    },
  }));
  await Assessment.bulkWrite(assessmentOps);
  const totalQuestions = rawAllAssessments.reduce((acc, a) => acc + (a.questions?.length || 0), 0);
  logger.info(`✅ Seeded ${rawAllAssessments.length} Assessments with ${totalQuestions} Questions`);

  // 10. Seed Complete 360 Coding Challenges
  const codingOps: any[] = rawAllChallenges.map((challenge) => ({
    updateOne: {
      filter: { nodeId: challenge.nodeId },
      update: { $set: challenge },
      upsert: true,
    },
  }));
  await CodingChallenge.bulkWrite(codingOps);
  logger.info(`✅ Seeded ${rawAllChallenges.length} Coding Challenges`);

  // 11. Seed Complete 360 Practical Tasks
  const taskOps: any[] = rawAllTasks.map((task) => ({
    updateOne: {
      filter: { nodeId: task.nodeId },
      update: { $set: task },
      upsert: true,
    },
  }));
  await PracticalTask.bulkWrite(taskOps);
  logger.info(`✅ Seeded ${rawAllTasks.length} Practical Tasks`);

  // 12. Seed News
  const newsOps: any[] = rawNews.map((news) => ({
    updateOne: {
      filter: { id: news.id },
      update: { $set: news },
      upsert: true,
    },
  }));
  await News.bulkWrite(newsOps);
  logger.info(`✅ Seeded ${rawNews.length} News Articles`);

  logger.info('🎉 Full Database seeding completed successfully.');

  return {
    domainsCount: rawDomains.length,
    careersCount: rawCareers.length,
    roadmapsCount: rawRoadmaps.length,
    skillsCount: rawSkills.length,
    projectsCount: rawProjects.length,
    resourcesCount: rawResources.length,
    achievementsCount: SYSTEM_ACHIEVEMENTS.length,
    coursesCount: rawAllCourses.length,
    assessmentsCount: rawAllAssessments.length,
    totalQuestionsCount: totalQuestions,
    codingChallengesCount: rawAllChallenges.length,
    tasksCount: rawAllTasks.length,
    newsCount: rawNews.length,
  };
}
