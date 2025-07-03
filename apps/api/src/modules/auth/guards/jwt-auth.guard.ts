import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import logger from '@bookmark-todo-app/logger';
import { Observable } from 'rxjs'; // Required for canActivate return type

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // Check method decorator
      context.getClass(),   // Check class decorator
    ]);

    const request = context.switchToHttp().getRequest();
    const path = request.url;
    const method = request.method;

    if (isPublic) {
      logger.debug(`JwtAuthGuard: Route ${method} ${path} is public, access granted.`);
      return true; // Grant access if @Public() is used
    }

    logger.debug(`JwtAuthGuard: Route ${method} ${path} is protected, proceeding with JWT validation.`);
    // For non-public routes, delegate to the Passport 'jwt' strategy via super.canActivate()
    return super.canActivate(context);
  }

  // Optional: Override handleRequest to customize error handling or logging
  // This method is called after canActivate and the Passport strategy's validate method.
  handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
    const request = context.switchToHttp().getRequest();
    const path = request.url;
    const method = request.method;

    if (err || !user) {
      let errorMessage = 'User is not authenticated.';
      if (info instanceof Error) {
        errorMessage = info.message;
      } else if (typeof info === 'string') {
        errorMessage = info;
      } else if (info && typeof info.message === 'string') {
        errorMessage = info.message;
      }

      logger.warn(`JwtAuthGuard: Authentication failed for ${method} ${path}. Error: ${err || errorMessage}`, {
        errorDetail: err,
        infoDetail: info,
        userFound: !!user,
      });
      throw err || new UnauthorizedException(errorMessage);
    }

    logger.debug(`JwtAuthGuard: Authentication successful for ${method} ${path}. User ID: ${user.id}`);
    return user; // Attach user to request (req.user)
  }
}
