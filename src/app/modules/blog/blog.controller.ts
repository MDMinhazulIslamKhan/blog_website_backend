import { Request, RequestHandler, Response } from 'express';
import sendResponse from '../../../shared/sendResponse';
import catchAsync from '../../../shared/catchAsync';
import { BlogService } from './blog.service';
import { UserInfoFromToken } from '../../../interfaces/common';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { blogFilterableField } from './blog.constant';
import { paginationFields } from '../../../constant';

const createBlog: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BlogService.createBlog(
      req.body,
      req.user as UserInfoFromToken,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'Blog created Successfully!!!',
    });
  },
);

const getAllBlogs: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, blogFilterableField);
    const paginationOptions = pick(req.query, paginationFields);

    const result = await BlogService.getAllBlogs(filters, paginationOptions);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Blogs retrieved Successfully',
      meta: result.meta,
      data: result.data,
    });
  },
);

const getSingleBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.getSingleBlog(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog retrieved Successfully.',
    data: result,
  });
});

const updateBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.updateBlog(
    id,
    req.user as UserInfoFromToken,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog updated Successfully.',
    data: result,
  });
});

const deleteBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.deleteBlog(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blog deleted Successfully.',
    data: result,
  });
});

const likeOnBlog = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.likeOnBlog(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Like Successfully posted.',
    data: result,
  });
});

const removeLike = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BlogService.removeLike(
    id,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Like Successfully removed.',
    data: result,
  });
});

const commentOnBlog = catchAsync(async (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  const comment = req.body.text;
  const result = await BlogService.commentOnBlog(
    blogId,
    req.user as UserInfoFromToken,
    comment,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment posted Successfully.',
    data: result,
  });
});

const updateComment = catchAsync(async (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;
  const comment = req.body.text;

  const result = await BlogService.updateComment(
    blogId,
    commentId,
    req.user as UserInfoFromToken,
    comment,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment updated Successfully.',
    data: result,
  });
});

const deleteComment = catchAsync(async (req: Request, res: Response) => {
  const blogId = req.params.blogId;
  const commentId = req.params.commentId;

  const result = await BlogService.deleteComment(
    blogId,
    commentId,
    req.user as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comment deleted Successfully.',
    data: result,
  });
});

export const BlogController = {
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
  // replayOnComment,
  // updateReplay,
  // deleteReplay,
};
