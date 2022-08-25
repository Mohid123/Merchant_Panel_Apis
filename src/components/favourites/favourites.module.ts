import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AffiliateFavouritesSchema } from 'src/schema/affiliate/affiliate.schema';
import { DealSchema } from 'src/schema/deal/deal.schema';
import { FavouriteSchema } from 'src/schema/favourites/favourites.schema';
import { UsersSchema } from 'src/schema/user/users.schema';
import { FavouritesController } from './favourites.controller';
import { FavouritesService } from './favourites.service';

@Module({
    imports: [
        MongooseModule.forFeature([
          { name: 'favourites', schema: FavouriteSchema },
          { name: 'affiliateFvaourites', schema: AffiliateFavouritesSchema },
          { name: 'Deal', schema: DealSchema },
          { name: 'User', schema: UsersSchema }
        ]),
      ],
      controllers: [FavouritesController],
      providers: [FavouritesService],
})
export class FavouritesModule {}
