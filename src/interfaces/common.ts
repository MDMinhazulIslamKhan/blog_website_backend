import { Types } from 'mongoose';
import { IGenericErrorMessages } from './error';

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessages[];
};

export type IPaginationOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type IGenericResponse<T> = {
  meta: {
    page: number;
    limit: number;
    count: number;
  };
  data: T;
};

export type UserInfoFromToken = {
  id: Types.ObjectId;
  iat: number;
  exp: number;
};
