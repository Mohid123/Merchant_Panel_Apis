import * as mongoose from 'mongoose';
import { generateStringId } from '../../components/file-management/utils/utils';

export const OrderSchema = new mongoose.Schema(
    {
        _id: {type: String, default: generateStringId},
        orderID: {type: Number, default: 0},
        transactionDate: {type: Number, default: 0},
        customerName: {type: String, default: ''},
        amount: {type: Number, default: 0},
        fee: {type: Number, default: 0},
        netAmount: {type: Number, default: 0},
        source: {type: String, default: ''},
        status: {type: String, default: ''},
        merchantID: {type: String, default: ''},
        customerID: {type: String, default: ''},
        voucherID: {type: String, default: ''},
        dealID: {type: String, default: ''},
    },
    {
        collection: 'orders'
    }
);

mongoose.model('Order', OrderSchema);

OrderSchema.set('timestamps', true);

OrderSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});