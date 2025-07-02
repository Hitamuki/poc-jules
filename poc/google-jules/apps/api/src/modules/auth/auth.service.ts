import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma/prisma.service';
import type { LoginInput, RegisterInput, AuthTokens } from '@bookmark-todo-app/zod-schemas/auth';
import type { User } from '@prisma/client'; // Make sure this is from the generated client
import logger from '@bookmark-todo-app/logger';

// Attempt to import bcrypt, will be null if not installed
// eslint-disable-next-line @typescript-eslint/no-var-requires
let bcrypt: { hash: (data: any, saltOrRounds: string | number) => Promise<string>; compare: (data: any, encrypted: string) => Promise<boolean> } | null = null;
try {
  bcrypt = require('bcrypt');
} catch (e) {
  logger.error('bcrypt package not found. Password hashing will not work. Please install bcrypt: `pnpm --filter @bookmark-todo-app/api add bcrypt`');
}

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  private readonly jwtRefreshTokenSecret: string;
  private readonly jwtRefreshTokenExpiresIn: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.jwtRefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'DEFAULT_UNSAFE_REFRESH_SECRET_CHANGE_ME_IN_ENV';
    this.jwtRefreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRATION_TIME || '7d';

    if (this.jwtRefreshTokenSecret === 'DEFAULT_UNSAFE_REFRESH_SECRET_CHANGE_ME_IN_ENV' && process.env.NODE_ENV !== 'test') {
      logger.warn('REFRESH_TOKEN_SECRET is not set or using default. This is insecure for production.');
    }
    if (!bcrypt && process.env.NODE_ENV !== 'test') {
        logger.error('AuthService initialized without bcrypt. User registration and login will fail if bcrypt is not installed and available.');
    }
  }

  private async _hashPassword(password: string): Promise<string> {
    if (!bcrypt) {
      logger.error('bcrypt is not available for password hashing. Cannot create user or log in.');
      throw new InternalServerErrorException('Password hashing service is unavailable. Please install bcrypt.');
    }
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  private async _comparePasswords(plain: string, hash: string): Promise<boolean> {
    if (!bcrypt) {
      logger.error('bcrypt is not available for password comparison. Cannot log in.');
      throw new InternalServerErrorException('Password comparison service is unavailable. Please install bcrypt.');
    }
    return bcrypt.compare(plain, hash);
  }


  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Ensure bcrypt is available before trying to compare passwords
    if (user && bcrypt && (await this._comparePasswords(pass, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    if (user && !bcrypt) {
        logger.error(`Cannot validate user ${email} because bcrypt is not available.`);
    }
    return null;
  }

  async login(userInput: LoginInput): Promise<AuthTokens> {
    if (!bcrypt) {
        logger.error('Login attempt failed: bcrypt is not available.');
        throw new InternalServerErrorException('Authentication service is currently unavailable due to a configuration issue (bcrypt missing).');
    }
    const user = await this.validateUser(userInput.email, userInput.password);
    if (!user) {
      logger.warn(`Login attempt failed for email: ${userInput.email} - Invalid credentials or bcrypt issue.`);
      throw new UnauthorizedException('Invalid credentials.');
    }
    logger.info(`User ${user.email} successfully logged in.`);
    return this._generateTokens(user);
  }

  async register(registerInput: RegisterInput): Promise<Omit<User, 'password'>> {
    if (!bcrypt) {
        logger.error('Registration attempt failed: bcrypt is not available.');
        throw new InternalServerErrorException('User registration is currently unavailable due to a configuration issue (bcrypt missing).');
    }
    const existingUserByEmail = await this.prisma.user.findUnique({
      where: { email: registerInput.email },
    });
    if (existingUserByEmail) {
      logger.warn(`Registration attempt failed for email: ${registerInput.email} - Email already exists.`);
      throw new ConflictException('An account with this email already exists.');
    }
    if (registerInput.username) {
        const existingUserByUsername = await this.prisma.user.findUnique({
            where: { username: registerInput.username },
        });
        if (existingUserByUsername) {
            logger.warn(`Registration attempt failed for username: ${registerInput.username} - Username already exists.`);
            throw new ConflictException('This username is already taken.');
        }
    }

    const hashedPassword = await this._hashPassword(registerInput.password);
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: registerInput.email,
          username: registerInput.username,
          password: hashedPassword,
          // role and status will use defaults from Prisma schema
        },
      });
      logger.info(`User ${newUser.email} (ID: ${newUser.id}) successfully registered.`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newUser;
      return result;
    } catch (error) {
      logger.error('Error during user registration in database', {
        errorMessage: error instanceof Error ? error.message : String(error),
        email: registerInput.email,
      });
      // Check for Prisma-specific errors if needed, e.g., unique constraint violation if somehow missed
      throw new InternalServerErrorException('Could not create user account due to a server error.');
    }
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(token, { secret: this.jwtRefreshTokenSecret });
      if (typeof payload !== 'object' || !payload.sub) {
        throw new UnauthorizedException('Invalid refresh token payload.');
      }
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
      if (!user) {
        logger.warn(`Refresh token validation failed: User not found for id ${payload.sub}`);
        throw new UnauthorizedException('Invalid refresh token (user not found).');
      }
      // Potentially check against a list of revoked refresh tokens here if implemented
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      logger.info(`Tokens refreshed for user ${user.email} (ID: ${user.id})`);
      return this._generateTokens(userWithoutPassword);
    } catch (error) {
      logger.error('Refresh token processing failed', {
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      throw new UnauthorizedException('Invalid or expired refresh token.');
    }
  }

  private async _generateTokens(user: Omit<User, 'password'>): Promise<AuthTokens> {
    const payload = { username: user.username, sub: user.id, role: user.role, email: user.email };
    // Access token uses secret from JwtModule.registerAsync
    const accessToken = this.jwtService.sign(payload);
    // Refresh token uses its own secret and expiry
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtRefreshTokenSecret,
      expiresIn: this.jwtRefreshTokenExpiresIn,
    });
    return { accessToken, refreshToken };
  }

  // Called by JwtStrategy to validate the JWT payload
  async validateJwtPayload(payload: { sub: string; email: string; username?: string; role?: string }): Promise<Omit<User, 'password'> | null> {
    // Ensure 'sub' (user ID) exists in the payload
    if (!payload || !payload.sub) {
        logger.warn('JWT validation: Payload or sub missing.');
        return null;
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      // Could add checks here e.g. if user is active, not suspended etc.
      // if (result.status !== UserStatus.ACTIVE) { // Assuming UserStatus enum exists
      //   logger.warn(`JWT validation: User ${result.email} is not active.`);
      //   return null;
      // }
      return result;
    }
    logger.warn(`JWT validation: User not found for id ${payload.sub}.`);
    return null;
  }
}
