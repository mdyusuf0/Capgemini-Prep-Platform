import mongoose, { Document, Schema } from 'mongoose';

export interface IMockAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  mockTestId: mongoose.Types.ObjectId;
  startedAt: Date;
  completedAt?: Date;
  status: 'in-progress' | 'completed' | 'abandoned';
  answers: {
    questionId: mongoose.Types.ObjectId;
    questionType: string;
    selectedAnswer: any;
    isCorrect: boolean;
    timeTaken: number;
  }[];
  score: number;
  totalQuestions: number;
  sectionScores: {
    sectionName: string;
    correct: number;
    total: number;
    accuracy: number;
  }[];
  timeSpent: number;
  weakTopics: string[];
}

const mockAttemptSchema = new Schema<IMockAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  mockTestId: { type: Schema.Types.ObjectId, ref: 'MockTest', required: true },
  startedAt: { type: Date, required: true, default: Date.now },
  completedAt: { type: Date },
  status: { 
    type: String, 
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  answers: [{
    questionId: { type: Schema.Types.ObjectId, required: true },
    questionType: { type: String, required: true },
    selectedAnswer: { type: Schema.Types.Mixed },
    isCorrect: { type: Boolean, default: false },
    timeTaken: { type: Number, default: 0 }
  }],
  score: { type: Number, default: 0 },
  totalQuestions: { type: Number, default: 0 },
  sectionScores: [{
    sectionName: { type: String },
    correct: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 }
  }],
  timeSpent: { type: Number, default: 0 },
  weakTopics: [{ type: String }]
});

const MockAttempt = mongoose.model<IMockAttempt>('MockAttempt', mockAttemptSchema);

export default MockAttempt;
