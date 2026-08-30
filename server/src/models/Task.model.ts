import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITaskRequirement {
  id: string;
  text: string;
  isRequired: boolean;
}

export interface ITaskResource {
  title: string;
  url: string;
}

export interface IPracticalTask extends Document {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationHours: number;
  requirements: ITaskRequirement[];
  technologies: string[];
  deliverables: string[];
  githubRequired: boolean;
  liveUrlRequired: boolean;
  evaluationCriteria: string[];
  resources: ITaskResource[];
}

const TaskRequirementSchema = new Schema<ITaskRequirement>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
    isRequired: { type: Boolean, default: true },
  },
  { _id: false }
);

const TaskResourceSchema = new Schema<ITaskResource>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false }
);

const PracticalTaskSchema = new Schema<IPracticalTask>(
  {
    id: { type: String, required: true, unique: true, index: true },
    nodeId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      index: true,
    },
    durationHours: { type: Number, default: 168 },
    requirements: { type: [TaskRequirementSchema], default: [] },
    technologies: { type: [String], default: [] },
    deliverables: { type: [String], default: [] },
    githubRequired: { type: Boolean, default: true },
    liveUrlRequired: { type: Boolean, default: false },
    evaluationCriteria: { type: [String], default: [] },
    resources: { type: [TaskResourceSchema], default: [] },
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

export const PracticalTask: Model<IPracticalTask> = mongoose.model<IPracticalTask>(
  'PracticalTask',
  PracticalTaskSchema
);
