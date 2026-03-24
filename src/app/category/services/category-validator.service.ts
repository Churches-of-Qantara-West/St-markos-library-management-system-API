import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoryModel } from '../../../shared/models/category.model';

@Injectable()
export class CategoryValidatorService {
  validateCategoryExists(category: CategoryModel | null, id: string): asserts category is CategoryModel {
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }

  async validateCategoryNameNotExists(categoryRepository: any, name: string): Promise<void> {
    const existingCategory = await categoryRepository.findByName(name);
    if (existingCategory) {
      throw new ConflictException(`Category with name '${name}' already exists`);
    }
  }
}
