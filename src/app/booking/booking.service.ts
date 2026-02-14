import { Injectable } from '@nestjs/common';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingRepository } from 'src/shared/repositories/booking.repository';
import { BookingModel } from 'src/shared/models/booking.model';
import { BookingMapper } from 'src/shared/mappers/booking.mapper';

@Injectable()
export class BookingService {
  constructor(private readonly bookingRepository: BookingRepository) {}

  create(createBookingDto: BookingModel): Promise<BookingModel> {
    const bookingEntity = BookingMapper.createDtoToModel(createBookingDto);
    return this.bookingRepository.create(bookingEntity);
  }

  findAll() {
    return this.bookingRepository.findAll();
  }

  findOne(id: string) {
    return this.bookingRepository.findById(id);
  }

  async update(id: string, updateBookingDto: UpdateBookingDto) {
    const existingBooking: BookingModel | null =
      await this.bookingRepository.findById(id);
    if (!existingBooking) {
      throw new Error(`Booking with ID ${id} not found`);
    }
    const bookingEntity = BookingMapper.updateDtoToModel(
      updateBookingDto,
      existingBooking,
    );
    return this.bookingRepository.update(id, bookingEntity);
  }

  remove(id: string) {
    return this.bookingRepository.delete(id);
  }
}
