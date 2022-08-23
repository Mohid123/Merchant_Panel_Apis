import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaUploadModule } from './components/file-management/media-upload/media-upload.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DealModule } from './components/deal/deal.module';
import { CategoryModule } from './components/category/category.module';
import { ReviewModule } from './components/review/review.module';
import { AuthModule } from './components/auth/auth.module';
import { UsersModule } from './components/users/users.module';
import { BillingModule } from './components/billing/billing.module';
import { OrdersModule } from './components/orders/orders.module';
import { ActivityModule } from './components/activity/activity.module';
import { VouchersModule } from './components/vouchers/vouchers.module';
import { InvoicesModule } from './components/invoices/invoices.module';
import { UtilModule } from './components/utils/utils.module';
import { LeadsModule } from './components/leads/leads.module';
import { LocationModule } from './components/location/location.module';
import { BlogModule } from './components/blog/blog.module';
import { SubscribeModule } from './components/subscribe/subscribe.module';
import { ScheduleModule } from './components/schedule/schedule.module';
import { ScheduleService } from './components/schedule/schedule.service';
import { ScheduleSchema } from './schema/schedule/schedule.schema';
import { DealSchema } from './schema/deal/deal.schema';
import { FavouritesModule } from './components/favourites/favourites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/config/development.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule.forRoot(),
    MongooseModule.forFeature([
      { name: 'Schedule', schema: ScheduleSchema },
      { name: 'Deal', schema: DealSchema },
    ]),
    UsersModule,
    DealModule,
    CategoryModule,
    OrdersModule,
    ReviewModule,
    BillingModule,
    ActivityModule,
    MediaUploadModule,
    VouchersModule,
    InvoicesModule,
    LeadsModule,
    LocationModule,
    BlogModule,
    SubscribeModule,
    UtilModule,
    ScheduleModule,
    FavouritesModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScheduleService],
})
export class AppModule {}
