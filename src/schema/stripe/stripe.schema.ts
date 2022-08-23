import * as mongoose from 'mongoose';
import { StripeInterface } from 'src/interface/stripe/stripe.interface';

export const StripeSchema = new mongoose.Schema(
  {
    _id: { type: String },
    payment: { type: String, dafault: '0' },
    description: { type: String },
    userId: { type: String },
    stripe: { type: Object },
  },
  {
    collection: 'stripePayments',
  },
);

StripeSchema.set('timestamps', true);
StripeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
mongoose.model('Stripe', StripeSchema);

StripeSchema.pre<StripeInterface>('save', async function (next) {
  next();
});
