import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50).optional(),
    avatar: z.string().max(10).optional(),
  }),
});

export const onboardingSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    age: z.string().optional(),
    location: z.string().optional(),
    currentRole: z.string().optional(),
    educationLevel: z.string().optional(),
    interests: z.array(z.string()).optional(),
    hobbies: z.array(z.string()).optional(),
    currentSkills: z.array(z.string()).optional(),
    experienceLevel: z.enum(['complete-beginner', 'some-experience', 'intermediate', 'advanced']).optional(),
    strengths: z.array(z.string()).optional(),
    workStyle: z.array(z.string()).optional(),
    preferredEnvironment: z.string().optional(),
    collaboration: z.string().optional(),
    learningStyle: z.string().optional(),
    primaryGoal: z.string().optional(),
    timeHorizon: z.string().optional(),
    salaryExpectation: z.string().optional(),
    fiveYearVision: z.string().optional(),
    impactArea: z.string().optional(),
    motivations: z.array(z.string()).optional(),
  }),
});
