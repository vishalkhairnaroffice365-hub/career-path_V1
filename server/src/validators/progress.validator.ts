import { z } from 'zod';

export const selectCareerSchema = z.object({
  body: z.object({
    careerId: z.string().min(1, 'careerId is required'),
  }),
});

export const compareCareerSchema = z.object({
  body: z.object({
    careerId: z.string().min(1, 'careerId is required'),
  }),
});

export const updateProjectStatusSchema = z.object({
  params: z.object({
    projectId: z.string().min(1, 'projectId parameter is required'),
  }),
  body: z.object({
    status: z.enum(['not-started', 'in-progress', 'completed', 'published']),
    githubUrl: z.string().url().optional().or(z.literal('')),
    liveUrl: z.string().url().optional().or(z.literal('')),
  }),
});
