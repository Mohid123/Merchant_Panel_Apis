"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.DealSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    dealID: { type: String, unique: true },
    merchantMongoID: { type: String },
    merchantID: { type: String },
    dealHeader: { type: String, default: '' },
    subTitle: { type: String, default: '' },
    highlights: { type: String, default: '' },
    categoryID: { type: String, default: '' },
    categoryName: { type: String },
    subCategoryID: { type: String, default: '' },
    subCategory: { type: String, default: '' },
    mediaUrl: { type: Array },
    startDate: { type: Number },
    endDate: { type: Number },
    subDeals: { type: Array },
    availableVouchers: { type: Number, default: 0 },
    soldVouchers: { type: Number, default: 0 },
    aboutThisDeal: { type: String, default: '' },
    minDealPrice: { type: Number, default: 0 },
    minOriginalPrice: { type: Number, default: 0 },
    minDiscountPercentage: { type: Number, default: 0 },
    readMore: { type: String, default: '' },
    finePrints: { type: String, default: '' },
    dealStatus: { type: String, default: '' },
    netEarnings: { type: Number, default: 0 },
    deletedCheck: { type: Boolean, default: false },
    isCollapsed: { type: Boolean, default: false },
    isDuplicate: { type: Boolean, default: false },
    isSpecialOffer: { type: Boolean, default: false },
    dealPreviewURL: { type: String, default: '' },
    editDealURL: { type: String, default: '' },
    reviewMediaUrl: { type: Array },
    ratingsAverage: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be above 0.0'],
        max: [5, 'Rating must be below 5.0'],
        set: (val) => Math.round(val * 10) / 10,
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
    pageNumber: { type: Number, default: 1 },
}, {
    collection: 'deals',
});
exports.DealSchema.set('timestamps', true);
exports.DealSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('Deal', exports.DealSchema);
exports.DealSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=deal.schema.js.map