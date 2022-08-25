import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { AffiliateFavouritesDto } from 'src/dto/affiliate/affiliate.dto';

export const AffiliateFavouritesSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        affiliateMongoID: { type: String, default: '' },
        affiliateID: { type: String, default: '' },
        customerMongoID: { type: String, default: '' },
        customerID: { type: String, default: '' },
        deletedCheck: { type: Boolean, default: false }
    },
    {
        collection: 'affiliateFvaourites'
    }
);

AffiliateFavouritesSchema.set('timestamps', true);
AffiliateFavouritesSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('affiliateFvaourites', AffiliateFavouritesSchema);
AffiliateFavouritesSchema.pre<AffiliateFavouritesDto>('save', async function (next) {
  next();
});
