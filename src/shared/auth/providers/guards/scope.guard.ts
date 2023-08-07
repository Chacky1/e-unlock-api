import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

const SCOPE_SEPARATOR = ' ';

@Injectable()
export class ScopeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredScope = this.reflector.get<string>(
      'scope',
      context.getHandler(),
    );
    if (!requiredScope) {
      return false;
    }

    const { user } = context.switchToHttp().getRequest();
    const userScopes = user.scope.split(SCOPE_SEPARATOR);
    const hasScope = userScopes.includes(requiredScope);

    if (!hasScope) {
      throw new UnauthorizedException(
        "Le client n'a pas les scopes nécessaires pour cette ressource.",
      );
    }

    return true;
  }
}
