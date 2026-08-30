import mongoose, { Document, Schema, Model } from 'mongoose';
import { SYSTEM_ACHIEVEMENTS } from '../constants/achievements.js';

export interface IOnboardingData {
  name?: string;
  age?: string;
  location?: string;
  currentRole?: string;
  educationLevel?: string;
  interests?: string[];
  hobbies?: string[];
  currentSkills?: string[];
  experienceLevel?: 'complete-beginner' | 'some-experience' | 'intermediate' | 'advanced';
  strengths?: string[];
  workStyle?: string[];
  preferredEnvironment?: string;
  collaboration?: string;
  learningStyle?: string;
  primaryGoal?: string;
  timeHorizon?: string;
  salaryExpectation?: string;
  fiveYearVision?: string;
  impactArea?: string;
  motivations?: string[];
}

export interface ILessonProgress {
  lessonId: string;
  completed: boolean;
}

export interface IUserCourseProgress {
  nodeId: string;
  lessonsCompleted: string[];
  totalLessons: number;
  completed: boolean;
  startedAt?: Date | null;
  completedAt?: Date | null;
}

export interface IUserAssessmentScore {
  nodeId: string;
  score: number;
  passed: boolean;
  attempts: number;
  lastAttemptAt?: Date | null;
}

export interface IUserTaskSubmission {
  nodeId: string;
  githubUrl?: string;
  liveUrl?: string;
  submittedAt?: Date | null;
  status: 'not-started' | 'in-progress' | 'submitted' | 'under-review' | 'passed' | 'failed';
  taskStartTime?: number | null;
  taskDeadline?: number | null;
}

export interface IUserLearningState {
  roadmapStarted: boolean;
  courseProgress: Record<string, IUserCourseProgress>;
  assessmentScores: Record<string, IUserAssessmentScore>;
  codingScores: Record<string, number>;
  taskSubmissions: Record<string, IUserTaskSubmission>;
}

export interface IUserProgress {
  completedNodeIds: string[];
  inProgressNodeIds: string[];
  completedProjectIds: string[];
  completedResourceIds: string[];
  currentPhase: number;
  totalProgress: number;
  weeklyGoalHours: number;
  hoursThisWeek: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: Date;
}

export interface IUserStats {
  totalHoursLearned: number;
  skillsAcquired: number;
  projectsCompleted: number;
  resourcesConsumed: number;
  careerReadinessScore: number;
}

export interface IUserAchievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  earnedAt?: Date | null;
  isEarned: boolean;
  category: 'milestone' | 'skill' | 'streak' | 'social' | 'special';
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  name: string;
  avatar: string;
  joinedAt: Date;
  selectedCareerId?: string | null;
  onboardingCompleted: boolean;
  onboardingData?: IOnboardingData;
  progress: IUserProgress;
  learning: IUserLearningState;
  stats: IUserStats;
  achievements: IUserAchievement[];
  comparedCareerIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OnboardingDataSchema = new Schema<IOnboardingData>(
  {
    name: { type: String, trim: true },
    age: { type: String, trim: true },
    location: { type: String, trim: true },
    currentRole: { type: String, trim: true },
    educationLevel: { type: String, trim: true },
    interests: { type: [String], default: [] },
    hobbies: { type: [String], default: [] },
    currentSkills: { type: [String], default: [] },
    experienceLevel: {
      type: String,
      enum: ['complete-beginner', 'some-experience', 'intermediate', 'advanced'],
    },
    strengths: { type: [String], default: [] },
    workStyle: { type: [String], default: [] },
    preferredEnvironment: { type: String, trim: true },
    collaboration: { type: String, trim: true },
    learningStyle: { type: String, trim: true },
    primaryGoal: { type: String, trim: true },
    timeHorizon: { type: String, trim: true },
    salaryExpectation: { type: String, trim: true },
    fiveYearVision: { type: String, trim: true },
    impactArea: { type: String, trim: true },
    motivations: { type: [String], default: [] },
  },
  { _id: false }
);

const UserProgressSchema = new Schema<IUserProgress>(
  {
    completedNodeIds: { type: [String], default: [] },
    inProgressNodeIds: { type: [String], default: [] },
    completedProjectIds: { type: [String], default: [] },
    completedResourceIds: { type: [String], default: [] },
    currentPhase: { type: Number, default: 1 },
    totalProgress: { type: Number, default: 0 },
    weeklyGoalHours: { type: Number, default: 15 },
    hoursThisWeek: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserStatsSchema = new Schema<IUserStats>(
  {
    totalHoursLearned: { type: Number, default: 0 },
    skillsAcquired: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    resourcesConsumed: { type: Number, default: 0 },
    careerReadinessScore: { type: Number, default: 0 },
  },
  { _id: false }
);

const UserAchievementSchema = new Schema<IUserAchievement>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    emoji: { type: String, required: true },
    category: {
      type: String,
      enum: ['milestone', 'skill', 'streak', 'social', 'special'],
      required: true,
    },
    isEarned: { type: Boolean, default: false },
    earnedAt: { type: Date, default: null },
  },
  { _id: false }
);

const UserLearningSchema = new Schema<IUserLearningState>(
  {
    roadmapStarted: { type: Boolean, default: false },
    courseProgress: { type: Schema.Types.Mixed, default: () => ({}) },
    assessmentScores: { type: Schema.Types.Mixed, default: () => ({}) },
    codingScores: { type: Schema.Types.Mixed, default: () => ({}) },
    taskSubmissions: { type: Schema.Types.Mixed, default: () => ({}) },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // Never return password in queries unless explicitly requested
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    avatar: {
      type: String,
      default: '🧑‍💻',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
    selectedCareerId: {
      type: String,
      default: null,
      index: true,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingData: {
      type: OnboardingDataSchema,
      default: () => ({}),
    },
    progress: {
      type: UserProgressSchema,
      default: () => ({
        completedNodeIds: [],
        inProgressNodeIds: [],
        completedProjectIds: [],
        completedResourceIds: [],
        currentPhase: 1,
        totalProgress: 0,
        weeklyGoalHours: 15,
        hoursThisWeek: 0,
        streak: 0,
        longestStreak: 0,
        lastActiveDate: new Date(),
      }),
    },
    learning: {
      type: UserLearningSchema,
      default: () => ({
        roadmapStarted: false,
        courseProgress: {},
        assessmentScores: {},
        codingScores: {},
        taskSubmissions: {},
      }),
    },
    stats: {
      type: UserStatsSchema,
      default: () => ({
        totalHoursLearned: 0,
        skillsAcquired: 0,
        projectsCompleted: 0,
        resourcesConsumed: 0,
        careerReadinessScore: 0,
      }),
    },
    achievements: {
      type: [UserAchievementSchema],
      default: () =>
        SYSTEM_ACHIEVEMENTS.map((a) => ({
          ...a,
          isEarned: false,
          earnedAt: null,
        })),
    },
    comparedCareerIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);
