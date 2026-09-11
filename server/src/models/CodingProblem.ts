import mongoose, { Document, Schema } from 'mongoose';

export interface ICodingProblem extends Document {
  title: string;
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: { input: string; output: string; explanation: string }[];
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  hints: string[];
  editorial: string;
  expectedComplexity: { time: string; space: string };
  starterCode: {
    java: string;
    cpp: string;
    python: string;
    c: string;
  };
  testCases: {
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    explanation?: string;
  }[];
  tier?: 'Tier 1' | 'Tier 2' | 'Tier 3';
  priority?: 'MUST_KNOW' | 'HIGH' | 'MEDIUM' | 'LOW';
  frequency?: 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW';
  assessmentVersion?: string;
  year?: number;
  drive?: string;
  sourceType?: string;
  sourceReliability?: string;
  source?: string;
  relevance: 'must-know' | 'high-priority' | 'important' | 'practice';
  capgeminiRelevance: number;
  isVerified: boolean;
  createdAt: Date;
}

const codingProblemSchema = new Schema<ICodingProblem>({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  inputFormat: { type: String, required: true },
  outputFormat: { type: String, required: true },
  constraints: [{ type: String }],
  examples: [{
    input: { type: String, required: true },
    output: { type: String, required: true },
    explanation: { type: String }
  }],
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true, index: true },
  topics: [{ type: String, index: true }],
  hints: [{ type: String }],
  editorial: { type: String },
  expectedComplexity: {
    time: { type: String },
    space: { type: String }
  },
  starterCode: {
    java: { type: String, default: '' },
    cpp: { type: String, default: '' },
    python: { type: String, default: '' },
    c: { type: String, default: '' }
  },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isHidden: { type: Boolean, default: false },
    explanation: { type: String }
  }],

  // Provenance & Categorization
  tier: { type: String, enum: ['Tier 1', 'Tier 2', 'Tier 3'], default: 'Tier 1', index: true },
  priority: { type: String, enum: ['MUST_KNOW', 'HIGH', 'MEDIUM', 'LOW'], default: 'HIGH', index: true },
  frequency: { type: String, enum: ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'], default: 'VERY_HIGH' },
  assessmentVersion: { type: String, default: '2026-2027', index: true },
  year: { type: Number, default: 2026 },
  drive: { type: String, default: 'Exceller' },
  sourceType: { type: String, default: 'practice' },
  sourceReliability: { type: String, enum: ['high', 'medium', 'low'], default: 'high' },
  source: { type: String, default: 'Capgemini Coding Problem Set' },

  relevance: { 
    type: String, 
    enum: ['must-know', 'high-priority', 'important', 'practice'],
    default: 'must-know'
  },
  capgeminiRelevance: { type: Number, min: 1, max: 5, default: 4 },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const CodingProblem = mongoose.model<ICodingProblem>('CodingProblem', codingProblemSchema);
export default CodingProblem;
