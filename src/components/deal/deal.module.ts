import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from '../category/category.module';
import { DealController } from './deal.controller';
import { DealService } from './deal.service';
import { DealSchema } from '../../schema/deal/deal.schema';
import { CategorySchema } from '../../schema/category/category.schema';
import { VoucherCounterSchema } from '../../schema/vouchers/vouchersCounter.schema';
import { SubCategorySchema } from '../../schema/category/subcategory.schema';
@Module({
  imports: [
    forwardRef(() => CategoryModule),
    MongooseModule.forFeature([
      { name: 'Deal', schema: DealSchema },
      { name: 'Category', schema: CategorySchema },
      { name: 'Counter', schema: VoucherCounterSchema },
      { name: 'SubCategory', schema: SubCategorySchema }
    ]),
  ],
  controllers: [DealController],
  providers: [DealService],
})
export class DealModule {}
