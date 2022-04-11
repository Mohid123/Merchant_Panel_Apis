"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.DealSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    title: { type: String, default: '' },
    subTitle: { type: String, default: '' },
    description: { type: String, default: '' },
    categoryType: { type: mongoose.Schema.Types.String, ref: 'Category' },
    categoryName: { type: String },
    mediaUrl: [String],
    startDate: { type: Number },
    endDate: { type: Number },
    vouchers: { type: Array },
    termsAndCondition: { type: String },
    merchantId: { type: String },
    dealStatus: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false }
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