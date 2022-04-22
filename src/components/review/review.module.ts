import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewSchema } from '../../schema/review/review.schema';
import { DealSchema } from 'src/schema/deal/deal.schema';
import { UsersSchema } from 'src/schema/user/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Review',
        schema: ReviewSchema,
      },
      { name: 'Deal', schema: DealSchema },
      { name: 'User', schema: UsersSchema },
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
