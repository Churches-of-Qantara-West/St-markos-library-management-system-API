import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SearchBookingDto } from 'src/app/book/dto/search-book.dto';
import { Book } from '../schemas/book.schemas';
import { BookModel } from '../models/book.model';

export class BookRepository {
  readonly searchableFields = ['title', 'authors', 'translators', 'publishers'];

  constructor(@InjectModel(Book.name) private readonly bookModel: Model<Book>) {}

  async create(book: BookModel): Promise<BookModel> {
    const bookData: Omit<BookModel, 'categoryId'> & { categoryId: Types.ObjectId } = {
      ...book,
      categoryId: new Types.ObjectId(book.categoryId),
    };
    const createdBook: Book | null = await this.bookModel.create(bookData as any);
    return this.mapToModel(createdBook);
  }

  async findAll(): Promise<BookModel[]> {
    const books: Book[] = await this.bookModel.find().exec();
    return books.map((book) => this.mapToModel(book));
  }

  async findById(id: string): Promise<BookModel | null> {
    const book: Book | null = await this.bookModel.findById(id).exec();
    if (!book) {
      return null;
    }
    return this.mapToModel(book);
  }

  async findByTitle(title: string): Promise<BookModel | null> {
    const book: Book | null = await this.bookModel.findOne({ title: title }).exec();
    if (!book) {
      return null;
    }
    return this.mapToModel(book);
  }

  async findByCategoryId(categoryId: string): Promise<BookModel[]> {
    const filter: Record<string, unknown> = { categoryId };
    const books: Book[] = await this.bookModel.find(filter).exec();
    return books.map((book) => this.mapToModel(book));
  }

  async update(id: string, book: Partial<BookModel>): Promise<BookModel | null> {
    const updateData = { ...book };
    if (updateData.categoryId) {
      updateData.categoryId = new Types.ObjectId(updateData.categoryId) as any;
    }
    const updatedBook: Book | null = await this.bookModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!updatedBook) {
      return null;
    }
    return this.mapToModel(updatedBook);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.bookModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  async search(searchParams: SearchBookingDto): Promise<BookModel[]> {
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

  private mapToModel(bookDoc: Book): BookModel {
    return {
      id: bookDoc._id?.toString(),
      image: bookDoc.image,
      title: bookDoc.title,
      subtitle: bookDoc.subtitle,
      authors: bookDoc.authors,
      translators: bookDoc.translators,
      categoryId: bookDoc.categoryId?.toString(),
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
