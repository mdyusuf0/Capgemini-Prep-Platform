import mongoose, { Document, Schema } from 'mongoose';

export interface ILanguageVariant {
  buggyCode: string;
  fixedCode: string;
  explanation?: string;
  hints?: string[];
}

export interface IDebuggingProblem extends Document {
  title: string;
  description: string;
  buggyCode: string;
  language: 'java' | 'cpp' | 'python' | 'c';
  availableLanguages?: ('java' | 'cpp' | 'python')[];
  variants?: {
    cpp?: ILanguageVariant;
    java?: ILanguageVariant;
    python?: ILanguageVariant;
  };
  bugType: string;
  bugCategory?: string;
  hints: string[];
  fixedCode: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  testCases: { input: string; expectedOutput: string }[];
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

const debuggingProblemSchema = new Schema<IDebuggingProblem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  buggyCode: { type: String, required: true },
  language: { 
    type: String, 
    required: true, 
    enum: ['java', 'cpp', 'python', 'c'] 
  },
  availableLanguages: [{
    type: String,
    enum: ['java', 'cpp', 'python', 'c']
  }],
  variants: {
    cpp: {
      buggyCode: { type: String },
      fixedCode: { type: String },
      explanation: { type: String },
      hints: [{ type: String }]
    },
    java: {
      buggyCode: { type: String },
      fixedCode: { type: String },
      explanation: { type: String },
      hints: [{ type: String }]
    },
    python: {
      buggyCode: { type: String },
      fixedCode: { type: String },
      explanation: { type: String },
      hints: [{ type: String }]
    }
  },
  bugType: { 
    type: String, 
    required: true,
    default: 'logic'
  },
  bugCategory: {
    type: String,
    default: 'logical'
  },
  hints: [{ type: String }],
  fixedCode: { type: String, required: true },
  explanation: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium', index: true },
  topic: { type: String, index: true },
  testCases: [{
    input: { type: String },
    expectedOutput: { type: String }
  }],

  // Provenance & Priority
  priority: { type: String, enum: ['MUST_KNOW', 'HIGH', 'MEDIUM', 'LOW'], default: 'HIGH', index: true },
  frequency: { type: String, enum: ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'], default: 'VERY_HIGH' },
  assessmentVersion: { type: String, default: '2026-2027', index: true },
  year: { type: Number, default: 2026 },
  drive: { type: String, default: 'Exceller' },
  sourceType: { type: String, default: 'candidate-reported/practice' },
  sourceReliability: { type: String, enum: ['high', 'medium', 'low'], default: 'high' },
  source: { type: String, default: 'Capgemini Debugging Problem Set' },

  relevance: { 
    type: String, 
    enum: ['must-know', 'high-priority', 'important', 'practice'],
    default: 'must-know'
  },
  capgeminiRelevance: { type: Number, min: 1, max: 5, default: 5 },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const DebuggingProblem = mongoose.model<IDebuggingProblem>('DebuggingProblem', debuggingProblemSchema);
export { DebuggingProblem };
export default DebuggingProblem;
