import { CreateBookingDto } from 'src/app/book/dto/create-book.dto';
import { BookModel } from '../models/booking.model';
import { UpdateBookingDto } from 'src/app/book/dto/update-book.dto';

export class BookMapper {
  static createDtoToModel(dto: CreateBookingDto): BookModel {
    return {
      image: dto.image,
      title: dto.title,
      subtitle: dto.subtitle,
      authors: dto.authors,
      translators: dto.translators,
      categories: dto.categories,
      series: dto.series,
      numberInSeries: dto.numberInSeries,
      publishers: dto.publishers,
      description: dto.description,
      pages: dto.pages,
      numberOfCopies: dto.numberOfCopies,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  static updateDtoToModel(dto: UpdateBookingDto, existingModel: BookModel): Partial<BookModel> {
    return {
      image: dto.image || existingModel.image,
      title: dto.title || existingModel.title,
      subtitle: dto.subtitle || existingModel.subtitle,
      authors: dto.authors || existingModel.authors,
      translators: dto.translators || existingModel.translators,
      categories: dto.categories || existingModel.categories,
      series: dto.series || existingModel.series,
      numberInSeries: dto.numberInSeries || existingModel.numberInSeries,
      publishers: dto.publishers || existingModel.publishers,
      description: dto.description || existingModel.description,
      pages: dto.pages || existingModel.pages,
      numberOfCopies: dto.numberOfCopies || existingModel.numberOfCopies,
      createdAt: existingModel.createdAt,
      updatedAt: new Date(),
    };
  }
}
