import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';
import { DealInterface } from '../../interface/deal/deal.interface';

export const DealSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    dealID: { type: Number },
    merchantID: { type: String },
    dealHeader: { type: String, default: '' },
    dealSubHeader: { type: String, default: '' },
    highlights: { type: String, default: '' },
    categoryID: { type: mongoose.Schema.Types.String, ref: 'Category' },
    categoryName: { type: String },
    subCategoryID: { type: String, default: '' },
    subCategory: { type: String, default: '' },
    mediaUrl: { type: Array },
    startDate: { type: Number },
    endDate: { type: Number },
    vouchers: { type: Array },
    availableVouchers: { type: Number },
    soldVouchers: { type: Number, default: 0 },
    aboutThisDeal: { type: String, default: '' },
    dealStatus: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be above 0.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    maxRating: {
      type: Number,
      default: 0,
    },
    minRating: {
      type: Number,
      default: 0,
    },
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
