import * as mongoose from 'mongoose';
import { generateStringId } from 'src/components/file-management/utils/utils';

export const InvoiceSchema = new mongoose.Schema(
    {
        _id: { type: String, default: generateStringId },
        invoiceNo: { type: Number, default: 0 },
        invoiceDate: { type: Number, default: 0 },
        invoiceAmount: { type: Number, default: 0 },
        status: { type: String, default: '' },
        invoiceURL: { type: String, default: '' },
        merchantID: { type: String, default: '' }
    },
    {
        collection: 'invoices'
    }
);

mongoose.model('Invoices', InvoiceSchema);

InvoiceSchema.set('timestamps', true);

InvoiceSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function(doc, ret) {
    delete ret._id;
  },
});