import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryService } from './services/category.service';
import { CategoryController } from './category.controller';
import { Category, CategorySchema } from '../../shared/schemas/category.schemas';
import { CategoryRepository } from '../../shared/repositories/category.repository';
import { CategoryValidatorService } from './services/category-validator.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, CategoryValidatorService],
  exports: [CategoryRepository],
})
export class CategoryModule {}
