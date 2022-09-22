import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UtilService } from './utils.service';

@ApiTags('Utils')
@Controller('utils')
export class UtilController {
  constructor(private readonly UtilService: UtilService) {}

  @Get('getCity/:zipCode')
  getCity(@Param('zipCode') zipCode: string) {
    return this.UtilService.getCity(zipCode);
  }

  @Get('getAllCategoriesAndSubCategories')
  getAllCategoriesAndSubCategories() {
    return this.UtilService.getAllCategoriesAndSubCategories();
  }

  @Post('validateVatNumber/:vatNumber')
  validateVatNumber (
    // @Param('countryCode') countryCode: string,
    @Param('vatNumber') vatNumber: string) {
    return this.UtilService.validateVatNumber(vatNumber)
  }

  // @ApiQuery({ name: 'searchCategory', required: false })
    @Get('searchCategory')
    searchAllCities (
        @Query('searchCategory') searchCategory: string
        ) {
        return this.UtilService.searchCategory(searchCategory)
    }
}
