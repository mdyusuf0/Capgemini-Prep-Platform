import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentSection {
  sectionKey: string;
  title: string;
  description?: string;
  questionCount: number;
  durationMinutes: number;
  cutoffPercentage: number;
  isElimination: boolean;
  enabled: boolean;
  order: number;
}

export interface IAssessmentProfile extends Document {
  profileId: string; // 'profile-a' | 'profile-b' | 'profile-c'
  name: string;
  description: string;
  targetDrive: string;
  targetYear: number;
  isDefault: boolean;
  totalDurationMinutes: number;
  sections: IAssessmentSection[];
  createdAt: Date;
  updatedAt: Date;
}

const assessmentSectionSchema = new Schema<IAssessmentSection>({
  sectionKey: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  questionCount: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  cutoffPercentage: { type: Number, default: 60 },
  isElimination: { type: Boolean, default: true },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 1 }
}, { _id: false });

const assessmentProfileSchema = new Schema<IAssessmentProfile>({
  profileId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  targetDrive: { type: String, default: 'Exceller' },
  targetYear: { type: Number, default: 2026 },
  isDefault: { type: Boolean, default: false },
  totalDurationMinutes: { type: Number, required: true },
  sections: [assessmentSectionSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const AssessmentProfile = mongoose.model<IAssessmentProfile>('AssessmentProfile', assessmentProfileSchema);
export { AssessmentProfile };
export default AssessmentProfile;
