import { Injectable } from '@nestjs/common';
import { CategoryRepository } from 'src/shared/repositories/category.repository';
import { CategoryModel } from 'src/shared/models/category.model';
import { CategoryMapper } from 'src/shared/mappers/category.mapper';
import { CategoryValidatorService } from './category-validator.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly categoryValidatorService: CategoryValidatorService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<CategoryModel> {
    // 1- Validate that the category name does not already exist
    await this.categoryValidatorService.validateCategoryNameNotExists(this.categoryRepository, createCategoryDto.name);

    // 2- Map the DTO to the CategoryModel entity
    const categoryEntity = CategoryMapper.createDtoToModel(createCategoryDto);

    // 3- Create the category in the repository
    return await this.categoryRepository.create(categoryEntity);
  }

  async findAll(): Promise<CategoryModel[]> {
    return await this.categoryRepository.findAll();
  }

  async findOne(id: string): Promise<CategoryModel | null> {
    // 1- Retrieve the category from the repository
    const category: CategoryModel | null = await this.categoryRepository.findById(id);

    // 2- Validate that the category exists
    this.categoryValidatorService.validateCategoryExists(category, id);

    // 3- Return the found category
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<CategoryModel | null> {
    // 1- Check if the category exists
    const existingCategory: CategoryModel | null = await this.categoryRepository.findById(id);
    this.categoryValidatorService.validateCategoryExists(existingCategory, id);

    // 2- If the name is being updated, validate that the new name does not already exist
    if (updateCategoryDto.name && updateCategoryDto.name !== existingCategory.name) {
      await this.categoryValidatorService.validateCategoryNameNotExists(this.categoryRepository, updateCategoryDto.name);
    }

    // 3- Map the DTO to a partial CategoryModel entity
    const categoryEntity = CategoryMapper.updateDtoToModel(updateCategoryDto, existingCategory);

    // 4- Update the category in the repository
    return await this.categoryRepository.update(id, categoryEntity);
  }

  async remove(id: string): Promise<{ message: string }> {
    // 1- Check if the category exists
    const existingCategory: CategoryModel | null = await this.categoryRepository.findById(id);
    this.categoryValidatorService.validateCategoryExists(existingCategory, id);

    // 2- Delete the category from the repository
    await this.categoryRepository.delete(id);

    // 3- Return a success message
    return { message: `Category with ID ${id} has been successfully deleted` };
  }
}
