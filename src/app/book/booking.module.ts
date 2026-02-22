import { Module } from '@nestjs/common';
import { BookService } from './services/booking.service';
import { BookController } from './booking.controller';
import { SharedModule } from 'src/shared/shared.module';
import { BookingValidatorService } from './services/book-validator.service';

@Module({
  imports: [SharedModule],
  controllers: [BookController],
  providers: [BookService, BookingValidatorService],
})
export class BookModule {}
