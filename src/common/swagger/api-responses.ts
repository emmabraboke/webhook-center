import { ApiResponse } from '@nestjs/swagger';

const TOKEN_EXAMPLE = {
  accessToken: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEifQ.sig',
  refreshToken: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyXzEifQ.ref',
};

export const ApiSuccessResponse = (message: string, data?: unknown, status = 200) =>
  ApiResponse({
    status,
    schema: {
      example: {
        status: 'success',
        message,
        ...(data !== undefined && { data }),
      },
    },
  });

export const ApiCreatedResponse = (message: string, data?: unknown) =>
  ApiSuccessResponse(message, data, 201);

export const ApiTokenResponse = (message: string, data?: unknown, status = 201) =>
  ApiResponse({
    status,
    schema: {
      example: {
        status: 'success',
        message,
        ...(data !== undefined && { data }),
        token: TOKEN_EXAMPLE,
      },
    },
  });

export const ApiPaginatedResponse = (message: string, dataExample: unknown) =>
  ApiResponse({
    status: 200,
    schema: {
      example: {
        status: 'success',
        message,
        data: dataExample,
        pagination: { page: 1, limit: 20, total: 1 },
      },
    },
  });
