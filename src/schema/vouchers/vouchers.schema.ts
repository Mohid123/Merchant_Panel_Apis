import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { VoucherInterface } from 'src/interface/deal/deal.interface';

export const VoucherSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    deal: { type: String, default: '' },
    dealId: { type: String, default: '' },
    merchantId: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    net: { type: Number, default: 0 },
    status: { type: String, default: '' },
    paymentStatus: { type: String, default: 'Pending' },
  },
  {
    collection: 'vouchers',
  },
);

VoucherSchema.set('timestamps', true);
VoucherSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('Voucher', VoucherSchema);

VoucherSchema.pre<VoucherInterface>('save', async function (next) {
  next();
});
