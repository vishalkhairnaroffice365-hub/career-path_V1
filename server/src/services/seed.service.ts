import { Domain } from '../models/Domain.model.js';
import { Career } from '../models/Career.model.js';
import { Roadmap } from '../models/Roadmap.model.js';
import { Skill } from '../models/Skill.model.js';
import { Project } from '../models/Project.model.js';
import { Resource } from '../models/Resource.model.js';
import { Achievement } from '../models/Achievement.model.js';
import { SYSTEM_ACHIEVEMENTS } from '../constants/achievements.js';
import { logger } from '../config/logger.js';

// Raw seed data extracted directly from src/data/*
import { rawDomains } from './seedData/domains.data.js';
import { rawCareers } from './seedData/careers.data.js';
import { rawRoadmaps } from './seedData/roadmaps.data.js';
import { rawSkills } from './seedData/skills.data.js';
import { rawProjects } from './seedData/projects.data.js';
import { rawResources } from './seedData/resources.data.js';

export async function seedDatabase(): Promise<{
  domainsCount: number;
  careersCount: number;
  roadmapsCount: number;
  skillsCount: number;
  projectsCount: number;
  resourcesCount: number;
  achievementsCount: number;
}> {
  logger.info('🌱 Starting idempotent MongoDB database seeding...');

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

  logger.info('🎉 Database seeding completed successfully.');

  return {
    domainsCount: rawDomains.length,
    careersCount: rawCareers.length,
    roadmapsCount: rawRoadmaps.length,
    skillsCount: rawSkills.length,
    projectsCount: rawProjects.length,
    resourcesCount: rawResources.length,
    achievementsCount: SYSTEM_ACHIEVEMENTS.length,
  };
}
