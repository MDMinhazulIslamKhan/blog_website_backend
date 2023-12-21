import { Schema, model } from 'mongoose';
import { BlogModel, IBlog } from './blog.interface';

const commentSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  replies: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
});

const blogSchema = new Schema<IBlog>(
  {
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'Auth',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    imgUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    likes: {
      type: [Schema.Types.ObjectId],
      ref: 'Auth',
    },
    comments: [commentSchema],
  },
  {
    timestamps: true,
  },
);

const Blog = model<IBlog, BlogModel>('Blog', blogSchema);

export default Blog;
