import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from './category.controller';
import { CategorySchema } from '../../schema/category/category.schema';
import { CategoryService } from './category.service';
import { SubCategorySchema } from '../../schema/category/subcategory.schema';
import { affiliateCategorySchema } from 'src/schema/category/affiliatecategory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
    MongooseModule.forFeature([{ name: 'SubCategory', schema: SubCategorySchema }]),
    MongooseModule.forFeature([{ name: 'affiliateCategories', schema: affiliateCategorySchema }])
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
