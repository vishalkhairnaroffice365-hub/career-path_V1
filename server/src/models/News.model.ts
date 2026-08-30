import mongoose, { Document, Schema, Model } from 'mongoose';

export interface INews extends Document {
  id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: Date;
  careerIds: string[];
  isBreaking: boolean;
  imageEmoji: string;
  tags: string[];
}

const NewsSchema = new Schema<INews>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    source: { type: String, required: true },
    url: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
    careerIds: { type: [String], default: [], index: true },
    isBreaking: { type: Boolean, default: false },
    imageEmoji: { type: String, default: '📰' },
    tags: { type: [String], default: [] },
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

export const News: Model<INews> = mongoose.model<INews>('News', NewsSchema);
