import mongoose, { Document, Schema, Model } from 'mongoose';

export type ChallengeLanguage = 'kotlin' | 'python' | 'javascript' | 'typescript' | 'java';

export interface ITestCase {
  id: string;
  description: string;
  input: string;
  expectedOutput: string;
}

export interface ICodingChallenge extends Document {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: ChallengeLanguage;
  timeLimit: number;
  starterCode: string;
  solutionCode?: string;
  testCases: ITestCase[];
  hints: string[];
  explanation: string;
}

const TestCaseSchema = new Schema<ITestCase>(
  {
    id: { type: String, required: true },
    description: { type: String, required: true },
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
  },
  { _id: false }
);

const CodingChallengeSchema = new Schema<ICodingChallenge>(
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
    language: {
      type: String,
      enum: ['kotlin', 'python', 'javascript', 'typescript', 'java'],
      required: true,
    },
    timeLimit: { type: Number, default: 1800 },
    starterCode: { type: String, required: true },
    solutionCode: { type: String },
    testCases: { type: [TestCaseSchema], default: [] },
    hints: { type: [String], default: [] },
    explanation: { type: String, required: true },
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

export const CodingChallenge: Model<ICodingChallenge> = mongoose.model<ICodingChallenge>(
  'CodingChallenge',
  CodingChallengeSchema
);
