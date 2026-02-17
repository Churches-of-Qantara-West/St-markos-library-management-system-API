import { Module } from '@nestjs/common';
import { DailyHealthService } from './healthCheck/mongodb';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    TerminusModule,
  ],
  providers: [DailyHealthService],
  exports: [DailyHealthService],
})
export class InfrastructureModule {}
