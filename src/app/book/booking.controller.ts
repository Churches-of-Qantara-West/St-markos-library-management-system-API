import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookService } from './services/booking.service';
import { CreateBookingDto } from './dto/create-book.dto';
import { UpdateBookingDto } from './dto/update-book.dto';
import { SearchBookingDto } from './dto/search-book.dto';
import { BookModel } from 'src/shared/models/book.model';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  create(@Body() createBookDto: CreateBookingDto): Promise<BookModel> {
    return this.bookService.create(createBookDto);
  }

  @Get()
  findAll(): Promise<BookModel[]> {
    return this.bookService.findAll();
  }

  @Get('search')
  search(@Query() searchParams: SearchBookingDto): Promise<BookModel[]> {
    return this.bookService.searchBooks(searchParams);
  }

  @Get('category/:categoryId')
  findByCategory(@Param('categoryId') categoryId: string): Promise<BookModel[]> {
    return this.bookService.findByCategory(categoryId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookModel | null> {
    return this.bookService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookingDto): Promise<BookModel | null> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.bookService.remove(id);
  }
}
