import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VoucherDto } from 'src/dto/vouchers/vouchers.dto';
import { BILLINGSTATUS } from 'src/enum/billing/billingStatus.enum';
import { SORT } from 'src/enum/sort/sort.enum';
import { VOUCHERSTATUSENUM } from 'src/enum/voucher/voucherstatus.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtMerchantAuthGuard } from '../auth/jwt-merchant-auth.guard';
import { VouchersService } from './vouchers.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Voucher')
@Controller('voucher')
export class VouchersController {
  constructor(private readonly voucherService: VouchersService) {}

  @UseGuards(JwtMerchantAuthGuard)
  @Post('createVoucher')
  createVoucher(@Body() voucherDto: VoucherDto) {
    return this.voucherService.createVoucher(voucherDto);
  }

  @ApiQuery({ name: 'deal', enum: SORT, required: false })
  @ApiQuery({ name: 'amount', enum: SORT, required: false })
  @ApiQuery({ name: 'fee', enum: SORT, required: false })
  @ApiQuery({ name: 'net', enum: SORT, required: false })
  @ApiQuery({ name: 'status', enum: VOUCHERSTATUSENUM, required: false })
  @ApiQuery({ name: 'paymentStatus', enum: BILLINGSTATUS, required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @Get('getAllVouchers/:merchantId')
  getAllVouchers(
    @Param('merchantId') merchantId: string,
    @Query('deal') deal: SORT,
    @Query('amount') amount: SORT,
    @Query('fee') fee: SORT,
    @Query('net') net: SORT,
    @Query('status') status: VOUCHERSTATUSENUM,
    @Query('paymentStatus') paymentStatus: BILLINGSTATUS,
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.voucherService.getAllVouchers(
      deal,
      amount,
      fee,
      net,
      status,
      paymentStatus,
      dateFrom,
      dateTo,
      merchantId,
      offset,
      limit,
    );
  }

  @Get('searchByVoucherId/:voucherId')
  searchByVoucherId(@Param('voucherId') voucherId: number) {
    return this.voucherService.searchByVoucherId(voucherId);
  }
}
