import { CacheModule, forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { DealSchema } from '../../schema/deal/deal.schema';
import { CategorySchema } from '../../schema/category/category.schema';
import { VoucherCounterSchema } from '../../schema/vouchers/vouchersCounter.schema';
import { SubCategorySchema } from '../../schema/category/subcategory.schema';
import { UsersSchema } from 'src/schema/user/users.schema';
import { ScheduleService } from '../schedule/schedule.service';
import { ScheduleSchema } from 'src/schema/schedule/schedule.schema';
import { StripeSchema } from 'src/schema/stripe/stripe.schema';
import { StripeModule } from '../stripe/stripe.module';
import { VoucherSchema } from 'src/schema/vouchers/vouchers.schema';
import { VouchersModule } from '../vouchers/vouchers.module';
import { ViewsSchema } from 'src/schema/views/views.schema';
import { ViewsService } from '../views/views.service';
import { PreComputedDealSchema } from 'src/schema/deal/preComputed-deals.schema';
@Module({
  imports: [
    CacheModule.register(),
    forwardRef(() => CategoryModule),
    MongooseModule.forFeature([
      { name: 'Deal', schema: DealSchema },
      { name: 'PreComputedDeal', schema: PreComputedDealSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Counter', schema: VoucherCounterSchema },
      { name: 'SubCategory', schema: SubCategorySchema },
      { name: 'User', schema: UsersSchema },
      { name: 'Schedule', schema: ScheduleSchema },
      { name: 'Stripe', schema: StripeSchema },
      { name: 'Voucher', schema: VoucherSchema },
      { name: 'views', schema: ViewsSchema },
    ]),
    StripeModule,
    VouchersModule,
  ],
  controllers: [DealController],
  providers: [DealService, ScheduleService, ViewsService],
})
export class DealModule {}
