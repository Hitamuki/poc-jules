import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator to mark a route or controller as public.
 * Public routes will bypass the global JwtAuthGuard.
 *
 * @example
 * // Public route in a controller
 * @Public()
 * @Get('some-public-endpoint')
 * getPublicResource() { ... }
 *
 * // Entire controller is public
 * @Public()
 * @Controller('public-stuff')
 * export class PublicController { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
