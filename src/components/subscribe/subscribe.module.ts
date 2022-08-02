import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscribeSchema } from 'src/schema/subscribe/subscribe.schema';
import { SubscribeController } from './subscribe.controller';
import { SubscribeService } from './subscribe.service';

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: 'subscribe', schema: SubscribeSchema },
        ]),
      ],
      controllers: [SubscribeController],
      providers: [SubscribeService],
})
export class SubscribeModule {}
