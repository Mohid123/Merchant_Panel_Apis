import { Controller, Get, Param } from '@nestjs/common';
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
}
