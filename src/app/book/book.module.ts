import { Module } from '@nestjs/common';
import { BookService } from './services/book.service';
import { BookController } from './book.controller';
import { SharedModule } from '../../shared/shared.module';
import { BookingValidatorService } from './services/book-validator.service';

@Module({
  imports: [SharedModule],
  controllers: [BookController],
  providers: [BookService, BookingValidatorService],
})
export class BookModule {}
