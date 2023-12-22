import { Model, Types } from 'mongoose';

export type IBlog = {
  creatorId: Types.ObjectId;
  title: string;
  imgUrl: string;
  description: string;
  likes: [Types.ObjectId];
  comments: [
    {
      user: Types.ObjectId;
      _id: string;
      text: string;
      createdAt: Date;
      replies: [
        {
          user: Types.ObjectId;
          _id: string;
          text: string;
          createdAt: Date;
        },
      ];
    },
  ];
};

export type BlogModel = Model<IBlog, Record<string, unknown>>;

export type IBlogFilters = {
  searchTerm?: string;
  title?: string;
};
