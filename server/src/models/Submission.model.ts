import mongoose, { Document, Schema, Model } from 'mongoose';

export type SubmissionType = 'coding-challenge' | 'practical-task';
export type SubmissionStatus = 'submitted' | 'under-review' | 'passed' | 'failed';

export interface ISubmission extends Document {
  id: string;
  userId: mongoose.Types.ObjectId | string;
  userEmail?: string;
  nodeId: string;
  careerId?: string;
  type: SubmissionType;
  githubUrl: string;
  liveUrl?: string;
  notes?: string;
  fileName?: string;
  fileData?: string; // base64 or storage url
  fileSize?: number;
  score?: number;
  status: SubmissionStatus;
  feedback?: string;
  submittedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.Mixed, required: true, index: true },
    userEmail: { type: String },
    nodeId: { type: String, required: true, index: true },
    careerId: { type: String, index: true },
    type: {
      type: String,
      enum: ['coding-challenge', 'practical-task'],
      required: true,
      index: true,
    },
    githubUrl: { type: String, required: true },
    liveUrl: { type: String },
    notes: { type: String },
    fileName: { type: String },
    fileData: { type: String },
    fileSize: { type: Number },
    score: { type: Number },
    status: {
      type: String,
      enum: ['submitted', 'under-review', 'passed', 'failed'],
      default: 'submitted',
      index: true,
    },
    feedback: { type: String },
    submittedAt: { type: Date, default: Date.now },
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

export const Submission: Model<ISubmission> = mongoose.model<ISubmission>(
  'Submission',
  SubmissionSchema
);
