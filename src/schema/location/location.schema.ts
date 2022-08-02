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
    locationName: { type: String },
    streetAddress: { type: String },
    zipCode: { type: String },
    city: { type: String },
    googleMapPin: { type: String },
    province: { type: String },
    phoneNumber: { type: String },
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
