import { Document } from 'mongoose';

export interface ReviewInterface extends Document {
  id: string;
  dealId: string;
  customerId: string;
  merchantId: string;
  text: string;
  rating: number;
  customerEmail: string;
  customerName: string;
  profilePicURL: string;
}
