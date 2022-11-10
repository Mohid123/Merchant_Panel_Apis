import { Model } from 'mongoose';
import { SubCategoryInterface } from '../../interface/category/subcategory.interface';
import { CategoryInterface } from '../../interface/category/category.interface';
import { affiliateCategoryInterface } from 'src/interface/category/affiliatecategory.interface';
import { AffiliateSubCategoryInterface } from 'src/interface/category/affiliatesubcategory.interface';
export declare class CategoryService {
    private readonly categoryModel;
    private readonly subCategoryModel;
    private readonly affiliateCategoryModel;
    private readonly affiliateSubCategoryModel;
    constructor(categoryModel: Model<CategoryInterface>, subCategoryModel: Model<SubCategoryInterface>, affiliateCategoryModel: Model<affiliateCategoryInterface>, affiliateSubCategoryModel: Model<AffiliateSubCategoryInterface>);
    createCategory(categoryDto: any): Promise<CategoryInterface & {
        _id: string;
    }>;
    createAffiliateCategory(categoryDto: any): Promise<import("mongoose").Document<unknown, any, affiliateCategoryInterface> & affiliateCategoryInterface & {
        _id: string;
    }>;
    createSubCategory(subCategoryDto: any): Promise<import("mongoose").Document<unknown, any, SubCategoryInterface> & SubCategoryInterface & {
        _id: string;
    }>;
    createAffiliateSubCategory(subCategoryDto: any): Promise<import("mongoose").Document<unknown, any, AffiliateSubCategoryInterface> & AffiliateSubCategoryInterface & {
        _id: string;
    }>;
    getAllCategories(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllAffiliateCategories(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllAffiliateSubCategoriesByAffiliateCategories(affiliateCategoryName: any, offset: any, limit: any): Promise<any[]>;
    getAllSubCategoriesByCategories(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllSubCategoriesByMerchant(offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
