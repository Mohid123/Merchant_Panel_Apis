import { Model } from 'mongoose';
import { SubCategoryInterface } from '../../interface/category/subcategory.interface';
import { CategoryInterface } from '../../interface/category/category.interface';
export declare class CategoryService {
    private readonly categoryModel;
    private readonly subCategoryModel;
    constructor(categoryModel: Model<CategoryInterface>, subCategoryModel: Model<SubCategoryInterface>);
    createCategory(categoryDto: any): Promise<CategoryInterface & {
        _id: string;
    }>;
    createSubCategory(subCategoryDto: any): Promise<import("mongoose").Document<unknown, any, SubCategoryInterface> & SubCategoryInterface & {
        _id: string;
    }>;
    getAllCategories(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllSubCategoriesByCategories(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllSubCategoriesByMerchant(offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
