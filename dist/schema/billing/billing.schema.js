"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.BillingSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    transactionID: { type: Number, default: 0 },
    transactionDate: { type: Number },
    paymentMethod: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    status: { type: String, default: '' },
    merchantID: { type: String, default: '' },
}, {
    collection: 'billings',
});
exports.BillingSchema.set('timestamps', true);
exports.BillingSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('Billing', exports.BillingSchema);
exports.BillingSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=billing.schema.js.map