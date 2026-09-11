import mongoose, { Document, Schema } from 'mongoose';

export interface IMockTest extends Document {
  title: string;
  type: 'quick' | 'section' | 'full-capgemini' | 'weakness' | 'custom';
  sections: {
    name: string;
    category: string;
    questionCount: number;
    timeMinutes: number;
    questionIds: mongoose.Types.ObjectId[];
  }[];
  totalTimeMinutes: number;
  difficulty: string;
  isGenerated: boolean;
  createdAt: Date;
}

const mockTestSchema = new Schema<IMockTest>({
  title: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ['quick', 'section', 'full-capgemini', 'weakness', 'custom'] 
  },
  sections: [{
    name: { type: String, required: true },
    category: { type: String, required: true },
    questionCount: { type: Number, required: true },
    timeMinutes: { type: Number, required: true },
    questionIds: [{ type: Schema.Types.ObjectId }]
  }],
  totalTimeMinutes: { type: Number, required: true },
  difficulty: { type: String, default: 'medium' },
  isGenerated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const MockTest = mongoose.model<IMockTest>('MockTest', mockTestSchema);

export default MockTest;
