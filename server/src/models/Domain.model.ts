import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IDomainTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  cloudStyle: 'cumulus' | 'stratus' | 'cirrus' | 'cumulonimbus';
  particleStyle: 'dots' | 'lines' | 'stars' | 'hexagons' | 'nodes';
  lightingStyle: 'warm' | 'cool' | 'electric' | 'neon' | 'soft';
  atmosphere: string;
  objectType: string;
  fogColor: string;
  emissiveColor: string;
}

export interface ISubDomain {
  id: string;
  domainId: string;
  name: string;
  icon: string;
  description: string;
  careerIds: string[];
  position: [number, number, number];
  scale: number;
}

export interface IDomain extends Document {
  id: string;
  name: string;
  icon: string;
  description: string;
  tagline: string;
  careerCount: number;
  avgSalary: string;
  growthRate: string;
  theme: IDomainTheme;
  subDomains: ISubDomain[];
  position: [number, number, number];
  scale: number;
}

const DomainThemeSchema = new Schema<IDomainTheme>(
  {
    primaryColor: { type: String, required: true },
    secondaryColor: { type: String, required: true },
    accentColor: { type: String, required: true },
    gradientFrom: { type: String, required: true },
    gradientTo: { type: String, required: true },
    cloudStyle: { type: String, required: true },
    particleStyle: { type: String, required: true },
    lightingStyle: { type: String, required: true },
    atmosphere: { type: String, required: true },
    objectType: { type: String, required: true },
    fogColor: { type: String, required: true },
    emissiveColor: { type: String, required: true },
  },
  { _id: false }
);

const SubDomainSchema = new Schema<ISubDomain>(
  {
    id: { type: String, required: true },
    domainId: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    careerIds: { type: [String], default: [] },
    position: { type: [Number], required: true },
    scale: { type: Number, default: 0.7 },
  },
  { _id: false }
);

const DomainSchema = new Schema<IDomain>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    tagline: { type: String, required: true },
    careerCount: { type: Number, required: true },
    avgSalary: { type: String, required: true },
    growthRate: { type: String, required: true },
    theme: { type: DomainThemeSchema, required: true },
    subDomains: { type: [SubDomainSchema], default: [] },
    position: { type: [Number], required: true },
    scale: { type: Number, default: 1.0 },
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

export const Domain: Model<IDomain> = mongoose.model<IDomain>('Domain', DomainSchema);
