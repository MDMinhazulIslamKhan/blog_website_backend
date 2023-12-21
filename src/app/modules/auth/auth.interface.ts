import { Model } from 'mongoose';

export type IAuth = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type AuthModel = {
  isUserExist(email: string): Promise<Pick<IAuth, 'id' | 'email' | 'password'>>;
  isPasswordMatch(
    givenPassword: string,
    savePassword: string,
  ): Promise<boolean>;
} & Model<IAuth>;

export type ILoginRequest = {
  email: string;
  password: string;
};

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken: string;
};
