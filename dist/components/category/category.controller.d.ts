import { CategoryService } from './category.service';
import { CategoryDto } from '../../dto/category/category.dto';
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    createCategory(categoryDto: CategoryDto): Promise<import("../../interface/category/category.interface").CategoryInterface & {
        _id: any;
    }>;
}
