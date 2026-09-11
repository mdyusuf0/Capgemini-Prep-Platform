import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  itemType: string;
  itemId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const bookmarkSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { 
    type: String, 
    enum: ['question', 'coding', 'debugging', 'interview', 'pseudocode'], 
    required: true 
  },
  itemId: { type: Schema.Types.ObjectId, required: true },
  createdAt: { type: Date, default: Date.now }
});

bookmarkSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

export default mongoose.model<IBookmark>('Bookmark', bookmarkSchema);
