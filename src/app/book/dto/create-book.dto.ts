import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  subtitle: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  authors: string[];

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  translators: string[];

  @IsString()
  @IsNotEmpty()
  category: string;

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
