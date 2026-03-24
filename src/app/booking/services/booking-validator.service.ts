import { BadRequestException, Injectable } from '@nestjs/common';
import { BookingModel } from '../../../shared/models/booking.model';
import { BookingRepository } from '../../../shared/repositories/booking.repository';
import { BookRepository } from '../../../shared/repositories/book.repository';
import { BookModel } from '../../../shared/models/book.model';

@Injectable()
export class BookingValidatorService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly bookRepository: BookRepository,
  ) {}

  validateBookingExists(booking: BookingModel | null, id: string): asserts booking is BookingModel {
    if (!booking) {
      throw new BadRequestException(`The specified booking with ID "${id}" does not exist.`);
    }
  }

  async validateBookExists(bookId: string): Promise<void> {
    const book: BookModel | null = await this.bookRepository.findById(bookId);
    if (!book) {
      throw new BadRequestException(`The specified book with ID "${bookId}" does not exist.`);
    }
  }

  // validate that there is no ACCEPTED/PENDING booking for the same book and user
  async validateNoActionBookingForBook(bookId: string, userId: string): Promise<void> {
    const activeBooking: BookingModel | null = await this.bookingRepository.findActionBookingForBookAndUser(bookId, userId);
    if (activeBooking) {
      throw new BadRequestException(
        `You already have an active booking for this book with status "${activeBooking.status}". Please wait until it is resolved before creating a new booking for the same book.`,
      );
    }
  }
}
