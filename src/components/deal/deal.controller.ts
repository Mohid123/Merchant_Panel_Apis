import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { JwtMerchantAuthGuard } from '../auth/jwt-merchant-auth.guard';
import { DealStatusDto } from '../../dto/deal/updatedealstatus.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Deal')
@Controller('deal')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @UseGuards(JwtMerchantAuthGuard)
  @Post('createDeal')
  createDeal(@Body() dealDto: DealDto) {
    return this.dealService.createDeal(dealDto);
  }

  @UseGuards(JwtAdminAuthGuard)
  @Post('approveRejectDeal/:dealID')
  approveRejectDeal(
    @Param('dealID') dealID: string,
    @Body() dealStatusDto: DealStatusDto) {
    return this.dealService.approveRejectDeal(dealID, dealStatusDto)
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
  getAllDeals(
    @Query("offset") offset: number = 0,
    @Query("limit") limit: number = 10
  ) {
    return this.dealService.getAllDeals(offset, limit);
  }
}
