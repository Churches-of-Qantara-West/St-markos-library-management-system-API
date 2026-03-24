import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { BookingRepository } from '../../../shared/repositories/booking.repository';
import { BookingMapper } from '../../../shared/mappers/booking.mapper';
import { BookingValidatorService } from './booking-validator.service';
import { BookingModel } from '../../../shared/models/booking.model';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookingRepository: BookingRepository,
    private readonly bookingValidatorService: BookingValidatorService,
  ) {}

  async create(createBookingDto: CreateBookingDto, userId: string): Promise<BookingModel> {
    // 1- Validate that the book exists
    await this.bookingValidatorService.validateBookExists(createBookingDto.bookId);

    // 2- validate that the user does not have an action booking for the same book
    await this.bookingValidatorService.validateNoActionBookingForBook(createBookingDto.bookId, userId);

    // 2- Map the DTO to the BookingModel entity with authenticated user ID
    const bookingModel = BookingMapper.createDtoToModel(createBookingDto, userId);

    // 3- Create the booking
    return await this.bookingRepository.create(bookingModel);
  }

  // This method is used to get all bookings for the authenticated user
  async findAllBookingsForSpecificUser(userId: string): Promise<BookingModel[]> {
    return await this.bookingRepository.findAllByUserId(userId);
  }

  // get all bookings
  async findAllBookings(): Promise<BookingModel[]> {
    return await this.bookingRepository.findAll();
  }

  async findOne(id: string): Promise<BookingModel | null> {
    // 1- Retrieve the booking from the repository
    const booking: BookingModel | null = await this.bookingRepository.findById(id);

    // 2- Validate that the booking exists
    this.bookingValidatorService.validateBookingExists(booking, id);

    // 3- Return the found booking
    return booking;
  }

  async acceptBookingRequest(id: string): Promise<BookingModel | null> {
    // 1- Check if the booking exists
    const existingBooking: BookingModel | null = await this.bookingRepository.findById(id);
    this.bookingValidatorService.validateBookingExists(existingBooking, id);

    // 2- accept the booking request
    return await this.bookingRepository.update(id);
  }

  async remove(id: string, userId: string): Promise<boolean> {
    // 1- Validate that the booking exists before attempting to delete
    const existingBooking: BookingModel | null = await this.bookingRepository.findById(id);
    this.bookingValidatorService.validateBookingExists(existingBooking, id);

    // 2- Delete the booking from the repository
    return this.bookingRepository.delete(id);
  }
}
