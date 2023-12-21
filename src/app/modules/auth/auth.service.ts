import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  IAuth,
  IChangePassword,
  ILoginRequest,
  ILoginUserResponse,
} from './auth.interface';
import Auth from './auth.model';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { UserInfoFromToken } from '../../../interfaces/common';

const createUser = async (
  payload: IAuth,
): Promise<{
  userInfo: IAuth;
  accessToken: string;
  refreshToken: string;
}> => {
  const checkEmail = await Auth.findOne({ email: payload.email });

  if (checkEmail) {
    throw new ApiError(httpStatus.CONFLICT, 'Already used this email!!!');
  }

  const createdUser = await Auth.create(payload);

  if (!createdUser) {
    throw new ApiError(400, 'Failed to create user!');
  }

  const result = await Auth.findById(createdUser._id);
  const accessToken = jwtHelpers.createToken(
    { id: createdUser.id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { id: createdUser.id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return { userInfo: result!, accessToken, refreshToken };
};

const login = async (payload: ILoginRequest): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const isUserExist = await Auth.isUserExist(email);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User doesn't exist.");
  }

  if (!(await Auth.isPasswordMatch(password, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect.');
  }
  const { id } = isUserExist;

  const accessToken = jwtHelpers.createToken(
    { id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (
  userInfo: UserInfoFromToken,
  payload: IChangePassword,
): Promise<void> => {
  const { oldPassword, newPassword } = payload;

  const isUserExist = await Auth.findById(userInfo.id).select({
    password: true,
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  if (!(await Auth.isPasswordMatch(oldPassword, isUserExist.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Old Password is incorrect');
  }
  isUserExist.password = newPassword;
  isUserExist.save();
};

const getOwnProfile = (payload: any) => {};
const updateOwnProfile = (id: any, payload: any) => {};

export const AuthService = {
  createUser,
  login,
  changePassword,
  getOwnProfile,
  updateOwnProfile,
};
