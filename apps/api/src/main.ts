import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import logger from '@bookmark-todo-app/logger'; // Shared logger
// import helmet from 'helmet'; // Skipped installation due to tool error

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Adjust for your frontend URL in .env
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // try { // Attempt to import and use helmet if it was installed manually or by other means
  //   const helmet = await import('helmet');
  //   app.use(helmet.default());
  //   logger.info('Helmet security headers enabled.');
  // } catch (e) {
  //   logger.warn('Helmet package not found, skipping security headers. Consider `pnpm add helmet` in apps/api.');
  // }


  const port = process.env.API_PORT || 3001;
  await app.listen(port);
  logger.info(`API application is running on: http://localhost:${port}/${app.getGlobalPrefix()}`);
}
bootstrap().catch(err => {
  logger.error('Error during API bootstrap', { error: err instanceof Error ? err.message : String(err), stack: err instanceof Error ? err.stack : undefined });
  process.exit(1);
});
