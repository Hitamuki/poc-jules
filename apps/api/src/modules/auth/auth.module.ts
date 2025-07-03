import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import logger from '@bookmark-todo-app/logger';
import { APP_GUARD } from '@nestjs/core'; // For global guard
import { JwtAuthGuard } from './guards/jwt-auth.guard'; // Import the guard

@Module({
  imports: [
    PrismaModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async () => {
        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpiresIn = process.env.JWT_EXPIRATION_TIME || '1h'; // Default to 1 hour

        if (!jwtSecret && process.env.NODE_ENV !== 'test') {
          logger.warn('JWT_SECRET environment variable is not set. Using a default (unsafe) secret for token signing. THIS IS NOT SECURE FOR PRODUCTION.');
        }
        return {
          // Ensure a fallback secret is provided if JWT_SECRET is undefined, to prevent crashes
          secret: jwtSecret || 'THIS_IS_A_DEFAULT_UNSAFE_SECRET_CHANGE_IT_IMMEDIATELY',
          signOptions: { expiresIn: jwtExpiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    // Provide JwtAuthGuard globally. Routes can be marked public using @Public() decorator.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
