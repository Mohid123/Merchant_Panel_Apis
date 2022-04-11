import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';
import { DealInterface } from '../../interface/deal/deal.interface';

export const DealSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    title: { type: String, default: '' },
    subTitle: { type: String, default: '' },
    description: { type: String, default: '' },
    categoryType: { type: mongoose.Schema.Types.String, ref: 'Category' },
    categoryName: { type: String },
    mediaUrl: [String],
    startDate: { type: Number },
    endDate: { type: Number },
    vouchers: { type: Array },
    termsAndCondition: { type: String },
    merchantId: { type: String },
    dealStatus: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false }
  },
  {
    collection: 'deals',
  },
);

DealSchema.set('timestamps', true);
DealSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('Deal', DealSchema);

DealSchema.pre<DealInterface>('save', async function (next) {
  next();
});
