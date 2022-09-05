import * as mongoose from 'mongoose';
import { PreComputedDealInteface } from 'src/interface/deal/preComputedDeal.interface';
import { generateStringId } from '../../components/file-management/utils/utils';

export const PreComputedDealSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    data: { type: Array },
    methodName: { type: String },
    totalCount: { type: Number },
    filterValue: { type: Number },
  },
  {
    collection: 'precomputed-deals',
  },
);

PreComputedDealSchema.set('timestamps', true);
PreComputedDealSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('PreComputedDeal', PreComputedDealSchema);

PreComputedDealSchema.pre<PreComputedDealInteface>(
  'save',
  async function (next) {
    next();
  },
);
