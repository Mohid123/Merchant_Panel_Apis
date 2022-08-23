import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersSchema } from 'src/schema/user/users.schema';
import { VoucherSchema } from '../../schema/vouchers/vouchers.schema';
import { VoucherCounterSchema } from '../../schema/vouchers/vouchersCounter.schema';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Voucher', schema: VoucherSchema },
      { name: 'User', schema: UsersSchema },
      { name: 'Counter', schema: VoucherCounterSchema },
    ]),
  ],
  controllers: [VouchersController],
  providers: [VouchersService],
  exports: [VouchersService],
})
export class VouchersModule {}
