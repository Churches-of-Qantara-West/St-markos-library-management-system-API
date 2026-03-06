import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { BookingController } from './booking.controller';
import { SharedModule } from 'src/shared/shared.module';
import { BookingValidatorService } from './services/booking-validator.service';
import { AuthModule } from '../Auth/auth.module';

@Module({
  imports: [SharedModule, AuthModule],
  controllers: [BookingController],
  providers: [BookingService, BookingValidatorService],
})
export class BookingModule {}
