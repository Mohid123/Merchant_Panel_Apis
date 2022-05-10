import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto } from '../../dto/category/category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubCategoryDTO } from '../../dto/category/subcategory.dto';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('createCategory')
  createCategory(@Body() categoryDto: CategoryDto) {
    return this.categoryService.createCategory(categoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getAllSubCategories')
  getAllSubCategories (
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoryService.getAllSubCategories(offset, limit)
  }
}
