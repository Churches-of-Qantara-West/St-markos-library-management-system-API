import { IsOptional, IsString } from 'class-validator';

export class SearchBookingDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  categories?: string;

  @IsOptional()
  @IsString()
  authors?: string;

  @IsOptional()
  @IsString()
  translators?: string;

  @IsOptional()
  @IsString()
  publishers?: string;
}
