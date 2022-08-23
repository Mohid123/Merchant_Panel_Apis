import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DealSchema } from 'src/schema/deal/deal.schema';
import { FavouriteSchema } from 'src/schema/favourites/favourites.schema';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: 'favourites', schema: FavouriteSchema },
          { name: 'Deal', schema: DealSchema },
        ]),
      ],
      controllers: [FavouritesController],
      providers: [FavouritesService],
})
export class FavouritesModule {}
