import mongoose, { Document, Schema } from 'mongoose';

export interface IAITask extends Document {
  taskId: string;
  type: 'ai-coding' | 'ai-debugging' | 'ai-feature-dev' | 'prompt-engineering';
  title: string;
  description: string;
  context: string;
  initialCode: string;
  solutionCode?: string;
  language: string;
  framework?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  priority: 'MUST_KNOW' | 'HIGH' | 'MEDIUM' | 'LOW';
  testCases: {
    input: string;
    expectedOutput: string;
    description?: string;
  }[];
  aiInstructions: string;
  rubric: {
    criterion: string;
    maxPoints: number;
    description: string;
  }[];
  tags: string[];
  assessmentVersion: string;
  sourceType: string;
  source: string;
  createdAt: Date;
}

const aiTaskSchema = new Schema<IAITask>({
  taskId: { type: String, required: true, unique: true, index: true },
  type: { 
    type: String, 
    required: true, 
    enum: ['ai-coding', 'ai-debugging', 'ai-feature-dev', 'prompt-engineering'],
    index: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  context: { type: String, required: true },
  initialCode: { type: String, default: '' },
  solutionCode: { type: String },
  language: { type: String, default: 'javascript' },
  framework: { type: String },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium', index: true },
  priority: { type: String, enum: ['MUST_KNOW', 'HIGH', 'MEDIUM', 'LOW'], default: 'HIGH', index: true },
  testCases: [{
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    description: { type: String }
  }],
  aiInstructions: { type: String, default: 'Act as a senior technical reviewer. Guide the candidate with constructive hints without directly giving away the full solution initially.' },
  rubric: [{
    criterion: { type: String, required: true },
    maxPoints: { type: Number, required: true },
    description: { type: String, required: true }
  }],
  tags: [{ type: String }],
  assessmentVersion: { type: String, default: '2026-2027' },
  sourceType: { type: String, default: 'candidate-reported/practice' },
  source: { type: String, default: 'Capgemini AI Developer Assessment Pattern' },
  createdAt: { type: Date, default: Date.now }
});

const AITask = mongoose.model<IAITask>('AITask', aiTaskSchema);
export { AITask };
export default AITask;
