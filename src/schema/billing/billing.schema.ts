import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';
import { BillingInterface } from 'src/interface/billing/billing.interface';

export const BillingSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateStringId },
    transactionID: { type: Number, default: 0 },
    transactionDate: { type: Number },
    paymentMethod: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    status: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false }
  },
  {
    collection: 'billings',
  },
);

BillingSchema.set('timestamps', true);
BillingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

mongoose.model('Billing', BillingSchema);
BillingSchema.pre<BillingInterface>('save', async function (next) {
  next();
});
