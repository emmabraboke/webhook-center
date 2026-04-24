export type Token = {
  accessToken: string;
  refreshToken: string;
};

export type PaginationType = {
  page: number;
  limit: number;
  total: number;
};

export type SuccessResponse<T> = {
  status: 'success';
  message: string;
  data: T | null;
  token?: Token;
  pagination?: PaginationType;
};

export type FailResponse = {
  status: 'fail';
  message: string;
};

export type PaginationResponseType<T> = {
  data: T;
  pagination: PaginationType;
};
