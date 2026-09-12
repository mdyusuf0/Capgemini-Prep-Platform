import mongoose, { Document, Schema } from 'mongoose';

export interface ILevelHistoryItem {
  level: number;
  timeTaken: number;
  correct: boolean;
  score: number;
  timestamp?: Date;
}

export interface IQuestionHistoryItem {
  level: number;
  isCorrect: boolean;
  timeTaken: number;
  points: number;
  userResponse?: any;
}

export interface ICognitiveAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  assessmentMode: 'practice' | 'assessment' | 'challenge';
  assessmentSessionId?: string;
  gameId: string;
  startedAt: Date;
  endedAt: Date;
  duration: number; // in seconds
  highestLevel: number;
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number; // percentage 0-100
  totalScore: number;
  averageResponseTime: number; // in seconds
  streakMax: number;
  levelHistory: ILevelHistoryItem[];
  questionHistory: IQuestionHistoryItem[];
  createdAt: Date;
}

const levelHistorySchema = new Schema<ILevelHistoryItem>({
  level: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  correct: { type: Boolean, required: true },
  score: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const questionHistorySchema = new Schema<IQuestionHistoryItem>({
  level: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true },
  points: { type: Number, required: true },
  userResponse: { type: Schema.Types.Mixed },
}, { _id: false });

const cognitiveAttemptSchema = new Schema<ICognitiveAttempt>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assessmentMode: { 
    type: String, 
    enum: ['practice', 'assessment', 'challenge'], 
    default: 'practice',
    index: true 
  },
  assessmentSessionId: { type: String, index: true },
  gameId: { type: String, required: true, index: true },
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date, default: Date.now },
  duration: { type: Number, default: 0 },
  highestLevel: { type: Number, default: 1 },
  questionsAttempted: { type: Number, default: 0 },
  correctAnswers: { type: Number, default: 0 },
  incorrectAnswers: { type: Number, default: 0 },
  accuracy: { type: Number, default: 100 },
  totalScore: { type: Number, default: 0, index: true },
  averageResponseTime: { type: Number, default: 0 },
  streakMax: { type: Number, default: 0 },
  levelHistory: [levelHistorySchema],
  questionHistory: [questionHistorySchema],
  createdAt: { type: Date, default: Date.now, index: true },
});

const CognitiveAttempt = mongoose.model<ICognitiveAttempt>('CognitiveAttempt', cognitiveAttemptSchema);

export default CognitiveAttempt;
