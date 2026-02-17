import { Module } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { BookingController } from './booking.controller';
import { SharedModule } from 'src/shared/shared.module';
import { BookingValidatorService } from './services/book-validator.service';

@Module({
  imports: [SharedModule],
  controllers: [BookingController],
  providers: [BookingService, BookingValidatorService],
})
export class BookingModule {}
