import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ISkill extends Document {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'tool' | 'concept' | 'soft';
  icon: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  learningTime: string;
  prerequisites: string[];
  resources: string[];
}

const SkillSchema = new Schema<ISkill>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ['language', 'framework', 'tool', 'concept', 'soft'],
      required: true,
      index: true,
    },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
    },
    learningTime: { type: String, required: true },
    prerequisites: { type: [String], default: [] },
    resources: { type: [String], default: [] },
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

export const Skill: Model<ISkill> = mongoose.model<ISkill>('Skill', SkillSchema);
