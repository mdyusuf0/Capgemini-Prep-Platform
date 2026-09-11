import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface IAIConversation extends Document {
  userId: Types.ObjectId;
  context: string;
  problemId?: Types.ObjectId;
  messages: IMessage[];
  assistanceLevel: number;
  promptCount: number;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
}, { _id: false });

const schema = new Schema<IAIConversation>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  context: { type: String, required: true },
  problemId: { type: Schema.Types.ObjectId, ref: 'CodingProblem' }, // Could be CodingProblem or DebuggingProblem
  messages: [messageSchema],
  assistanceLevel: { type: Number, required: true, min: 1, max: 4 },
  promptCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const AIConversation = mongoose.model<IAIConversation>('AIConversation', schema);
export { AIConversation };
export default AIConversation;
