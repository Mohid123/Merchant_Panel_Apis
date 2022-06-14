import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UtilService } from './utils.service';

@ApiTags('Utils')
@Controller('utils')
export class UtilController {
  constructor(private readonly UtilService: UtilService) {}

  @Get('getCity/:zipCode')
  getCity(@Param('zipCode') zipCode: string) {
    return this.UtilService.getCity(zipCode);
  }

  @Post('validateVatNumber/:vatNumber')
  validateVatNumber (
    // @Param('countryCode') countryCode: string,
    @Param('vatNumber') vatNumber: string) {
    return this.UtilService.validateVatNumber(vatNumber)
  }
}
