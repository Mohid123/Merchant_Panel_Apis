import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealSchema } from 'src/schema/deal/deal.schema';
import { ScheduleSchema } from 'src/schema/schedule/schedule.schema';
import { UsersSchema } from 'src/schema/user/users.schema';
import { VoucherSchema } from '../../schema/vouchers/vouchers.schema';
import { VoucherCounterSchema } from '../../schema/vouchers/vouchersCounter.schema';
import { ScheduleService } from '../schedule/schedule.service';
import { VouchersController } from './vouchers.controller';
import { VouchersService } from './vouchers.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Voucher', schema: VoucherSchema },
      { name: 'User', schema: UsersSchema },
      { name: 'Counter', schema: VoucherCounterSchema },
      { name: 'Schedule', schema: ScheduleSchema },
      { name: 'Deal', schema: DealSchema },
    ]),
  ],
  controllers: [VouchersController],
  providers: [VouchersService, ScheduleService],
  exports: [VouchersService],
})
export class VouchersModule {}
