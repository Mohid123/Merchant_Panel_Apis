import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';
import { ReviewInterface } from '../../interface/review/review.interface';
const validator = require('validator');

export const ReviewSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    dealId: { type: String, default: '' },
    customerID: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    text: { type: String, default: '' },
    rating: { type: Number, default: 0 },
    customerEmail: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    customerName: { type: String, default: '' },
    profilePicURL: { type: String, default: '' },
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
