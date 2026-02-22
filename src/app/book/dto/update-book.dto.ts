import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-book.dto';

export class UpdateBookingDto extends PartialType(CreateBookingDto) {}
