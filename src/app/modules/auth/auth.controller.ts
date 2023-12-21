import { Request, Response, RequestHandler } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserInfoFromToken } from '../../../interfaces/common';
import { AuthService } from './auth.service';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.createUser(req.body);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      data: result,
      message: 'User created Successfully!!!',
    });
  },
);

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.login(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully!',
    data: { accessToken: result },
  });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req?.user;

  await AuthService.changePassword(userInfo as UserInfoFromToken, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully!',
  });
});

const getOwnProfile = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req?.user;

  const result = await AuthService.getOwnProfile(userInfo as UserInfoFromToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile retrieved successfully!',
    data: result,
  });
});

const updateOwnProfile = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req?.user;

  const result = await AuthService.updateOwnProfile(
    req.body,
    userInfo as UserInfoFromToken,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Profile updated successfully!',
    data: result,
  });
});

export const AuthController = {
  createUser,
  login,
  changePassword,
  getOwnProfile,
  updateOwnProfile,
};
