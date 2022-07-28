import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LocationSchema } from 'src/schema/location/location.schema';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Location', schema: LocationSchema }]),
  ],
  controllers: [LocationController],
  providers: [LocationService],
})
export class LocationModule {}
