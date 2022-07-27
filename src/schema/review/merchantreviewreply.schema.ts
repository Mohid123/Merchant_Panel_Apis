import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { ReviewTextInterface } from 'src/interface/review/merchantreviewreply.interface';

export const ReviewTextSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        reviewID: { type: String, default: '' },
        merchantID: { type: String, default: '' },
        voucherID: {type:String,default:""},
        merchantName: { type: String, default: '' },
        legalName: { type: String, default: '' },
        profilePicURL: { type: String, default: '' },
        merchantReplyText: {
          type: String,
          required: [true, 'A review must not be empty.'],
          trim: true
        },
        deletedCheck: { type: Boolean, default: true }
    },
    {
        collection: 'reviewText'
    }
);

ReviewTextSchema.set('timestamps', true);
ReviewTextSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('reviewText', ReviewTextSchema);

ReviewTextSchema.pre<ReviewTextInterface>('save', async function (next) {
  next();
});