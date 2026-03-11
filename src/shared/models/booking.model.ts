import { BookingStatus } from '../enums/booking-status.enum';

export class BookingModel {
  id?: string;
  bookId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  createdAt?: Date;
  updatedAt?: Date;
}
