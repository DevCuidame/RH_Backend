import { CategoryModel } from "../../data/mongodb";
import { CategoryDto, CategoryEntity, CustomError, UpdateCategoryDto } from "../../domain";
import { CategoryDatasource } from "../../domain/datasources/category.datasource";
import { CategoryMapper } from "../mappers/category.mapper";

export class CategoryDatasourceImpl implements CategoryDatasource {


  async update(updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
     const { id, name } = updateCategoryDto;

    try {
     
      const categoryName = await CategoryModel.findOne(
        {name: name}
      )

      if (categoryName) {
        throw CustomError.badRequest("Category name already exists");
      }

      const category = await CategoryModel.findByIdAndUpdate(
        { _id: id},
        { $set: updateCategoryDto }
      );


      if (!category) {
        throw CustomError.badRequest("Error updating category");
      }

      return updateCategoryDto;
    } catch (error) {
      console.log(error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
  async create(categoryDto: CategoryDto): Promise<CategoryEntity> {
    const { name, status, image } = categoryDto;

    try {
      const exists = await CategoryModel.findOne({
        name: name,
      });
      if (exists) throw CustomError.badRequest("Error creating category");

      const category = await CategoryModel.create({
        name: name,
        status: status,
        image: image,
      });

      await category.save();

      return CategoryMapper.categoryEntityFromObject(category);
    } catch (error) {
      console.log("🚀 ~ CategoryDatasourceImpl ~ create ~ error:", error);
      if (error instanceof CustomError) {
        throw error;
      }
      throw CustomError.internalServer();
    }
  }
}
