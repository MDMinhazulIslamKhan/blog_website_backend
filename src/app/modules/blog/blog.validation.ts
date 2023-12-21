import { z } from 'zod';

const createBlogZodSchema = z.object({
  body: z
    .object({
      title: z.string({
        required_error: 'Title is required',
      }),
      imgUrl: z.string({
        required_error: 'Title is required',
      }),
      description: z.string({
        required_error: 'Description is required',
      }),
    })
    .strict(),
});
const updateBlogZodSchema = z.object({
  body: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .strict(),
});

const commentOrReplayZodSchema = z.object({
  body: z
    .object({
      text: z.string({
        required_error: 'Text is required',
      }),
    })
    .strict(),
});

const commentOrReplayUpdateZodSchema = z.object({
  body: z
    .object({
      text: z.string().optional(),
    })
    .strict(),
});

export const BlogValidation = {
  createBlogZodSchema,
  commentOrReplayZodSchema,
  commentOrReplayUpdateZodSchema,
  updateBlogZodSchema,
};
