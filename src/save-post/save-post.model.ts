import * as mongoose from 'mongoose';

export const SavePostSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  postId: {
    type: String,
    required: true,
  },
});

export interface SavePost extends mongoose.Document {
  userId: string;
  postId: string;
}
