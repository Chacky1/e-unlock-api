import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  NotFoundException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { ResourceNotFoundError } from '../error/types/resource-not-found.error';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error: Error) => {
        const request = context.switchToHttp().getRequest();
        const requestMethod = request.method;

        if (error instanceof ResourceNotFoundError && requestMethod === 'GET') {
          return throwError(() => {
            const errorMessage = error.message;
            return new NotFoundException(errorMessage);
          });
        }

        if (
          error instanceof ResourceNotFoundError &&
          requestMethod === 'PATCH'
        ) {
          return throwError(() => {
            const errorMessage = error.message;
            return new NotFoundException(errorMessage);
          });
        }

        if (
          error instanceof ResourceNotFoundError &&
          requestMethod === 'POST'
        ) {
          return throwError(() => {
            const errorMessage = error.message;
            return new BadRequestException(errorMessage);
          });
        }

        if (error.message === 'ORDER_USER_ALREADY_HAS_COURSE') {
          return throwError(() => {
            return new BadRequestException(error.message);
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
