import mongoose, { Document, Schema, Model } from 'mongoose';

export type ResourceType = 'course' | 'book' | 'video' | 'article' | 'documentation' | 'practice' | 'community';
export type ResourceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface IResource extends Document {
  id: string;
  title: string;
  description: string;
  type: ResourceType;
  level: ResourceLevel;
  url: string;
  provider: string;
  duration: string;
  isFree: boolean;
  price?: string;
  rating: number;
  skillIds: string[];
  careerIds: string[];
  tags: string[];
  emoji: string;
}

const ResourceSchema = new Schema<IResource>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ['course', 'book', 'video', 'article', 'documentation', 'practice', 'community'],
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true,
      index: true,
    },
    url: { type: String, required: true },
    provider: { type: String, required: true },
    duration: { type: String, required: true },
    isFree: { type: Boolean, default: true, index: true },
    price: { type: String },
    rating: { type: Number, default: 4.8 },
    skillIds: { type: [String], default: [] },
    careerIds: { type: [String], default: [], index: true },
    tags: { type: [String], default: [] },
    emoji: { type: String, default: '📚' },
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

ResourceSchema.index({ careerIds: 1, isFree: 1, level: 1 });

export const Resource: Model<IResource> = mongoose.model<IResource>('Resource', ResourceSchema);
