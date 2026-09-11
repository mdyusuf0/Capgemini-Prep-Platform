import mongoose, { Schema, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: mongoose.Types.ObjectId;
  category: string;
  topic: string;
  totalAttempted: number;
  correct: number;
  accuracy: number;
  streak: number;
  lastPracticed: Date;
  weakTopics: string[];
  strongTopics: string[];
}

const userProgressSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String },
  topic: { type: String },
  totalAttempted: { type: Number, default: 0 },
  correct: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  lastPracticed: { type: Date },
  weakTopics: [{ type: String }],
  strongTopics: [{ type: String }]
});

userProgressSchema.index({ userId: 1, category: 1, topic: 1 }, { unique: true });

export default mongoose.model<IUserProgress>('UserProgress', userProgressSchema);
