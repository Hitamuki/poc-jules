import { Module, OnModuleInit } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config'; // Skipped installation
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import logger from '@bookmark-todo-app/logger';

@Module({
  imports: [
    // ConfigModule.forRoot({ // Installation was skipped, this needs to be uncommented if @nestjs/config is installed
    //   isGlobal: true,
    //   envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    //   ignoreEnvFile: process.env.NODE_ENV === 'production', // In production, rely on environment variables
    // }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  // constructor(private readonly configService: ConfigService) {} // Inject ConfigService if @nestjs/config is used

  async onModuleInit() {
    try {
      const configModule = await import('@nestjs/config');
      if (configModule && configModule.ConfigModule) {
        logger.info('@nestjs/config module is available. Ensure it is correctly set up in AppModule imports if intended for use.');
        // Example: Check if a common env variable is loaded by ConfigService, if it were injected.
        // This is just a hypothetical check as ConfigService isn't injected here without ConfigModule in imports.
        // const appPort = this.configService?.get<string>('API_PORT');
        // logger.info(`API_PORT via ConfigService: ${appPort || 'not available (ConfigService not injected or var not set)'}`);
      }
    } catch (e) {
      logger.warn('@nestjs/config package not found. Environment variables might not be loaded via ConfigModule. Consider `pnpm --filter @bookmark-todo-app/api add @nestjs/config`.');
    }
    // Prisma Client typically loads DATABASE_URL from .env directly via dotenv.
    logger.info(`DATABASE_URL from process.env: ${process.env.DATABASE_URL ? 'Available' : 'Not Set or Not Available'}`);
    logger.info(`API_PORT from process.env: ${process.env.API_PORT || 'Not Set (defaulting to 3001 in main.ts)'}`);
    logger.info(`CORS_ORIGIN from process.env: ${process.env.CORS_ORIGIN || 'Not Set (defaulting to http://localhost:3000 in main.ts)'}`);
  }
}
