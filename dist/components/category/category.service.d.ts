import { Model } from 'mongoose';
import { CategoryInterface } from '../../interface/category/category.interface';
export declare class CategoryService {
    private readonly categoryModel;
    constructor(categoryModel: Model<CategoryInterface>);
    createCategory(categoryDto: any): Promise<CategoryInterface & {
        _id: any;
    }>;
}
