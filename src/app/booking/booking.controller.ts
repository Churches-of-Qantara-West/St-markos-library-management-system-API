import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request, Patch } from '@nestjs/common';
import { BookingService } from './services/booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
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
  findAll() {
    return this.bookingService.findAllBookings();
  }

  @Get('all/:userId')
  findAllByUserId(@Param('userId') userId: string) {
    return this.bookingService.findAllBookingsForSpecificUser(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(id);
  }

  @Patch(':id')
  acceptBookingRequest(@Param('id') id: string) {
    return this.bookingService.acceptBookingRequest(id);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.bookingService.remove(id, req.user.userId);
  }
}
