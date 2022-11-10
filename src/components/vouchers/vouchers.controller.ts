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
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { MultipleVouchersDto } from 'src/dto/vouchers/multiplevouchers.dto';
import { MultipleVouchersAffiliateDto } from 'src/dto/vouchers/multiplevouchersaffiliate.dto';
import { RedeemVoucherDto } from 'src/dto/vouchers/redeemVoucher.dto';
import { UpdateVoucherForCRMDto } from 'src/dto/vouchers/updatevoucherforcrom.dto';
import { VoucherDto } from '../../dto/vouchers/vouchers.dto';
import { BILLINGSTATUS } from '../../enum/billing/billingStatus.enum';
import { SORT } from '../../enum/sort/sort.enum';
import { VOUCHERSTATUSENUM } from '../../enum/voucher/voucherstatus.enum';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtManagerAuthGuard } from '../auth/jwt-manager-auth.guard';
import { JwtMerchantAuthGuard } from '../auth/jwt-merchant-auth.guard';
import { VouchersService } from './vouchers.service';

@ApiTags('Voucher')
@Controller('voucher')
export class VouchersController {
  constructor(private readonly voucherService: VouchersService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtMerchantAuthGuard)
  @Post('createVoucher')
  createVoucher(@Body() voucherDto: VoucherDto) {
    return this.voucherService.createVoucher(voucherDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtManagerAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getVoucherByID/:voucherID')
  getVoucherByID(@Param('voucherID') voucherID: string) {
    return this.voucherService.getVoucherByID(voucherID);
  }

  @ApiBearerAuth()
  @UseGuards(JwtManagerAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('updateVoucherByID/:voucherID')
  updateVoucherByID(
    @Param('voucherID') voucherID: string,
    @Body() updateVoucherForCRMDto: UpdateVoucherForCRMDto,
  ) {
    return this.voucherService.updateVoucherByID(
      voucherID,
      updateVoucherForCRMDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'voucherID', type: String, required: false })
  @Post('getVouchersByAffiliateID/:affiliateMongoID')
  getVouchersByAffiliateID (
    @Param('affiliateMongoID') affiliateMongoID: string,
    @Query('voucherID') voucherID: string = '',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() multipleVouchersAffiliateDto: MultipleVouchersAffiliateDto,
  ) {
    return this.voucherService.getVouchersByAffiliateID(affiliateMongoID, voucherID, multipleVouchersAffiliateDto, offset, limit)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'searchVoucher', required: false })
  @ApiQuery({ name: 'voucherStatus', enum: VOUCHERSTATUSENUM, required: false })
  @Get('getVouchersByCustomerID/:customerID')
  getVouchersByCustomerID(
    @Param('customerID') customerID: string,
    @Query('searchVoucher') searchVoucher: string = '',
    @Query('voucherStatus') voucherStatus: VOUCHERSTATUSENUM,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.voucherService.getVouchersByCustomerID(
      customerID,
      searchVoucher,
      voucherStatus,
      offset,
      limit,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'voucherId', required: false })
  @Get('searchByVoucherId/:merchantID')
  searchByVoucherId(
    @Param('merchantID') merchantID: string,
    @Query('voucherId') voucherId: string = '',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.voucherService.searchByVoucherId(
      merchantID,
      voucherId,
      offset,
      limit,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), JwtMerchantAuthGuard)
  @Get('redeemVoucher/:voucherId')
  redeemVoucher(@Param('voucherId') voucherId: string, @Req() req) {
    return this.voucherService.redeemVoucher(voucherId, req);
  }

  @Get('getVoucherByMongoId/:voucherId')
  getVoucherByMongoId(@Param('voucherId') voucherId: string) {
    return this.voucherService.getVoucherByMongoId(voucherId);
  }

  @Post('redeemVoucherByMerchantPin/')
  redeemVoucherByMerchantPin(@Body() redeemVoucherDto: RedeemVoucherDto) {
    return this.voucherService.redeemVoucherByMerchantPin(redeemVoucherDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtMerchantAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getVoucherSoldPerDay/:days')
  getVoucherSoldPerDay(@Param('days') days: number, @Req() req) {
    return this.voucherService.getVoucherSoldPerDay(days, req);
  }

  @ApiBearerAuth()
  @UseGuards(JwtMerchantAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getNetRevenue')
  getNetRevenue(@Req() req) {
    return this.voucherService.getNetRevenue(req);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getVoucherSoldPerDayForAffiliates/:days')
  getVoucherSoldPerDayForAffiliates (
    @Param('days') days: number,
    @Req() req
  ) {
    return this.voucherService.getVoucherSoldPerDayForAffiliates(days, req)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: "byMonthYearQuarter", type: String, required: false })
  @ApiQuery({ name: "dateFrom", type: Number, required: false })
  @ApiQuery({ name: "dateTo", type: Number, required: false })
  @ApiQuery({ name: 'totalVouchers', enum: SORT, required: false })
  @ApiQuery({ name: 'totalEarnings', enum: SORT, required: false })
  @Get('getCustomerRanking/:affiliateMongoID')
  getCustomerRanking (
    @Param('affiliateMongoID') affiliateMongoID: string,
    @Query("byMonthYearQuarter") byMonthYearQuarter: string = '',
    @Query("dateFrom") dateFrom: number = 0,
    @Query("dateTo") dateTo: number = 0,
    @Query('totalVouchers') totalVouchers: SORT,
    @Query('totalEarnings') totalEarnings: SORT,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.voucherService.getCustomerRanking(affiliateMongoID, byMonthYearQuarter, dateFrom, dateTo, totalVouchers, totalEarnings, offset, limit)
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: "byMonthYearQuarter", type: String, required: false })
  @ApiQuery({ name: "dateFrom", type: Number, required: false })
  @ApiQuery({ name: "dateTo", type: Number, required: false })
  @ApiQuery({ name: 'totalVouchers', enum: SORT, required: false })
  @ApiQuery({ name: 'totalEarnings', enum: SORT, required: false })
  @Get('getUsersForTableCSV')
  getUsersForTableCSV(
    @Query('affiliateMongoID') affiliateMongoID: string,
    @Query("byMonthYearQuarter") byMonthYearQuarter: string = '',
    @Query("dateFrom") dateFrom: number = 0,
    @Query("dateTo") dateTo: number = 0,
    @Query('totalVouchers') totalVouchers: SORT,
    @Query('totalEarnings') totalEarnings: SORT,
  ) {
    return this.voucherService.getCustomerRankingCSV(
      affiliateMongoID,
      byMonthYearQuarter,
      dateFrom,
      dateTo,
      totalVouchers,
      totalEarnings
    );
  }
}
