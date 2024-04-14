import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  postId: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },

  reply: [
    {
      userId: { type: String, required: true },
      postId: { type: String, required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],

  likes: [
    {
      userId: {
        type: String,
        required: true,
      },
    },
  ],
});

export interface Comment extends mongoose.Document {
  userId: string | UserResponse;
  postId: string;
  content: string;
  createdAt: Date;
  reply: {
    userId: string | UserResponse;
    postId: string;
    content: string;
    createdAt: Date;
  }[];

  likes: {
    userId: string;
  }[];
}

export interface UserResponse {
  _id: string;
  usename: string;
  avatar: string;
}
