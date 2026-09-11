import mongoose, { Schema, Document } from 'mongoose';

export interface IInterviewQuestion extends Document {
  category: string;
  type: string;
  topic: string;
  question: string;
  idealAnswer: string;
  keyPoints: string[];
  followUpQuestions: string[];
  difficulty: string;
  priority?: string;
  frequency?: string;
  source?: string;
  createdAt: Date;
}

const interviewQuestionSchema: Schema = new Schema({
  category: { 
    type: String, 
    required: true,
    enum: ['technical-interview', 'hr-interview', 'project-interview'] 
  },
  type: { type: String, default: 'technical' },
  topic: { type: String, required: true },
  question: { type: String, required: true },
  idealAnswer: { type: String, required: true },
  keyPoints: [{ type: String }],
  followUpQuestions: [{ type: String }],
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'], 
    default: 'medium',
    set: (v: string) => v ? v.toLowerCase() : 'medium'
  },
  priority: { type: String, default: 'HIGH' },
  frequency: { type: String, default: 'HIGH' },
  source: { type: String, default: 'Capgemini Interview Archives' }
}, {
  timestamps: true
});

export const InterviewQuestion = mongoose.model<IInterviewQuestion>('InterviewQuestion', interviewQuestionSchema);
export default InterviewQuestion;
