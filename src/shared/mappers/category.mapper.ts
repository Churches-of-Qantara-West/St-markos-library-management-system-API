import { CreateCategoryDto } from 'src/app/category/dto/create-category.dto';
import { UpdateCategoryDto } from 'src/app/category/dto/update-category.dto';
import { CategoryModel } from '../models/category.model';

export class CategoryMapper {
  static createDtoToModel(dto: CreateCategoryDto): CategoryModel {
    return {
      name: dto.name,
      description: dto.description,
      imageUrl: dto.imageUrl,
    };
  }

  static updateDtoToModel(dto: UpdateCategoryDto, existingCategory: CategoryModel): Partial<CategoryModel> {
    return {
      name: dto.name || existingCategory.name,
      description: dto.description || existingCategory.description,
      imageUrl: dto.imageUrl || existingCategory.imageUrl,
    };
  }
}
