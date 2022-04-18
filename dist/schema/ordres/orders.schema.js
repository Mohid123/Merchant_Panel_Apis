"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.OrderSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    orderID: { type: Number, default: 0 },
    transactionDate: { type: Number, default: 0 },
    customerName: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    source: { type: String, default: '' },
    status: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    voucherID: { type: String, default: '' },
    dealID: { type: String, default: '' },
}, {
    collection: 'orders'
});
mongoose.model('Order', exports.OrderSchema);
exports.OrderSchema.set('timestamps', true);
exports.OrderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=orders.schema.js.map