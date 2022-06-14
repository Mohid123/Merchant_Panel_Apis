import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';

export const OtpSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    otp: { type: String, unique: true },
    expiryTime: { type: Number },
    isUsed: { type: Boolean, default: false },
    userEmail: { type: String },
    userID: { type: String },
  },
  {
    collection: 'otps',
  },
);

mongoose.model('OTP', OtpSchema);

OtpSchema.set('timestamps', true);

OtpSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
