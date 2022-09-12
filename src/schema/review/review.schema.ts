import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';
import { ReviewInterface } from '../../interface/review/review.interface';
const validator = require('validator');

export const ReviewSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    dealMongoID: { type: String, default: '' },
    dealID: { type: String, default: '' },
    dealHeader: { type: String, default: '' },
    subDealHeader: { type: String, default: '' },
    voucherMongoID: { type: String, default: '' },
    voucherID: { type: String, default: '' },
    customerMongoID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    merchantMongoID: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    text: {
      type: String,
      required: [true, 'A review must not be empty.'],
      trim: true,
    },
    mediaUrl: { type: Array },
    totalRating: {
      type: Number,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    multipleRating: {
      type: Array,
      min: [1, 'Rating must be above or equal to 1.0'],
      max: [5, 'Rating must be below or equal to 5.0'],
    },
    customerEmail: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    customerName: { type: String, default: '' },
    profilePicURL: { type: String, default: '' },
    voucherRedeemedDate: { type: Number },
    isViewed: { type: Boolean, default: false },
  },
  {
    collection: 'reviews',
  },
);

ReviewSchema.set('timestamps', true);
ReviewSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('Review', ReviewSchema);

ReviewSchema.pre<ReviewInterface>('save', async function (next) {
  next();
});

ReviewSchema.index({ customerID: 1 });
ReviewSchema.index({ customerMongoID: 1 });
ReviewSchema.index({ merchantMongoID: 1, dealID: 1 });
ReviewSchema.index({ merchantMongoID: 1, dealMongoID: 1 });
ReviewSchema.index({ merchantID: 1, dealID: 1 });
ReviewSchema.index({ merchantID: 1, dealMongoID: 1 });
ReviewSchema.index({ totalRating: 1 });
ReviewSchema.index({ merchantMongoID: 1, isViewed: 1 });
ReviewSchema.index({ merchantID: 1, isViewed: 1 });
