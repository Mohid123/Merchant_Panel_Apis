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
import { MultipleVouchersDto } from 'src/dto/vouchers/multiplevouchers.dto';
import { VoucherDto } from '../../dto/vouchers/vouchers.dto';
import { BILLINGSTATUS } from '../../enum/billing/billingStatus.enum';
import { SORT } from '../../enum/sort/sort.enum';
import { VOUCHERSTATUSENUM } from '../../enum/voucher/voucherstatus.enum';
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
  @ApiQuery({ name: 'voucher', enum: SORT, required: false })
  @ApiQuery({ name: 'amount', enum: SORT, required: false })
  @ApiQuery({ name: 'fee', enum: SORT, required: false })
  @ApiQuery({ name: 'net', enum: SORT, required: false })
  @ApiQuery({ name: 'status', enum: VOUCHERSTATUSENUM, required: false })
  @ApiQuery({ name: 'paymentStatus', enum: BILLINGSTATUS, required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @Post('getAllVouchersByMerchantID/:merchantID')
  getAllVouchers(
    @Param('merchantID') merchantID: string,
    @Query('deal') deal: SORT,
    @Query('voucher') voucher: SORT,
    @Query('amount') amount: SORT,
    @Query('fee') fee: SORT,
    @Query('net') net: SORT,
    @Query('status') status: VOUCHERSTATUSENUM,
    @Query('paymentStatus') paymentStatus: BILLINGSTATUS,
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
    @Query('voucherID') voucherID: string = '',
    @Query('dealHeader') dealHeader: string = '',
    @Query('voucherHeader') voucherHeader: string = '',
    @Query('voucherStatus') voucherStatus: string = '',
    @Query('invoiceStatus') invoiceStatus: string = '',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() multipleVouchersDto: MultipleVouchersDto,
  ) {
    return this.voucherService.getAllVouchersByMerchantID(
      deal,
      voucher,
      amount,
      fee,
      net,
      status,
      paymentStatus,
      dateFrom,
      dateTo,
      merchantID,
      voucherID,
      dealHeader,
      voucherHeader,
      voucherStatus,
      invoiceStatus,
      offset,
      limit,
      multipleVouchersDto,
    );
  }

  @ApiQuery({ name: 'voucherId', required: false })
  @Get('searchByVoucherId/:merchantID')
  searchByVoucherId(
    @Param('merchantID') merchantID: string,
    @Query('voucherId') voucherId: string = '',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    ) {
    return this.voucherService.searchByVoucherId(merchantID, voucherId, offset, limit);
  }
}
