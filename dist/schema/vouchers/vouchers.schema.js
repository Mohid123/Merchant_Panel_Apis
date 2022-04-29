"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.VoucherSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    voucherID: { type: Number, unique: true },
    dealName: { type: String, default: '' },
    dealId: { type: String, default: '' },
    merchantId: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    net: { type: Number, default: 0 },
    status: { type: String, default: '' },
    paymentStatus: { type: String, default: 'Pending' },
    boughtDate: { type: Number },
    deletedCheck: { type: Boolean, default: false }
}, {
    collection: 'vouchers',
});
exports.VoucherSchema.set('timestamps', true);
exports.VoucherSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('Voucher', exports.VoucherSchema);
exports.VoucherSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=vouchers.schema.js.map