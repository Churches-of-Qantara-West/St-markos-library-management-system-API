import { Injectable } from '@nestjs/common';
import { UpdateBookingDto } from '../dto/update-book.dto';
import { CreateBookingDto } from '../dto/create-book.dto';
import { SearchBookingDto } from '../dto/search-book.dto';
import { BookRepository } from 'src/shared/repositories/book.repository';
import { BookModel } from 'src/shared/models/book.model';
import { BookMapper } from 'src/shared/mappers/book.mapper';
import { BookingValidatorService } from './book-validator.service';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly bookValidatorService: BookingValidatorService,
  ) {}

  async create(createBookDto: CreateBookingDto): Promise<BookModel> {
    // 1- Validate that the book title does not already exist
    await this.bookValidatorService.validateBookTitleNotExists(createBookDto.title);

    // 2- Validate that the category exists and get its ID
    const category = await this.bookValidatorService.validateAndGetCategoryByName(createBookDto.category);

    // 3- Map the DTO to the BookModel entity with categoryId
    const bookEntity = BookMapper.createDtoToModel({ ...createBookDto, categoryId: category.id! });

    // 4- Create the book in the repository
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

    // 3- If the category is being updated, validate that the category exists and get its ID
    let categoryId = existingBook.categoryId;
    if (updateBookDto.category) {
      const category = await this.bookValidatorService.validateAndGetCategoryByName(updateBookDto.category);
      categoryId = category.id!;
    }

    // 4- Map the update DTO to the existing book entity
    const bookEntity = BookMapper.updateDtoToModel({ ...updateBookDto, categoryId }, existingBook);
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

  async findByCategory(categoryId: string): Promise<BookModel[]> {
    // 1- Validate that the category exists
    await this.bookValidatorService.validateCategoryExists(categoryId);

    // 2- Get all books for this category
    return await this.bookRepository.findByCategoryId(categoryId);
  }
}
