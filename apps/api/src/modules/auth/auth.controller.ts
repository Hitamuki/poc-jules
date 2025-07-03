import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException, Get, UseGuards, Request as NestRequest } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginSchema, RegisterSchema, type LoginInput, type RegisterInput } from '@bookmark-todo-app/zod-schemas/auth';
import { Public } from './decorators/public.decorator';
// JwtAuthGuard is now global, so no need to apply it here unless for specific override logic not covered by @Public
// import { JwtAuthGuard } from './guards/jwt-auth.guard';
import logger from '@bookmark-todo-app/logger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public() // This route is exempt from the global JwtAuthGuard
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: unknown) {
    const validationResult = LoginSchema.safeParse(loginDto);
    if (!validationResult.success) {
      logger.warn('Login validation failed', { errors: validationResult.error.issues });
      throw new BadRequestException({ message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors });
    }
    return this.authService.login(validationResult.data as LoginInput);
  }

  @Public() // This route is exempt from the global JwtAuthGuard
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: unknown) {
    const validationResult = RegisterSchema.safeParse(registerDto);
    if (!validationResult.success) {
      logger.warn('Registration validation failed', { errors: validationResult.error.issues });
      throw new BadRequestException({ message: 'Validation failed', errors: validationResult.error.flatten().fieldErrors });
    }
    return this.authService.register(validationResult.data as RegisterInput);
  }

  @Public() // This route is exempt from the global JwtAuthGuard
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body('refreshToken') token: string) {
    if (typeof token !== 'string' || !token) {
      logger.warn('Refresh token attempt with missing token.');
      throw new BadRequestException('Refresh token is required and must be a string.');
    }
    return this.authService.refreshToken(token);
  }

  // This route is protected by the global JwtAuthGuard by default
  // No need for @UseGuards(JwtAuthGuard) here if it's global
  @Get('profile')
  getProfile(@NestRequest() req) {
    logger.info(`Profile requested for user: ${req.user?.email}`);
    return req.user; // req.user is populated by JwtStrategy
  }
}
