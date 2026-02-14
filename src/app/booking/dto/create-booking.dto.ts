import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  @IsNotEmpty()
  authors: string;

  @IsString()
  translators: string;

  @IsString()
  @IsNotEmpty()
  categories: string;

  @IsString()
  series: string;

  @IsString()
  numberInSeries: string;

  @IsString()
  @IsNotEmpty()
  publishers: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  pages: number;

  @IsNumber()
  @IsNotEmpty()
  numberOfCopies: number;
}
