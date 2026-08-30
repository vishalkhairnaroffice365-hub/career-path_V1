import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IRoadmapPhase {
  id: number;
  name: string;
  description: string;
  color: string;
  duration: string;
}

export type RoadmapNodeType = 'milestone' | 'skill' | 'project' | 'certification' | 'checkpoint';
export type RoadmapNodeStatus = 'locked' | 'available' | 'in-progress' | 'completed';

export interface IRoadmapNode {
  id: string;
  title: string;
  description: string;
  type: RoadmapNodeType;
  duration: string;
  skillIds: string[];
  resourceIds: string[];
  projectIds: string[];
  prerequisites: string[];
  defaultStatus: RoadmapNodeStatus;
  position: { x: number; y: number };
  phase: number;
}

export interface IRoadmap extends Document {
  id: string;
  careerId: string;
  title: string;
  description: string;
  totalDuration: string;
  phases: IRoadmapPhase[];
  nodes: IRoadmapNode[];
}

const RoadmapPhaseSchema = new Schema<IRoadmapPhase>(
  {
    id: { type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    color: { type: String, required: true },
    duration: { type: String, required: true },
  },
  { _id: false }
);

const RoadmapNodeSchema = new Schema<IRoadmapNode>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['milestone', 'skill', 'project', 'certification', 'checkpoint'],
      required: true,
    },
    duration: { type: String, required: true },
    skillIds: { type: [String], default: [] },
    resourceIds: { type: [String], default: [] },
    projectIds: { type: [String], default: [] },
    prerequisites: { type: [String], default: [] },
    defaultStatus: {
      type: String,
      enum: ['locked', 'available', 'in-progress', 'completed'],
      default: 'locked',
    },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    phase: { type: Number, required: true },
  },
  { _id: false }
);

const RoadmapSchema = new Schema<IRoadmap>(
  {
    id: { type: String, required: true, unique: true, index: true },
    careerId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    totalDuration: { type: String, required: true },
    phases: { type: [RoadmapPhaseSchema], default: [] },
    nodes: { type: [RoadmapNodeSchema], default: [] },
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

export const Roadmap: Model<IRoadmap> = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
