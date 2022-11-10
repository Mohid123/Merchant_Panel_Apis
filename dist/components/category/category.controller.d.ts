/// <reference types="mongoose" />
import { CategoryService } from './category.service';
import { CategoryDto } from '../../dto/category/category.dto';
import { SubCategoryDTO } from '../../dto/category/subcategory.dto';
import { AffiliateCategoryDto } from 'src/dto/category/affiliatecategory.dto';
import { AffiliateSubCategoryDTO } from 'src/dto/category/affiliatesubcategory.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    createCategory(categoryDto: CategoryDto): Promise<import("../../interface/category/category.interface").CategoryInterface & {
        _id: string;
    }>;
    createAffiliateCategory(categoryDto: AffiliateCategoryDto): Promise<import("mongoose").Document<unknown, any, import("../../interface/category/affiliatecategory.interface").affiliateCategoryInterface> & import("../../interface/category/affiliatecategory.interface").affiliateCategoryInterface & {
        _id: string;
    }>;
    createSubCategory(subCategoryDto: SubCategoryDTO): Promise<import("mongoose").Document<unknown, any, import("../../interface/category/subcategory.interface").SubCategoryInterface> & import("../../interface/category/subcategory.interface").SubCategoryInterface & {
        _id: string;
    }>;
    createAffiliateSubCategory(subCategoryDto: AffiliateSubCategoryDTO): Promise<import("mongoose").Document<unknown, any, import("../../interface/category/affiliatesubcategory.interface").AffiliateSubCategoryInterface> & import("../../interface/category/affiliatesubcategory.interface").AffiliateSubCategoryInterface & {
        _id: string;
    }>;
    getAllCategories(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllAffiliateCategories(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllSubCategories(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllAffiliateSubCategoriesByAffiliateCategories(affiliateCategoryName: string, offset?: number, limit?: number): Promise<any[]>;
    getAllSubCategoriesByCategories(offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
