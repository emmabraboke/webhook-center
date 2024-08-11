import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor {
  constructor(private logger: Logger) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl } = request;
    this.logger.log(`Request ${method} ${originalUrl} received`);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `Response sent for ${method} ${originalUrl}  ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
