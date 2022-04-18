import { Document } from 'mongoose';

export interface BillingInterface extends Document {
  id: string;
  transactionID: number;
  transactionDate: number;
  paymentMethod: string;
  amount: number;
  status: string;
  merchantID: string;
}
