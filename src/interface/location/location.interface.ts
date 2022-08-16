import { Document } from 'mongoose';
export interface Location extends Document {
  _id: string;
  merchantID: string;
  tradeName: string;
  locationName: string;
  streetAddress: string;
  zipCode: string;
  city: string;
  googleMapPin: string;
  province: string;
  phoneNumber: string;
  plusCode: string;
}
