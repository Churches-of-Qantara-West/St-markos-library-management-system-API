import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { BookService } from './services/book.service';
import { CreateBookingDto } from './dto/create-book.dto';
import { UpdateBookingDto } from './dto/update-book.dto';
import { SearchBookingDto } from './dto/search-book.dto';
import { BookModel } from '../../shared/models/book.model';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';
import { RolesGuard } from '../Auth/guards/roles.guard';
import { Roles } from '../Auth/decorators/roles.decorator';
import { UserRoles } from '../../shared/enums/user-rols.enum';

@Controller('book')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @Roles(UserRoles.ADMIN)
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
  @Roles(UserRoles.ADMIN)
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookingDto): Promise<BookModel | null> {
    return this.bookService.update(id, updateBookDto);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN)
  remove(@Param('id') id: string): Promise<boolean> {
    return this.bookService.remove(id);
  }
}
