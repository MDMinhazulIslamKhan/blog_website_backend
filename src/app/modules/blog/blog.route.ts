import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import { BlogValidation } from './blog.validation';
import { BlogController } from './blog.controller';
import auth from '../../middleware/auth';

const router = express.Router();

router.post(
  '/',
  auth(),
  validateRequest(BlogValidation.createBlogZodSchema),
  BlogController.createBlog,
);

router.get('/', BlogController.getAllBlogs);

router.get('/:id', BlogController.getSingleBlog);

router.patch(
  '/:id',
  auth(),
  validateRequest(BlogValidation.updateBlogZodSchema),
  BlogController.updateBlog,
);

router.delete('/:id', auth(), BlogController.deleteBlog);

router.post('/like/:id', auth(), BlogController.likeOnBlog);

router.delete('/remove-like/:id', auth(), BlogController.removeLike);

// router.post('/:blogId/comment', auth(), BlogController.commentOnBlog);

// router.patch(
//   '/:blogId/comment/:commentId',
//   auth(),
//   BlogController.updateComment,
// );

// router.delete(
//   '/:blogId/comment/:commentId',
//   auth(),
//   BlogController.deleteComment,
// );

// router.post(
//   '/:blogId/comment/:commentId',
//   auth(),
//   BlogController.replayOnComment,
// );

// router.patch(
//   '/:blogId/comment/:commentId/replay/:replayId',
//   auth(),
//   BlogController.updateReplay,
// );

// router.delete(
//   '/:blogId/comment/:commentId/replay/:replayId',
//   auth(),
//   BlogController.deleteReplay,
// );

export const BlogRouters = router;
