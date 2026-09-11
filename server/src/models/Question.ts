import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  category: string;
  topic: string;
  subtopic?: string;
  difficulty: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  whyOthersWrong?: string;
  tags: string[];
  sourceType: string;
  sourceReliability: string;
  source?: string;
  reportedYear?: number;
  year?: number;
  assessmentVersion?: string;
  drive?: string;
  section?: string;
  subsection?: string;
  questionType?: string;
  priority?: string;
  frequency?: string;
  isReportedPattern?: boolean;
  isActualQuestion?: boolean;
  relevance: string;
  capgeminiRelevance: number;
  isVerified: boolean;
  createdAt: Date;
}

const questionSchema: Schema = new Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['technical-mcq', 'communication', 'ai-literacy', 'behavioral', 'dbms', 'sql', 'oops', 'os', 'networks', 'cloud', 'java', 'dsa', 'prompt-engineering', 'software-engineering', 'git'] 
  },
  topic: { type: String, required: true },
  subtopic: { type: String },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard', 'Easy', 'Medium', 'Hard'], 
    set: (v: string) => v ? v.toLowerCase() : v,
    required: true 
  },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: Number, required: true },
  explanation: { type: String, required: true },
  whyOthersWrong: { type: String },
  tags: [String],
  
  // Provenance & Source Metadata
  sourceType: { 
    type: String, 
    enum: ['official', 'candidate-reported', 'publicly-reported', 'practice', 'illustrative', 'AI-generated', 'adapted', 'capgemini-style', 'frequently-reported', 'assessment-pattern'], 
    default: 'practice' 
  },
  sourceReliability: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'high'
  },
  source: { type: String, default: 'Capgemini Exceller Question Bank' },
  reportedYear: { type: Number, default: 2026 },
  year: { type: Number, default: 2026 },
  assessmentVersion: { type: String, default: '2026-2027' },
  drive: { type: String, default: 'Exceller' },
  section: { type: String, default: 'Technical-MCQ' },
  subsection: { type: String },
  questionType: { type: String, default: 'mcq' },
  priority: { 
    type: String, 
    enum: ['MUST_KNOW', 'HIGH', 'MEDIUM', 'LOW'], 
    default: 'HIGH' 
  },
  frequency: { 
    type: String, 
    enum: ['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW'], 
    default: 'HIGH' 
  },
  isReportedPattern: { type: Boolean, default: true },
  isActualQuestion: { type: Boolean, default: false },

  relevance: { 
    type: String, 
    enum: ['must-know', 'high-priority', 'important', 'practice', 'advanced', 'high', 'medium', 'low'], 
    default: 'important',
    set: (v: string) => v === 'high' ? 'high-priority' : v
  },
  capgeminiRelevance: { type: Number, min: 1, max: 5, default: 4 },
  isVerified: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

questionSchema.index({ category: 1 });
questionSchema.index({ topic: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ priority: 1 });
questionSchema.index({ assessmentVersion: 1 });
questionSchema.index({ section: 1 });

const Question = mongoose.model<IQuestion>('Question', questionSchema);
export { Question };
export default Question;
