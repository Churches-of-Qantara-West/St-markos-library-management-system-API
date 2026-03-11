import { IsDateString, IsString, ValidateIf } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  bookId: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  @ValidateIf((o) => {
    if (o.endDate <= o.startDate) {
      throw new Error('endDate must be after startDate');
    }
    return true;
  })
  endDate: Date;
}
