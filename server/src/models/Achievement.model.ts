import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAchievement extends Document {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'milestone' | 'skill' | 'streak' | 'social' | 'special';
}

const AchievementSchema = new Schema<IAchievement>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    emoji: { type: String, required: true },
    category: {
      type: String,
      enum: ['milestone', 'skill', 'streak', 'social', 'special'],
      required: true,
      index: true,
    },
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

export const Achievement: Model<IAchievement> = mongoose.model<IAchievement>('Achievement', AchievementSchema);
