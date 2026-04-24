import {
  FailResponse,
  PaginationResponseType,
  PaginationType,
  SuccessResponse,
  Token,
} from '../types/response.type';

export class Utils {
  static generateOtp(length: number) {
    const code = Math.floor(
      10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1),
    );

    return code;
  }
}

export const success = <T>(
  message: string,
  data: T | null = null,
  pagination?: PaginationType,
  token?: Token,
): SuccessResponse<T | null> => {
  return {
    status: 'success',
    message,
    data,
    pagination,
    token,
  };
};

export const fail = (message: string): FailResponse => {
  return {
    status: 'fail',
    message,
  };
};

export const Pagination = <T>(
  data: T,
  dto: PaginationType,
): PaginationResponseType<T> => {
  return {
    data,
    pagination: {
      page: dto.page || 0,
      limit: dto.limit || 0,
      total: dto.total || 0,
    },
  };
};
