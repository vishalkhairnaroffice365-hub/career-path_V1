import mongoose, { Document, Schema, Model } from 'mongoose';

export type ProjectDifficulty = 'starter' | 'intermediate' | 'advanced' | 'capstone';
export type ProjectStatus = 'not-started' | 'in-progress' | 'completed' | 'published';

export interface IProject extends Document {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  emoji: string;
  difficulty: ProjectDifficulty;
  estimatedTime: string;
  skillIds: string[];
  careerIds: string[];
  tags: string[];
  objectives: string[];
  techStack: string[];
  status: ProjectStatus;
  githubUrl?: string;
  liveUrl?: string;
  isPortfolioWorthy: boolean;
  phase: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, required: true },
    emoji: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['starter', 'intermediate', 'advanced', 'capstone'],
      required: true,
      index: true,
    },
    estimatedTime: { type: String, required: true },
    skillIds: { type: [String], default: [] },
    careerIds: { type: [String], default: [], index: true },
    tags: { type: [String], default: [] },
    objectives: { type: [String], default: [] },
    techStack: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'published'],
      default: 'not-started',
    },
    githubUrl: { type: String },
    liveUrl: { type: String },
    isPortfolioWorthy: { type: Boolean, default: false },
    phase: { type: Number, default: 1 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

ProjectSchema.index({ careerIds: 1, difficulty: 1 });

export const Project: Model<IProject> = mongoose.model<IProject>('Project', ProjectSchema);
