import { Injectable } from '@nestjs/common';
import logger from '@bookmark-todo-app/logger';

@Injectable()
export class AppService {
  getHealth(): { status: string; timestamp: string } {
    // This is a basic health check.
    // In a real application, you might want to check database connectivity,
    // external service availability, etc.
    logger.debug('AppService.getHealth() called.');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
