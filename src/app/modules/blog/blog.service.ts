import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  IGenericResponse,
  IPaginationOptions,
  UserInfoFromToken,
} from '../../../interfaces/common';
import { IBlog, IBlogFilters } from './blog.interface';
import Blog from './blog.model';
import Auth from '../auth/auth.model';
import { blogFilterableField } from './blog.constant';
import { calculatePagination } from '../../../helpers/paginationHelper';
import { SortOrder } from 'mongoose';

const createBlog = async (
  blog: Partial<IBlog>,
  userInfo: UserInfoFromToken,
): Promise<IBlog | null> => {
  const creator = await Auth.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  blog.creatorId = userInfo.id;

  const result = await Blog.create(blog);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create blog!!!');
  }

  const res = await Blog.populate(result, {
    path: 'creatorId',
    select: {
      name: true,
    },
  });

  return result;
};

const getAllBlogs = async (
  filters: IBlogFilters,
  paginationOptions: IPaginationOptions,
): Promise<IGenericResponse<IBlog[]>> => {
  const { searchTerm, ...filtersData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: blogFilterableField.map(field => ({
        [field]: { $regex: searchTerm, $options: 'i' },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: value,
      })),
    });
  }

  const { page, limit, skip, sortBy, sortOrder } =
    calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder;
  }

  const query = andConditions.length > 0 ? { $and: andConditions } : {};

  const result = await Blog.find(query)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });

  const count = await Blog.countDocuments(query);

  return {
    meta: {
      page,
      limit,
      count,
    },
    data: result,
  };
};

const getSingleBlog = async (id: string): Promise<IBlog | null> => {
  const result = await Blog.findById(id)
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });

  if (!result) {
    throw new ApiError(httpStatus.CONFLICT, 'Blog is not exist!!!');
  }
  return result;
};

const updateBlog = async (
  id: string,
  userInfo: UserInfoFromToken,
  payload: Partial<IBlog>,
): Promise<IBlog | null> => {
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no blog with this blog id!!!',
    );
  }

  const creator = await Auth.findById(userInfo.id);

  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  if (userInfo.id.toString() !== blog.creatorId.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'This is not your blog!!!');
  }

  const result = await Blog.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  })
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });
  return result;
};

const deleteBlog = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<IBlog | null> => {
  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'There is no blog with this id!!!',
    );
  }

  const creator = await Auth.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  if (userInfo.id.toString() !== blog.creatorId.toString()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'This is not your Blog!!!');
  }

  const result = await Blog.findByIdAndDelete(id);

  return result;
};

const likeOnBlog = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<IBlog | null> => {
  const creator = await Auth.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog is not exist!!!');
  }

  const includeCheck = blog.likes.indexOf(userInfo.id);
  let result;
  if (includeCheck == -1) {
    result = await Blog.findByIdAndUpdate(
      id,
      { $push: { likes: userInfo.id } },
      { new: true },
    )
      .populate({
        path: 'creatorId',
        select: {
          name: true,
        },
      })
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: 'name',
          },
          {
            path: 'replies',
            populate: {
              path: 'user',
              select: 'name',
            },
          },
        ],
      });
  } else {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Your already liked the post!!!',
    );
  }

  return result;
};

const removeLike = async (
  id: string,
  userInfo: UserInfoFromToken,
): Promise<IBlog | null> => {
  const creator = await Auth.findById(userInfo.id);
  if (!creator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const blog = await Blog.findById(id);

  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog is not exist!!!');
  }

  const includeCheck = blog.likes.indexOf(userInfo.id);
  let result;
  if (includeCheck == -1) {
    throw new ApiError(httpStatus.BAD_REQUEST, "You didn't liked the post!!!");
  } else {
    result = await Blog.findByIdAndUpdate(
      id,
      { $pull: { likes: userInfo.id } },
      { new: true },
    )
      .populate({
        path: 'creatorId',
        select: {
          name: true,
        },
      })
      .populate({
        path: 'comments',
        populate: [
          {
            path: 'user',
            select: 'name',
          },
          {
            path: 'replies',
            populate: {
              path: 'user',
              select: 'name',
            },
          },
        ],
      });
  }

  return result;
};

const commentOnBlog = async (
  blogId: string,
  userInfo: UserInfoFromToken,
  comment: string,
): Promise<IBlog | null> => {
  const commentator = await Auth.findById(userInfo.id);
  if (!commentator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog is not exist!!!');
  }

  const result = await Blog.findByIdAndUpdate(
    blogId,
    {
      $push: {
        comments: {
          user: userInfo.id,
          text: comment,
        },
      },
    },
    { new: true },
  )
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });

  return result;
};

const updateComment = async (
  blogId: string,
  commentId: string,
  userInfo: UserInfoFromToken,
  updatedComment: string,
): Promise<IBlog | null> => {
  const commentator = await Auth.findById(userInfo.id);
  if (!commentator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog is not exist!!!');
  }
  const comment = blog.comments.find(com => {
    return com.user == userInfo.id && com._id == commentId;
  });
  if (!comment) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This is not your comment or comment is not exist!!!',
    );
  }

  const result = await Blog.findOneAndUpdate(
    {
      $and: [{ _id: blogId }, { 'comments._id': commentId }],
    },
    {
      $set: {
        'comments.$.text': updatedComment,
      },
    },
    { new: true },
  )
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });

  return result;
};

const deleteComment = async (
  blogId: string,
  commentId: string,
  userInfo: UserInfoFromToken,
): Promise<IBlog | null> => {
  const commentator = await Auth.findById(userInfo.id);
  if (!commentator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog is not exist!!!');
  }
  const comment = blog.comments.find(com => {
    return com.user == userInfo.id && com._id == commentId;
  });

  if (!comment) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'This is not your comment or comment is not exist!!!',
    );
  }

  const result = await Blog.findOneAndUpdate(
    {
      $and: [{ _id: blogId }],
    },
    {
      $pull: { comments: { _id: commentId } },
    },
    { new: true },
  )
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });

  return result;
};

const replayOnComment = async (
  blogId: string,
  commentId: string,
  userInfo: UserInfoFromToken,
  replay: string,
): Promise<IBlog | null> => {
  const commentator = await Auth.findById(userInfo.id);
  if (!commentator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog is not exist!!!');
  }
  const comment = blog.comments.find(com => com._id == commentId);

  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Comment is not exist!!!');
  }

  const replayData = {
    user: userInfo.id,
    text: replay,
  };
  const result = await Blog.findOneAndUpdate(
    {
      $and: [{ _id: blogId }, { 'comments._id': commentId }],
    },
    {
      $push: {
        'comments.$.replies': replayData,
      },
    },
    { new: true },
  )
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });

  return result;
};

const updateReplay = async (
  blogId: string,
  commentId: string,
  replayId: string,
  userInfo: UserInfoFromToken,
  updatedReplay: string,
): Promise<IBlog | null> => {
  const commentator = await Auth.findById(userInfo.id);
  if (!commentator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog is not exist!!!');
  }

  const comment = blog.comments.find(com => com._id == commentId);

  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Comment is not exist!!!');
  }
  const replay = comment.replies.find(rep => rep._id == replayId);

  if (!replay) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Replay is not exist!!!');
  }

  if (replay.user != userInfo.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This is not your replay!!!');
  }

  const result = await Blog.findOneAndUpdate(
    {
      $and: [
        { _id: blogId },
        { 'comments._id': commentId },
        { 'comments.replies._id': replayId },
      ],
    },
    {
      $set: {
        'comments.$[comment].replies.$[reply].text': updatedReplay,
      },
    },
    {
      arrayFilters: [{ 'comment._id': commentId }, { 'reply._id': replayId }],
    },
  )
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });

  return result;
};

const deleteReplay = async (
  blogId: string,
  commentId: string,
  replayId: string,
  userInfo: UserInfoFromToken,
): Promise<IBlog | null> => {
  const commentator = await Auth.findById(userInfo.id);
  if (!commentator) {
    throw new ApiError(httpStatus.CONFLICT, 'Your profile does not exist!!!');
  }

  const blog = await Blog.findById(blogId);

  if (!blog) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Blog is not exist!!!');
  }

  const comment = blog.comments.find(com => com._id == commentId);

  if (!comment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Comment is not exist!!!');
  }
  const replay = comment.replies.find(rep => rep._id == replayId);

  if (!replay) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Replay is not exist!!!');
  }

  if (replay.user != userInfo.id) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'This is not your replay!!!');
  }

  const result = await Blog.findOneAndUpdate(
    {
      $and: [
        { _id: blogId },
        { 'comments._id': commentId },
        { 'comments.replies._id': replayId },
      ],
    },
    {
      $pull: {
        'comments.$.replies': { _id: replayId },
      },
    },
    {
      new: true,
    },
  )
    .populate({
      path: 'creatorId',
      select: {
        name: true,
      },
    })
    .populate({
      path: 'comments',
      populate: [
        {
          path: 'user',
          select: 'name',
        },
        {
          path: 'replies',
          populate: {
            path: 'user',
            select: 'name',
          },
        },
      ],
    });

  return result;
};

export const BlogService = {
  createBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
  deleteBlog,
  likeOnBlog,
  removeLike,
  commentOnBlog,
  updateComment,
  deleteComment,
  replayOnComment,
  updateReplay,
  deleteReplay,
};
