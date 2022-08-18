"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.UsersSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    userID: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String, default: '' },
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    phoneNumber: { type: String, default: '' },
    role: { type: String, default: '' },
    businessType: { type: Array, default: [] },
    legalName: { type: String, default: '' },
    tradeName: { type: String, default: '' },
    streetAddress: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    city: { type: String, default: '' },
    vatNumber: { type: String, default: '' },
    iban: { type: String, default: '' },
    bic_swiftCode: { type: String, default: '' },
    accountHolder: { type: String, default: '' },
    bankName: { type: String, default: '' },
    kycStatus: { type: Boolean, default: false },
    province: { type: String, default: '' },
    website_socialAppLink: { type: String, default: '' },
    googleMapPin: { type: String, default: '' },
    businessHours: { type: Array },
    finePrint: { type: String, default: '' },
    aboutUs: { type: String, default: '' },
    profilePicURL: { type: String, default: '' },
    profilePicBlurHash: { type: String, default: '' },
    gallery: { type: Array },
    voucherPinCode: { type: String },
    deletedCheck: { type: Boolean, default: false },
    status: { type: String, default: '' },
    newUser: { type: Boolean, default: true },
    totalVoucherSales: { type: Number, default: 0 },
    redeemedVouchers: { type: Number, default: 0 },
    purchasedVouchers: { type: Number, default: 0 },
    expiredVouchers: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 },
    paidEarnings: { type: Number, default: 0 },
    pendingEarnings: { type: Number, default: 0 },
    totalDeals: { type: Number, default: 0 },
    scheduledDeals: { type: Number, default: 0 },
    pendingDeals: { type: Number, default: 0 },
    soldDeals: { type: Number, default: 0 },
    countryCode: { type: String, default: 'BE' },
    leadSource: { type: String, default: 'web' },
    ratingsAverage: {
        type: Number,
        default: 0,
    },
    totalReviews: {
        type: Number,
        default: 0,
    },
    maxRating: {
        type: Number,
        default: 0,
    },
    minRating: {
        type: Number,
        default: 0,
    },
    isSubscribed: { type: Boolean, default: false }
}, {
    collection: 'users',
});
mongoose.model('User', exports.UsersSchema);
exports.UsersSchema.set('timestamps', true);
exports.UsersSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=users.schema.js.map