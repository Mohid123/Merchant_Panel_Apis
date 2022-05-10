import * as mongoose from 'mongoose';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';

export const VoucherCounterSchema = new mongoose.Schema({
  _id: { type: String },
  sequenceValue: { type: Number },
});

mongoose.model('Counter', VoucherCounterSchema);

VoucherCounterSchema.pre<VoucherCounterInterface>(
  'save',
  async function (next) {
    next();
  },
);
