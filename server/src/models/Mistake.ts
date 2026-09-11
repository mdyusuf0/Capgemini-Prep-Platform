import mongoose, { Schema, Document } from 'mongoose';

export interface IMistake extends Document {
  userId: mongoose.Types.ObjectId;
  itemType: string;
  itemId: mongoose.Types.ObjectId;
  wrongAnswer: any;
  correctAnswer: any;
  attemptedAt: Date;
  revisited: boolean;
}

const mistakeSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { 
    type: String, 
    enum: ['question', 'coding', 'debugging', 'pseudocode'], 
    required: true 
  },
  itemId: { type: Schema.Types.ObjectId, required: true },
  wrongAnswer: { type: Schema.Types.Mixed },
  correctAnswer: { type: Schema.Types.Mixed },
  attemptedAt: { type: Date, default: Date.now },
  revisited: { type: Boolean, default: false }
});

export default mongoose.model<IMistake>('Mistake', mistakeSchema);
