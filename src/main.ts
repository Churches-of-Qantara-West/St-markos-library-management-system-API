import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DailyHealthService } from './Infrastructure/healthCheck/mongodb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Manually trigger the daily MongoDB health check on application startup
  const dailyHealthService: DailyHealthService = app.get(DailyHealthService);
  await dailyHealthService.runDailyCheckMongoDb();

  await app.listen(process.env.PORT ?? 3000);
}

// Export bootstrap function for serverless environments
export { bootstrap };

// Call bootstrap for traditional server environments
bootstrap();
