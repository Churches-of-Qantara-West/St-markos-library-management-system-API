import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DailyHealthService } from './Infrastructure/healthCheck/mongodb';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // Manually trigger the daily MongoDB health check on application startup
  const dailyHealthService: DailyHealthService = app.get(DailyHealthService);
  await dailyHealthService.runDailyCheckMongoDb();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
