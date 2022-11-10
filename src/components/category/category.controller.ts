import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CategoryDto } from '../../dto/category/category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubCategoryDTO } from '../../dto/category/subcategory.dto';
import { AffiliateCategoryDto } from 'src/dto/category/affiliatecategory.dto';
import { AffiliateSubCategoryDTO } from 'src/dto/category/affiliatesubcategory.dto';

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
  @Post('createAffiliateCategory')
  createAffiliateCategory(@Body() categoryDto: AffiliateCategoryDto) {
    return this.categoryService.createAffiliateCategory(categoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('createSubCategory')
  createSubCategory(@Body() subCategoryDto: SubCategoryDTO) {
    return this.categoryService.createSubCategory(subCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('createAffiliateSubCategory')
  createAffiliateSubCategory(@Body() subCategoryDto: AffiliateSubCategoryDTO) {
    return this.categoryService.createAffiliateSubCategory(subCategoryDto);
  }

  @Get('getAllCategories')
  getAllCategories(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoryService.getAllCategories(offset, limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getAllAffiliateCategories')
  getAllAffiliateCategories (
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoryService.getAllAffiliateCategories(offset, limit);
  }

  @Get('getAllSubCategoriesByCategories')
  getAllSubCategories(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoryService.getAllSubCategoriesByCategories(offset, limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getAllAffiliateSubCategoriesByAffiliateCategories/:affiliateCategoryName')
  getAllAffiliateSubCategoriesByAffiliateCategories(
    @Param('affiliateCategoryName') affiliateCategoryName: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoryService.getAllAffiliateSubCategoriesByAffiliateCategories(affiliateCategoryName, offset, limit);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getAllSubCategoriesByMerchant')
  getAllSubCategoriesByCategories(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.categoryService.getAllSubCategoriesByMerchant(
      offset,
      limit,
      req,
    );
  }
}
