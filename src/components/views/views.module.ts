import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealSchema } from 'src/schema/deal/deal.schema';
import { UsersSchema } from 'src/schema/user/users.schema';
import { ViewsSchema } from 'src/schema/views/views.schema';
import { ViewsController } from './views.controller';
import { ViewsService } from './views.service';

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: 'views', schema: ViewsSchema },
          { name: 'Deal', schema: DealSchema },
          { name: 'User', schema: UsersSchema }
        ]),
      ],
      controllers: [ViewsController],
      providers: [ViewsService],
})
export class ViewsModule {}
