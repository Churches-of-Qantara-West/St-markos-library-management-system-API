import { Injectable } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SearchBookingDto } from './dto/search-booking.dto';
import { BookRepository } from 'src/shared/repositories/booking.repository';
import { BookingModel } from 'src/shared/models/booking.model';
import { BookingMapper } from 'src/shared/mappers/booking.mapper';

@Injectable()
export class BookingService {
  constructor(private readonly bookRepository: BookRepository) {}

  create(createBookingDto: BookingModel): Promise<BookingModel> {
    const bookEntity = BookingMapper.createDtoToModel(createBookingDto);
    return this.bookRepository.create(bookEntity);
  }

  findAll() {
    return this.bookRepository.findAll();
  }

  findOne(id: string) {
    return this.bookRepository.findById(id);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const existingBooking: BookingModel | null =
      await this.bookRepository.findById(id);
    if (!existingBooking) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    const bookEntity = BookingMapper.updateDtoToModel(
      updateBookingDto,
      existingBooking,
    );
    return this.bookRepository.update(id, bookEntity);
  }

  remove(id: string) {
    return this.bookRepository.delete(id);
  }

  searchBooks(searchParams: SearchBookingDto) {
    return this.bookRepository.search(searchParams);
  }
}
