import { Document } from 'mongoose';
export interface VoucherCounterInterface extends Document {
  id: string;
  sequenceValue: 0;
}
