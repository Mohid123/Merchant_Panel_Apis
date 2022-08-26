"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.VoucherSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    voucherID: { type: String, unique: true },
    voucherHeader: { type: String, default: '' },
    dealHeader: { type: String, default: '' },
    dealID: { type: String, default: '' },
    subDealID: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    merchantMongoID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    customerMongoID: { type: String, default: '' },
    affiliateID: { type: String, default: '' },
    affiliateMongoID: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    fee: { type: Number, default: 0 },
    net: { type: Number, default: 0 },
    status: { type: String, default: '' },
    paymentStatus: { type: String, default: 'In process' },
    boughtDate: { type: Number },
    redeemDate: { type: Number },
    expiryDate: { type: Number },
    imageURL: { type: Object },
    dealPrice: { type: Number },
    originalPrice: { type: Number },
    discountedPercentage: { type: Number },
    deletedCheck: { type: Boolean, default: false },
    redeemQR: { type: String, default: '' },
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