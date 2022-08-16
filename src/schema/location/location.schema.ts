/* eslint-disable prettier/prettier */
import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';

export const LocationSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    location: {
      type: {
        type: String,
        default: 'Point',
        enum: 'Point',
      },
      coordinates: [Number],
    },
    merchantID: { type: String },
    tradeName: { type: String, default: '' },
    locationName: { type: String, default: '' },
    streetAddress: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    city: { type: String, default: '' },
    googleMapPin: { type: String, default: '' },
    province: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    plusCode: { type: String, default: '' },
  },
  {
    collection: 'locations',
  },
);

mongoose.model('Location', LocationSchema);

LocationSchema.set('timestamps', true);

LocationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
