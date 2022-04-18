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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { BillingDto } from 'src/dto/billing/billing.dto';
import { SORT } from 'src/enum/sort/sort.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BillingService } from './billing.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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

  @ApiQuery({ name: 'paymentMethod', enum: SORT, required: false })
  @ApiQuery({ name: 'amount', enum: SORT, required: false })
  @ApiQuery({ name: 'date', enum: SORT, required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @Get('getBillingsByMerchant')
  getBillingsByMerchant(
    @Query('paymentMethod') paymentMethod: SORT,
    @Query('amount') amount: SORT,
    @Query('date') date: SORT,
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.billingService.getBillingsByMerchant(
      paymentMethod,
      amount,
      date,
      dateFrom,
      dateTo,
      offset,
      limit,
      req,
    );
  }
}
