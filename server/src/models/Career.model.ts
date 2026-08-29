import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICareerSalary {
  entry: string;
  mid: string;
  senior: string;
}

export interface ICareer extends Document {
  id: string;
  subDomainId: string;
  domainId: string;
  title: string;
  emoji: string;
  tagline: string;
  description: string;
  defaultMatchScore: number;
  salary: ICareerSalary;
  growthRate: string;
  demandLevel: 'explosive' | 'high' | 'moderate' | 'stable';
  workStyle: 'remote-first' | 'hybrid' | 'onsite';
  timeToReady: string;
  keySkills: string[];
  dayInLife: string[];
  pros: string[];
  cons: string[];
  companies: string[];
  requiredSkillIds: string[];
  roadmapId: string;
}

const CareerSalarySchema = new Schema<ICareerSalary>(
  {
    entry: { type: String, required: true },
    mid: { type: String, required: true },
    senior: { type: String, required: true },
  },
  { _id: false }
);

const CareerSchema = new Schema<ICareer>(
  {
    id: { type: String, required: true, unique: true, index: true },
    subDomainId: { type: String, required: true, index: true },
    domainId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    emoji: { type: String, required: true },
    tagline: { type: String, required: true },
    description: { type: String, required: true },
    defaultMatchScore: { type: Number, default: 75 },
    salary: { type: CareerSalarySchema, required: true },
    growthRate: { type: String, required: true },
    demandLevel: {
      type: String,
      enum: ['explosive', 'high', 'moderate', 'stable'],
      required: true,
    },
    workStyle: {
      type: String,
      enum: ['remote-first', 'hybrid', 'onsite'],
      required: true,
    },
    timeToReady: { type: String, required: true },
    keySkills: { type: [String], default: [] },
    dayInLife: { type: [String], default: [] },
    pros: { type: [String], default: [] },
    cons: { type: [String], default: [] },
    companies: { type: [String], default: [] },
    requiredSkillIds: { type: [String], default: [] },
    roadmapId: { type: String, required: true },
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

CareerSchema.index({ domainId: 1, subDomainId: 1 });

export const Career: Model<ICareer> = mongoose.model<ICareer>('Career', CareerSchema);
