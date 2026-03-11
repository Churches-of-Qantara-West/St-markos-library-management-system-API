import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from '../schemas/category.schemas';
import { CategoryModel } from '../models/category.model';

export class CategoryRepository {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {}

  async create(category: CategoryModel): Promise<CategoryModel> {
    const createdCategory: Category | null = await this.categoryModel.create(category);
    return this.mapToModel(createdCategory);
  }

  async findAll(): Promise<CategoryModel[]> {
    const categories: Category[] = await this.categoryModel.find().exec();
    return categories.map((category) => this.mapToModel(category));
  }

  async findById(id: string): Promise<CategoryModel | null> {
    const category: Category | null = await this.categoryModel.findById(id).exec();
    if (!category) {
      return null;
    }
    return this.mapToModel(category);
  }

  async findByName(name: string): Promise<CategoryModel | null> {
    const category: Category | null = await this.categoryModel.findOne({ name: name }).exec();
    if (!category) {
      return null;
    }
    return this.mapToModel(category);
  }

  async update(id: string, category: Partial<CategoryModel>): Promise<CategoryModel | null> {
    const updatedCategory: Category | null = await this.categoryModel.findByIdAndUpdate(id, category, { new: true }).exec();
    if (!updatedCategory) {
      return null;
    }
    return this.mapToModel(updatedCategory);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.categoryModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private mapToModel(category: Category): CategoryModel {
    return {
      id: category._id.toString(),
      name: category.name,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }
}
