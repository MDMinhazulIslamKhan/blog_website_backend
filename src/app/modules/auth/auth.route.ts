import express from 'express';
import validateRequest from '../../middleware/validateRequest';
import auth from '../../middleware/auth';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';

const router = express.Router();

router.post(
  '/signup',
  validateRequest(AuthValidation.createUserZodSchema),
  AuthController.createUser,
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.login,
);

router.patch(
  '/change-password',
  auth(),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword,
);

router.get('/profile', auth(), AuthController.getOwnProfile);

router.patch(
  '/profile',
  auth(),
  validateRequest(AuthValidation.updateUserZodSchema),
  AuthController.updateOwnProfile,
);

router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenZodSchema),
  AuthController.refreshToken,
);

export const AuthRouters = router;
