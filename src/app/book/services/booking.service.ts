import { Injectable } from '@nestjs/common';
import { UpdateBookingDto } from '../dto/update-book.dto';
import { SearchBookingDto } from '../dto/search-book.dto';
import { BookRepository } from 'src/shared/repositories/book.repository';
import { BookModel } from 'src/shared/models/booking.model';
import { BookMapper } from 'src/shared/mappers/book.mapper';
import { BookingValidatorService } from './book-validator.service';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookValidatorService: BookingValidatorService,
  ) {}

  async create(createBookDto: BookModel): Promise<BookModel> {
    // 1- Validate that the book title does not already exist
    await this.bookValidatorService.validateBookTitleNotExists(createBookDto.title);

    // 2- Map the DTO to the BookModel entity
    const bookEntity = BookMapper.createDtoToModel(createBookDto);

    // 3- Create the book in the repository
    return await this.bookRepository.create(bookEntity);
  }

  async findAll(): Promise<BookModel[]> {
    return await this.bookRepository.findAll();
  }

  async findOne(id: string): Promise<BookModel | null> {
    // 1- Retrieve the book from the repository
    const book: BookModel | null = await this.bookRepository.findById(id);

    // 2- Validate that the book exists
    this.bookValidatorService.validateBookExists(book, id);

    // 3- Return the found book
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookingDto): Promise<BookModel | null> {
    // 1- Check if the book exists
    const existingBook: BookModel | null = await this.bookRepository.findById(id);
    this.bookValidatorService.validateBookExists(existingBook, id);
    // 2- If the title is being updated, validate that the new title does not already exist
    if (updateBookDto.title && updateBookDto.title !== existingBook.title) {
      await this.bookValidatorService.validateBookTitleNotExists(updateBookDto.title);
    }

    // 3- Map the update DTO to the existing book entity
    const bookEntity = BookMapper.updateDtoToModel(updateBookDto, existingBook);
    return await this.bookRepository.update(id, bookEntity);
  }

  async remove(id: string): Promise<boolean> {
    // 1- Validate that the book exists before attempting to delete
    const existingBook: BookModel | null = await this.bookRepository.findById(id);
    this.bookValidatorService.validateBookExists(existingBook, id);

    // 2- Delete the book from the repository
    return this.bookRepository.delete(id);
  }

  async searchBooks(searchParams: SearchBookingDto): Promise<BookModel[]> {
    return this.bookRepository.search(searchParams);
  }
}
