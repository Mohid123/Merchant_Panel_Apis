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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'src/config/development.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule.forRoot(),
    MediaUploadModule,
    DealModule,
    OrdersModule,
    CategoryModule,
    ReviewModule,
    UsersModule,
    BillingModule,
    UsersModule,
    ActivityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
