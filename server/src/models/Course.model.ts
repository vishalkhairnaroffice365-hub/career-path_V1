import mongoose, { Document, Schema, Model } from 'mongoose';

export type LessonType = 'video' | 'reading' | 'exercise' | 'quiz';

export interface ILesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  content?: string;
}

export interface ICourseModule {
  id: string;
  title: string;
  lessons: ILesson[];
}

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ICourse extends Document {
  id: string;
  nodeId: string;
  title: string;
  description: string;
  domain: string;
  difficulty: CourseDifficulty;
  estimatedTime: string;
  objectives: string[];
  modules: ICourseModule[];
  hasAssessment: boolean;
  hasCodingChallenge: boolean;
  hasPracticalTask: boolean;
}

const LessonSchema = new Schema<ILesson>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['video', 'reading', 'exercise', 'quiz'],
      required: true,
    },
    duration: { type: String, required: true },
    content: { type: String },
  },
  { _id: false }
);

const CourseModuleSchema = new Schema<ICourseModule>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    lessons: { type: [LessonSchema], default: [] },
  },
  { _id: false }
);

const CourseSchema = new Schema<ICourse>(
  {
    id: { type: String, required: true, unique: true, index: true },
    nodeId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    domain: { type: String, required: true, index: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      index: true,
    },
    estimatedTime: { type: String, required: true },
    objectives: { type: [String], default: [] },
    modules: { type: [CourseModuleSchema], default: [] },
    hasAssessment: { type: Boolean, default: false },
    hasCodingChallenge: { type: Boolean, default: false },
    hasPracticalTask: { type: Boolean, default: false },
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

export const Course: Model<ICourse> = mongoose.model<ICourse>('Course', CourseSchema);
