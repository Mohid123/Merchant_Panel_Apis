import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealSchema } from 'src/schema/deal/deal.schema';
import { ScheduleSchema } from 'src/schema/schedule/schedule.schema';
import { VoucherSchema } from 'src/schema/vouchers/vouchers.schema';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Schedule', schema: ScheduleSchema },
      { name: 'Deal', schema: DealSchema },
      { name: 'Voucher', schema: VoucherSchema },
    ]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
