import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMCQOption {
  id: string;
  text: string;
}

export interface IMCQQuestion {
  id: string;
  question: string;
  options: IMCQOption[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface IAssessment extends Document {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  timeLimit: number; // in seconds
  passingScore: number; // percentage 0-100
  questions: IMCQQuestion[];
}

const MCQOptionSchema = new Schema<IMCQOption>(
  {
    id: { type: String, required: true },
    text: { type: String, required: true },
  },
  { _id: false }
);

const MCQQuestionSchema = new Schema<IMCQQuestion>(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: { type: [MCQOptionSchema], default: [] },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
  },
  { _id: false }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    id: { type: String, required: true, unique: true, index: true },
    nodeId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    timeLimit: { type: Number, default: 900 },
    passingScore: { type: Number, default: 70 },
    questions: { type: [MCQQuestionSchema], default: [] },
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

export const Assessment: Model<IAssessment> = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
