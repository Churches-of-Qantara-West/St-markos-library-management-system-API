import { Injectable } from '@nestjs/common';
import { UpdateBookingDto } from '../dto/update-booking.dto';
import { SearchBookingDto } from '../dto/search-booking.dto';
import { BookRepository } from 'src/shared/repositories/booking.repository';
import { BookModel } from 'src/shared/models/booking.model';
import { BookingMapper } from 'src/shared/mappers/booking.mapper';
import { BookingValidatorService } from './book-validator.service';

@Injectable()
export class BookingService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookingValidatorService: BookingValidatorService,
  ) {}

  async create(createBookingDto: BookModel): Promise<BookModel> {
    // 1- Validate that the book title does not already exist
    await this.bookingValidatorService.validateBookTitleNotExists(createBookingDto.title);

    // 2- Map the DTO to the BookModel entity
    const bookEntity = BookingMapper.createDtoToModel(createBookingDto);

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
    this.bookingValidatorService.validateBookExists(book, id);

    // 3- Return the found book
    return book;
  }

  async update(id: string, updateBookingDto: UpdateBookingDto): Promise<BookModel | null> {
    // 1- Check if the booking exists
    const existingBooking: BookModel | null = await this.bookRepository.findById(id);
    this.bookingValidatorService.validateBookExists(existingBooking, id);

    // 2- If the title is being updated, validate that the new title does not already exist
    if (updateBookingDto.title && updateBookingDto.title !== existingBooking.title) {
      await this.bookingValidatorService.validateBookTitleNotExists(updateBookingDto.title);
    }

    // 3- Map the update DTO to the existing booking entity
    const bookEntity = BookingMapper.updateDtoToModel(updateBookingDto, existingBooking);
    return await this.bookRepository.update(id, bookEntity);
  }

  async remove(id: string): Promise<boolean> {
    // 1- Validate that the book exists before attempting to delete
    const existingBook: BookModel | null = await this.bookRepository.findById(id);
    this.bookingValidatorService.validateBookExists(existingBook, id);

    // 2- Delete the book from the repository
    return this.bookRepository.delete(id);
  }

  async searchBooks(searchParams: SearchBookingDto): Promise<BookModel[]> {
    return this.bookRepository.search(searchParams);
  }
}
