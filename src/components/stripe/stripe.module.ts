import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeSchema } from 'src/schema/stripe/stripe.schema';
import { UsersSchema } from 'src/schema/user/users.schema';
import { StripeController } from './stripe.controller';
import { StripeService } from './stripe.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Stripe', schema: StripeSchema },
      { name: 'User', schema: UsersSchema },
    ]),
  ],
  providers: [StripeService],
  controllers: [StripeController],
  exports: [StripeService],
})
export class StripeModule {}
