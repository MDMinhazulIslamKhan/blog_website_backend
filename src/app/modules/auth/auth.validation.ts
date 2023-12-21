import { z } from 'zod';

const createUserZodSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: 'Name is required',
      }),
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email({ message: 'Invalid email format' }),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(3)
        .max(15),
    })
    .strict(),
});

const loginZodSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: 'Email is required',
        })
        .email({ message: 'Invalid email format' }),
      password: z.string({
        required_error: 'Password is required',
      }),
    })
    .strict(),
});

const updateUserZodSchema = z.object({
  body: z
    .object({
      name: z.string().optional(),
      email: z.string().email({ message: 'Invalid email format' }).optional(),
    })
    .strict(),
});

const changePasswordZodSchema = z.object({
  body: z
    .object({
      oldPassword: z
        .string({
          required_error: 'Old password is required',
        })
        .min(3)
        .max(15),
      newPassword: z
        .string({
          required_error: 'New password is required',
        })
        .min(3)
        .max(15),
    })
    .strict(),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  createUserZodSchema,
  loginZodSchema,
  updateUserZodSchema,
  changePasswordZodSchema,
  refreshTokenZodSchema,
};
