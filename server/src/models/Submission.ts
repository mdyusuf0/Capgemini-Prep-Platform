import mongoose, { Document, Schema } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  problemId: mongoose.Types.ObjectId;
  code: string;
  language: string;
  status: 'Accepted' | 'Wrong Answer' | 'Runtime Error' | 'Compilation Error' | 'Time Limit Exceeded' | 'Pending';
  testCasesPassed: number;
  totalTestCases: number;
  executionTime: string;
  memoryUsed: string;
  results: {
    input: string;
    expected: string;
    actual: string;
    passed: boolean;
    isHidden: boolean;
  }[];
  submittedAt: Date;
}

const submissionSchema = new Schema<ISubmission>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  problemId: { type: Schema.Types.ObjectId, ref: 'CodingProblem', required: true },
  code: { type: String, required: true },
  language: { type: String, required: true },
  status: {
    type: String,
    enum: ['Accepted', 'Wrong Answer', 'Runtime Error', 'Compilation Error', 'Time Limit Exceeded', 'Pending'],
    default: 'Pending'
  },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  executionTime: { type: String, default: '0ms' },
  memoryUsed: { type: String, default: '0KB' },
  results: [{
    input: { type: String },
    expected: { type: String },
    actual: { type: String },
    passed: { type: Boolean },
    isHidden: { type: Boolean, default: false }
  }],
  submittedAt: { type: Date, default: Date.now }
});

export const Submission = mongoose.model<ISubmission>('Submission', submissionSchema);
export default Submission;
