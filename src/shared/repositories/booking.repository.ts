import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Booking } from '../schemas/booking.schemas';
import { BookingModel } from '../models/booking.model';
import { SearchBookingDto } from 'src/app/booking/dto/search-booking.dto';

export class BookingRepository {
  readonly searchableFields = [
    'title',
    'categories',
    'authors',
    'translators',
    'publishers',
  ];

  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
  ) {}

  async create(booking: BookingModel): Promise<BookingModel> {
    const createdBooking: Booking | null =
      await this.bookingModel.create(booking);
    return this.mapToModel(createdBooking);
  }

  async findAll(): Promise<BookingModel[]> {
    const bookings: Booking[] = await this.bookingModel.find().exec();
    return bookings.map((booking) => this.mapToModel(booking));
  }

  async findById(id: string): Promise<BookingModel | null> {
    const booking: Booking | null = await this.bookingModel.findById(id).exec();
    if (!booking) {
      return null;
    }
    return this.mapToModel(booking);
  }

  async update(
    id: string,
    booking: Partial<BookingModel>,
  ): Promise<BookingModel | null> {
    const updatedBooking: Booking | null = await this.bookingModel
      .findByIdAndUpdate(id, booking, { new: true })
      .exec();
    if (!updatedBooking) {
      return null;
    }
    return this.mapToModel(updatedBooking);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bookingModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async search(searchParams: SearchBookingDto): Promise<BookingModel[]> {
    const query = this.searchableFields.reduce(
      (acc, field) => {
        const value = searchParams[field as keyof SearchBookingDto];
        if (value) {
          acc[field] = { $regex: value, $options: 'i' };
        }
        return acc;
      },
      {} as Record<string, any>,
    );

    const bookings = await this.bookingModel.find(query).exec();
    return bookings.map(this.mapToModel.bind(this));
  }

  private mapToModel(bookingDoc: Booking): BookingModel {
    return {
      id: bookingDoc._id?.toString(),
      image: bookingDoc.image,
      title: bookingDoc.title,
      subtitle: bookingDoc.subtitle,
      authors: bookingDoc.authors,
      translators: bookingDoc.translators,
      categories: bookingDoc.categories,
      series: bookingDoc.series,
      numberInSeries: bookingDoc.numberInSeries,
      publishers: bookingDoc.publishers,
      description: bookingDoc.description,
      pages: bookingDoc.pages,
      numberOfCopies: bookingDoc.numberOfCopies,
      createdAt: bookingDoc.createdAt,
      updatedAt: bookingDoc.updatedAt,
    };
  }
}
