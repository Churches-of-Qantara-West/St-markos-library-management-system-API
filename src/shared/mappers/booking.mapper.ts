import { CreateBookingDto } from 'src/app/booking/dto/create-booking.dto';
import { UpdateBookingDto } from 'src/app/booking/dto/update-booking.dto';
import { BookingModel } from '../models/booking.model';
import { BookingStatus } from '../enums/booking-status.enum';

export class BookingMapper {
  static createDtoToModel(dto: CreateBookingDto, userId: string): BookingModel {
    return {
      bookId: dto.bookId,
      userId: userId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      status: BookingStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static updateDtoToModel(dto: UpdateBookingDto, existingModel: BookingModel, userId: string): Partial<BookingModel> {
    return {
      bookId: dto.bookId || existingModel.bookId,
      userId: userId,
      startDate: dto.startDate || existingModel.startDate,
      endDate: dto.endDate || existingModel.endDate,
      status: existingModel.status,
      createdAt: existingModel.createdAt,
      updatedAt: new Date(),
    };
  }
}
