import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { FavouritesInterface } from 'src/interface/favourites/favourites.interface';

export const FavouriteSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        customerMongoID: { type: String, default: '' },
        customerID: { type: String, default: '' },
        dealMongoID: { type: String, default: '' },
        dealID: { type: String, default: '' },
        deletedCheck: { type: Boolean, default: false }
    },
    {
        collection: 'favourites'
    }
);

FavouriteSchema.set('timestamps', true);
FavouriteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('favourites', FavouriteSchema);

FavouriteSchema.pre<FavouritesInterface>('save', async function (next) {
  next();
});