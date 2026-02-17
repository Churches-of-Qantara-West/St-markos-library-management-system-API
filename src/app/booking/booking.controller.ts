import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { SearchBookingDto } from './dto/search-booking.dto';
import { BookModel } from 'src/shared/models/booking.model';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto): Promise<BookModel> {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  findAll(): Promise<BookModel[]> {
    return this.bookingService.findAll();
  }

  @Get('search')
  search(@Query() searchParams: SearchBookingDto): Promise<BookModel[]> {
    return this.bookingService.searchBooks(searchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookModel | null> {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto): Promise<BookModel | null> {
    return this.bookingService.update(id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<boolean> {
    return this.bookingService.remove(id);
  }
}
