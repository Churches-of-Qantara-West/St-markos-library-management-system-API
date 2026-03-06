import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../Auth/guards/jwt-auth.guard';

@Controller('booking')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto, req.user.userId);
  }

  @Get('all')
  findAll(@Request() req) {
    return this.bookingService.findAllBookings();
  }

  @Get('all/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.bookingService.findAllBookingsForSpecificUser(userId);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id') id: string) {
    return this.bookingService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(id, updateBookingDto, req.user.userId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.bookingService.remove(id, req.user.userId);
  }
}
