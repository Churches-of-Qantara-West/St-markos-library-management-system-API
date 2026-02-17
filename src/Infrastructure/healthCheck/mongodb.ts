import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HealthCheckService, MongooseHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class DailyHealthService {
  private readonly logger = new Logger(DailyHealthService.name);

  constructor(
    private readonly health: HealthCheckService,
    private readonly mongooseHealth: MongooseHealthIndicator,
  ) {}

  // Schedule the health check to run every day at midnight
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async runDailyCheckMongoDb() {
    try {
      const result = await this.health.check([
        () => this.mongooseHealth.pingCheck('mongodb', { timeout: 3000 }),
      ]);
      this.logger.log(`Daily MongoDB Status: ${result.status.toUpperCase()}`);
    } catch (error) {
      this.logger.error(
        `CRITICAL: Daily MongoDB Health Check Failed: ${error.stack}`,
      );
    }
  }
}
