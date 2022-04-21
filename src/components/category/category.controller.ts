import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto } from '../../dto/category/category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubCategoryDTO } from 'src/dto/category/subcategory.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('createCategory')
  createCategory(@Body() categoryDto: CategoryDto) {
    return this.categoryService.createCategory(categoryDto);
  }

  @Post('createSubCategory')
  createSubCategory (@Body() subCategoryDto: SubCategoryDTO) {
    return this.categoryService.createSubCategory(subCategoryDto)
  }

  @Get('getAllCategories')
  getAllCategories (
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoryService.getAllCategories(offset, limit)
  }
}
