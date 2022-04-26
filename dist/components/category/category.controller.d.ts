/// <reference types="mongoose" />
import { CategoryService } from './category.service';
import { CategoryDto } from '../../dto/category/category.dto';
import { SubCategoryDTO } from 'src/dto/category/subcategory.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    createCategory(categoryDto: CategoryDto): Promise<import("../../interface/category/category.interface").CategoryInterface & {
        _id: string;
    }>;
    createSubCategory(subCategoryDto: SubCategoryDTO): Promise<import("mongoose").Document<unknown, any, import("../../interface/category/subcategory.interface").SubCategoryInterface> & import("../../interface/category/subcategory.interface").SubCategoryInterface & {
        _id: string;
    }>;
    getAllCategories(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllSubCategories(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
