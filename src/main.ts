import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DailyHealthService } from './Infrastructure/healthCheck/mongodb';

let app: any;

async function bootstrap() {
  if (app) return app; // reuse cached instance

  app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const dailyHealthService: DailyHealthService = app.get(DailyHealthService);
  await dailyHealthService.runDailyCheckMongoDb();

  await app.init(); // use init() instead of listen() for serverless

  return app;
}

// This is what serverless platforms look for
export const handler = async (req: any, res: any) => {
  const nestApp = await bootstrap();
  nestApp.getHttpAdapter().getInstance()(req, res);
};

// For local development, still start the server normally
if (process.env.NODE_ENV !== 'production') {
  bootstrap().then(nestApp => {
    nestApp.listen(process.env.PORT ?? 3000);
  });
}