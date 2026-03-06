import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { BookingModel } from '../models/booking.model';
import { Booking } from '../schemas/booking.schemas';

export class BookingRepository {
  constructor(@InjectModel(Booking.name) private readonly bookingModel: Model<Booking>) {}

  async create(booking: BookingModel): Promise<BookingModel> {
    const createdBooking: Booking | null = await this.bookingModel.create(booking);
    return this.mapToModel(createdBooking);
  }

  async findAll(): Promise<BookingModel[]> {
    const bookings: Booking[] = await this.bookingModel.find().exec();
    return bookings.map((booking) => this.mapToModel(booking));
  }

  async findAllByUserId(userId: string): Promise<BookingModel[]> {
    const bookings: Booking[] = await this.bookingModel.find({ userId: userId }).exec();
    return bookings.map((booking) => this.mapToModel(booking));
  }

  async findById(id: string): Promise<BookingModel | null> {
    const booking: Booking | null = await this.bookingModel.findById(id).exec();
    if (!booking) {
      return null;
    }
    return this.mapToModel(booking);
  }

  async findByUserId(userId: string): Promise<BookingModel[]> {
    const bookings: Booking[] = await this.bookingModel.find({ userId: userId }).exec();
    return bookings.map((booking) => this.mapToModel(booking));
  }

  async findByBookId(bookId: string): Promise<BookingModel[]> {
    const bookings: Booking[] = await this.bookingModel.find({ bookId: bookId }).exec();
    return bookings.map((booking) => this.mapToModel(booking));
  }

  async update(id: string): Promise<BookingModel | null> {
    const updatedBooking: Booking | null = await this.bookingModel.findByIdAndUpdate(id, { status: 'ACCEPTED' }, { new: true }).exec();
    if (!updatedBooking) {
      return null;
    }
    return this.mapToModel(updatedBooking);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  // check if there is an ACCEPTED/PENDING booking for the same book and user
  async findActionBookingForBookAndUser(bookId: string, userId: string): Promise<BookingModel | null> {
    const activeBooking: Booking | null = await this.bookingModel
      .findOne({
        bookId: bookId,
        userId: userId,
        status: { $in: ['PENDING', 'ACCEPTED'] },
      })
      .exec();
    if (!activeBooking) {
      return null;
    }
    return this.mapToModel(activeBooking);
  }

  private mapToModel(bookingDoc: Booking): BookingModel {
    return {
      id: bookingDoc._id?.toString(),
      bookId: bookingDoc.bookId,
      userId: bookingDoc.userId,
      startDate: bookingDoc.startDate,
      endDate: bookingDoc.endDate,
      status: bookingDoc.status,
      createdAt: bookingDoc.createdAt,
      updatedAt: bookingDoc.updatedAt,
    };
  }
}
