import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  content: {
    type: String,
  },

  userId: {
    type: String,
    required: true,
    default: 'anonymous',
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  like: {
    type: [String],
    default: [],
  },
  thumbUp: {
    type: [String],
    default: [],
  },
  thumbDown: {
    type: [String],
    default: [],
  },
  fire: {
    type: [String],
    default: [],
  },
});

export interface Post extends mongoose.Document {
  title: string;
  content: string;
  userId: string;
  isActive: boolean;
  createdAt: Date;
  like: string[];
  thumbUp: string[];
  thumbDown: string[];
  fire: string[];
}
