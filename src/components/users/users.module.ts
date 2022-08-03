import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from 'src/schema/location/location.schema';
import { VoucherCounterSchema } from 'src/schema/vouchers/vouchersCounter.schema';
import { UsersSchema } from '../../schema/user/users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UsersSchema },
      { name: 'Counter', schema: VoucherCounterSchema },
      { name: 'Location', schema: LocationSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
