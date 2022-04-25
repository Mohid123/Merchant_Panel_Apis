import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VoucherDto } from 'src/dto/vouchers/vouchers.dto';
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

  @Get('getAllVouchers/:merchantId')
  getAllVouchers(
    @Param('merchantId') merchantId: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.voucherService.getAllVouchers(merchantId, offset, limit);
  }
}
