import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client'; // Generated by `prisma generate` in `packages/db`
import logger from '@bookmark-todo-app/logger';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      // Prisma log configuration (optional)
      // log: [
      //   { emit: 'event', level: 'query' },
      //   { emit: 'stdout', level: 'info' },
      //   { emit: 'stdout', level: 'warn' },
      //   { emit: 'stdout', level: 'error' },
      // ],
      // errorFormat: 'pretty',
    });
    logger.info('PrismaService has been instantiated.');
  }

  async onModuleInit() {
    logger.info('PrismaService: Attempting to connect to the database...');
    try {
      await this.$connect();
      logger.info('PrismaService: Successfully connected to the database.');

      // Example of Prisma middleware for logging queries (optional)
      // this.$use(async (params, next) => {
      //   const before = Date.now();
      //   const result = await next(params);
      //   const after = Date.now();
      //   if (params.model && params.action) {
      //     logger.debug(`Prisma Query: ${params.model}.${params.action} took ${after - before}ms`);
      //   } else {
      //     logger.debug(`Prisma operation took ${after - before}ms (model/action not specified)`);
      //   }
      //   return result;
      // });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('PrismaService: Failed to connect to the database.', {
        error: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
      });
      // Rethrow the error to ensure NestJS application bootstrap fails if DB connection is critical.
      // This prevents the application from running in a broken state.
      throw new Error(`Failed to connect to database: ${errorMessage}`);
    }
  }

  async onModuleDestroy() {
    logger.info('PrismaService: Disconnecting from the database...');
    try {
      await this.$disconnect();
      logger.info('PrismaService: Successfully disconnected from the database.');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error('PrismaService: Failed to disconnect from the database.', {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
      });
    }
  }

  // Optional: Method for graceful shutdown, can be called from main.ts or AppModule
  // async enableShutdownHooks(app: INestApplication) {
  //   process.on('beforeExit', async () => {
  //     logger.info('Received beforeExit signal, closing application...');
  //     await app.close(); // This will trigger onModuleDestroy for all modules
  //   });
  //   process.on('SIGINT', async () => {
  //     logger.info('Received SIGINT signal, closing application...');
  //     await app.close();
  //     process.exit(0);
  //   });
  //   process.on('SIGTERM', async () => {
  //     logger.info('Received SIGTERM signal, closing application...');
  //     await app.close();
  //     process.exit(0);
  //   });
  // }
}
