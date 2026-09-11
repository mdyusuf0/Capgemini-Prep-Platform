import mongoose, { Document, Schema } from 'mongoose';

export interface IPseudocodeQuestion extends Document {
  question: string;
  codeBlock: string;
  options: string[];
  answer: number;
  explanation: string;
  dryRunTrace?: string;
  topic: string;
  subtopic?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority?: 'MUST_KNOW' | 'HIGH' | 'MEDIUM' | 'LOW';
  frequency?: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  assessmentVersion?: string;
  drive?: string;
  year?: number;
  sourceType: string;
  sourceReliability?: string;
  source?: string;
  isReportedPattern?: boolean;
  relevance: 'must-know' | 'high-priority' | 'important' | 'practice' | 'advanced';
  capgeminiRelevance: number;
  tags: string[];
  isVerified: boolean;
  createdAt: Date;
}

const PseudocodeQuestionSchema = new Schema<IPseudocodeQuestion>({
  question: { type: String, required: true },
  codeBlock: { type: String, required: true },
  options: {
    type: [String],
    required: true,
    validate: [
      (arr: string[]) => arr.length === 4,
      'Options array must have exactly 4 items',
    ],
  },
  answer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, required: true },
  dryRunTrace: { type: String },
  topic: { type: String, required: true, index: true },
  subtopic: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
  
  // Provenance & Versioning
  priority: { type: String, enum: ['MUST_KNOW', 'HIGH', 'MEDIUM', 'LOW'], default: 'HIGH', index: true },
  frequency: { type: String, enum: ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'], default: 'VERY_HIGH' },
  assessmentVersion: { type: String, default: '2026-2027', index: true },
  drive: { type: String, default: 'Exceller' },
  year: { type: Number, default: 2026 },
  sourceType: { type: String, default: 'practice' },
  sourceReliability: { type: String, enum: ['high', 'medium', 'low'], default: 'high' },
  source: { type: String, default: 'Capgemini Pseudocode Bank' },
  isReportedPattern: { type: Boolean, default: true },

  relevance: { type: String, enum: ['must-know', 'high-priority', 'important', 'practice', 'advanced'], default: 'must-know' },
  capgeminiRelevance: { type: Number, min: 1, max: 5, default: 5 },
  tags: { type: [String], default: [] },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

export const PseudocodeQuestion = mongoose.model<IPseudocodeQuestion>('PseudocodeQuestion', PseudocodeQuestionSchema);
export { PseudocodeQuestion as default };
