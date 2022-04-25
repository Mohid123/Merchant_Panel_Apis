import { Document } from 'mongoose';

export interface VoucherInterface extends Document {
  id: string;
  deal: string;
  dealId: string;
  merchantId: string;
  amount: number;
  fee: number;
  net: number;
  status: string;
  paymentStatus: string;
}
