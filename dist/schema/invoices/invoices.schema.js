"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.InvoiceSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    invoiceID: { type: String, unique: true },
    invoiceDate: { type: Number, default: 0 },
    invoiceAmount: { type: Number, default: 0 },
    status: { type: String, default: '' },
    invoiceURL: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    merchantMongoID: { type: String, default: '' }
}, {
    collection: 'invoices'
});
mongoose.model('Invoices', exports.InvoiceSchema);
exports.InvoiceSchema.set('timestamps', true);
exports.InvoiceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=invoices.schema.js.map