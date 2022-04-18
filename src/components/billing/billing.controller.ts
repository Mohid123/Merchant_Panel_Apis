import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BillingDto } from 'src/dto/billing/billing.dto';
import { BillingService } from './billing.service';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('createBilling')
  createBilling(@Body() billingDto: BillingDto) {
    return this.billingService.createBilling(billingDto);
  }

  @Get('getBill/:id')
  getBill(@Param('id') id: string) {
    return this.billingService.getBill(id);
  }

  @Get('getAllBillings')
  getAllBillings(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.billingService.getAllBillings(offset, limit);
  }
}
