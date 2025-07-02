import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config'; // If using ConfigService
import { AuthService } from '../auth.service'; // To validate the user from payload
import logger from '@bookmark-todo-app/logger';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    // configService: ConfigService, // If using ConfigService
    private readonly authService: AuthService,
  ) {
    // const jwtSecret = configService.get<string>('JWT_SECRET');
    const jwtSecret = process.env.JWT_SECRET || 'THIS_IS_A_DEFAULT_UNSAFE_SECRET_CHANGE_IT_IMMEDIATELY';
    if (jwtSecret === 'THIS_IS_A_DEFAULT_UNSAFE_SECRET_CHANGE_IT_IMMEDIATELY' && process.env.NODE_ENV !== 'test') {
        logger.warn('JwtStrategy initialized with default (unsafe) JWT_SECRET. THIS IS NOT SECURE FOR PRODUCTION.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Ensure expired tokens are rejected
      secretOrKey: jwtSecret, // Secret to verify the token signature
    });
    logger.info('JwtStrategy initialized.');
  }

  /**
   * This method is called by Passport after it has verified the JWT's signature and expiry.
   * The payload is the decoded JWT.
   * @param payload The decoded JWT payload. Expected to contain 'sub' (user ID) and 'email'.
   * @returns The user object (without password) if validation is successful.
   * @throws UnauthorizedException if the user cannot be validated.
   */
  async validate(payload: { sub: string; email: string; username?: string; role?: string }) {
    logger.debug(`JwtStrategy: Validating JWT payload for user email: ${payload.email}, id: ${payload.sub}`);
    // The AuthService's validateJwtPayload method should find the user by ID (payload.sub)
    // and return the user object (without password) or null.
    const user = await this.authService.validateJwtPayload(payload);
    if (!user) {
      logger.warn(`JwtStrategy: JWT validation failed. User not found for id: ${payload.sub} (email: ${payload.email})`);
      throw new UnauthorizedException('Invalid token or user does not exist.');
    }
    // The returned user object will be attached to the Request object as req.user by Passport.
    logger.debug(`JwtStrategy: JWT validation successful for user ${user.email} (ID: ${user.id})`);
    return user;
  }
}
