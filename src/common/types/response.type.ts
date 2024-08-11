export interface Pagination {
  total: number;
  pageSize: number;
  currentPage: number;
}

export interface loginData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: Pagination;
}

export interface LoginResponse<T> {
  success: boolean;
  message: string;
  data: T;
  token: string;
}

export const success = <T>(
  message: string,
  data?: T,
  pagination?: Pagination,
) => {
  return {
    success: true,
    message: message || 'success',
    data,
    pagination,
  };
};

export const loginSuccess = (
  message: string,
  data: loginData,
  token: string,
) => {
  return {
    success: true,
    message: message || 'success',
    data,
    token,
  };
};

export const failed = <T>(message: string, data?: T) => {
  return {
    success: false,
    message: message || 'fail',
    data,
  };
};
