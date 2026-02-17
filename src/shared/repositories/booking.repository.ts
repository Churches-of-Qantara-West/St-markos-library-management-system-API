import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book } from '../schemas/booking.schemas';
import { BookingModel } from '../models/booking.model';
import { SearchBookingDto } from 'src/app/booking/dto/search-booking.dto';

export class BookRepository {
  readonly searchableFields = [
    'title',
    'categories',
    'authors',
    'translators',
    'publishers',
  ];

  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  async create(book: BookingModel): Promise<BookingModel> {
    const createdBook: Book | null = await this.bookModel.create(book);
    return this.mapToModel(createdBook);
  }

  async findAll(): Promise<BookingModel[]> {
    const books: Book[] = await this.bookModel.find().exec();
    return books.map((book) => this.mapToModel(book));
  }

  async findById(id: string): Promise<BookingModel | null> {
    const book: Book | null = await this.bookModel.findById(id).exec();
    if (!book) {
      return null;
    }
    return this.mapToModel(book);
  }

  async update(
    id: string,
    book: Partial<BookingModel>,
  ): Promise<BookingModel | null> {
    const updatedBook: Book | null = await this.bookModel
      .findByIdAndUpdate(id, book, { new: true })
      .exec();
    if (!updatedBook) {
      return null;
    }
    return this.mapToModel(updatedBook);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bookModel.findByIdAndDelete(id).exec();
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

    const books = await this.bookModel.find(query).exec();
    return books.map(this.mapToModel.bind(this));
  }

  private mapToModel(bookDoc: Book): BookingModel {
    return {
      id: bookDoc._id?.toString(),
      image: bookDoc.image,
      title: bookDoc.title,
      subtitle: bookDoc.subtitle,
      authors: bookDoc.authors,
      translators: bookDoc.translators,
      categories: bookDoc.categories,
      series: bookDoc.series,
      numberInSeries: bookDoc.numberInSeries,
      publishers: bookDoc.publishers,
      description: bookDoc.description,
      pages: bookDoc.pages,
      numberOfCopies: bookDoc.numberOfCopies,
      createdAt: bookDoc.createdAt,
      updatedAt: bookDoc.updatedAt,
    };
  }
}
