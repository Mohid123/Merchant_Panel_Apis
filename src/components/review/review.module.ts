import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewSchema } from '../../schema/review/review.schema';
import { DealSchema } from '../../schema/deal/deal.schema';
import { UsersSchema } from '../../schema/user/users.schema';
import { ReviewTextSchema } from 'src/schema/review/merchantreviewreply.schema';
import { VoucherSchema } from 'src/schema/vouchers/vouchers.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Review', schema: ReviewSchema},
      { name: 'Deal', schema: DealSchema },
      { name: 'User', schema: UsersSchema },
      { name: 'reviewText', schema: ReviewTextSchema },
      { name: 'Voucher', schema: VoucherSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
