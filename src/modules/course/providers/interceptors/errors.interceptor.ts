import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((error: Error) => {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          return throwError(() => {
            const notFoundResource = error.meta.field_name;
            return new BadRequestException(`${notFoundResource} not found.`);
          });
        }

        return throwError(() => error);
      }),
    );
  }
}
