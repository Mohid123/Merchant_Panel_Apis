import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';

@ApiTags('Deal')
@Controller('deal')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @Post('createDeal')
  createDeal(@Body() dealDto: DealDto) {
    return this.dealService.createDeal(dealDto);
  }

  @Get('getDeal/:id')
  getDeal(@Param('id') id: string) {
    return this.dealService.getDeal(id);
  }

  @Get('getDealByMerchant/:merchantId')
  getDealByMerchant(@Param('merchantId') merchantId: string) {
    return this.dealService.getDealByMerchant(merchantId);
  }

  @Get('getAllDeals')
  getAllDeals() {
    return this.dealService.getAllDeals();
  }
}
