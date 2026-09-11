import mongoose, { Document, Schema } from 'mongoose';

export interface IGameScore extends Document {
  userId: mongoose.Types.ObjectId;
  gameType: 'grid' | 'switch' | 'motion' | 'digit' | 'deductive' | 'inductive';
  level: number;
  score: number;
  accuracy: number;
  timeSpent: number;
  playedAt: Date;
}

const gameScoreSchema = new Schema<IGameScore>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  gameType: { 
    type: String, 
    enum: ['grid', 'switch', 'motion', 'digit', 'deductive', 'inductive'],
    required: true
  },
  level: { type: Number, required: true },
  score: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timeSpent: { type: Number, required: true },
  playedAt: { type: Date, default: Date.now }
});

const GameScore = mongoose.model<IGameScore>('GameScore', gameScoreSchema);

export default GameScore;
