import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { ResourceNotFoundError } from '../../../../shared/error/types/resource-not-found.error';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error: Error) => {
        if (error instanceof ResourceNotFoundError) {
          return throwError(() => {
            const errorMessage = error.message;
            return new BadRequestException(errorMessage);
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
