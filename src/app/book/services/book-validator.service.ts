import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { BookModel } from 'src/shared/models/book.model';
import { BookRepository } from 'src/shared/repositories/book.repository';
import { CategoryRepository } from 'src/shared/repositories/category.repository';

@Injectable()
export class BookingValidatorService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async validateBookTitleNotExists(title: string): Promise<void> {
    const existingBooks = await this.bookRepository.findByTitle(title);
    if (existingBooks) {
      throw new BadRequestException(`A book with the title "${title}" already exists.`);
    }
  }

  async validateCategoryExists(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new NotFoundException(`Category with ID "${categoryId}" does not exist.`);
    }
  }

  async validateAndGetCategoryByName(categoryName: string) {
    const category = await this.categoryRepository.findByName(categoryName);
    if (!category) {
      throw new NotFoundException(`Category with name "${categoryName}" does not exist.`);
    }
    return category;
  }

  validateBookExists(book: BookModel | null, id: string): asserts book is BookModel {
    if (!book) {
      throw new BadRequestException(`The specified book with ID "${id}" does not exist.`);
    }
  }
}
