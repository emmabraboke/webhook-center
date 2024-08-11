import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { JsonWebTokenError } from 'jsonwebtoken';
import { DBError } from 'objection';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(
    private readonly adapterHost: HttpAdapterHost,
    private logger: Logger,
  ) {
    super(adapterHost.httpAdapter);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let statusCode = exception?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    let message =
      exception?.message || exception?.response?.message || 'error occurred';

    if (exception instanceof DBError) {
      message = 'error occurred';
    }

    if (exception instanceof JsonWebTokenError) {
      statusCode = HttpStatus.FORBIDDEN;
      message = exception.message;
    }

    if (
      exception instanceof SyntaxError ||
      exception instanceof EvalError ||
      exception instanceof RangeError ||
      exception instanceof ReferenceError ||
      exception instanceof TypeError ||
      exception instanceof URIError
    ) {
      statusCode = HttpStatus.BAD_REQUEST;
    }

    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      message = response['message'] || exception.message;

      statusCode = exception.getStatus();
    }

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'error occured';
    }

    this.logger.error(JSON.stringify(exception))

    response.status(statusCode).json({
      statusCode,
      message,
    });
  }
}
