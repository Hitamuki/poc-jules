import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import logger from '@bookmark-todo-app/logger';

@Controller() // Base path will be determined by global prefix in main.ts (e.g., /api/v1)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health') // Route: /api/v1/health
  getHealth(): { status: string; timestamp: string; message?: string } {
    logger.info('Health check endpoint was called.');
    try {
      const health = this.appService.getHealth();
      // You could add checks to DB, external services, etc. here
      // For example: await this.prismaService.$queryRaw`SELECT 1`;
      return health;
    } catch (error) {
      logger.error('Health check failed', { error: error instanceof Error ? error.message : String(error) });
      return {
        status: 'error',
        timestamp: new Date().toISOString(),
        message: error instanceof Error ? error.message : 'Unknown error during health check',
      };
    }
  }
}
