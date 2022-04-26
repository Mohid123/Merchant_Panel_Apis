import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VoucherSchema } from 'src/schema/vouchers/vouchers.schema';
import { VoucherCounterSchema } from 'src/schema/vouchers/vouchersCounter.schema';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Voucher', schema: VoucherSchema },
      { name: 'Counter', schema: VoucherCounterSchema },
    ]),
  ],
  controllers: [VouchersController],
  providers: [VouchersService],
})
export class VouchersModule {}
