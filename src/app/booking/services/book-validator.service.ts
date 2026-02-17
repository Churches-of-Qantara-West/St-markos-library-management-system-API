import { BadRequestException, Injectable } from '@nestjs/common';
import { BookModel } from 'src/shared/models/booking.model';
import { BookRepository } from 'src/shared/repositories/booking.repository';

@Injectable()
export class BookingValidatorService {
  constructor(private readonly bookRepository: BookRepository) {}

  async validateBookTitleNotExists(title: string): Promise<void> {
    const existingBooks = await this.bookRepository.findByTitle(title);
    if (existingBooks) {
      throw new BadRequestException(`A book with the title "${title}" already exists.`);
    }
  }

  validateBookExists(book: BookModel | null, id: string): asserts book is BookModel {
    if (!book) {
      throw new BadRequestException(`The specified book with ID "${id}" does not exist.`);
    }
  }
}
