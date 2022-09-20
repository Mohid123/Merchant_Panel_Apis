"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealCategoryAnalyticsSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.DealCategoryAnalyticsSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    customerID: { type: String, default: '' },
    categoryName: { type: String, default: '' },
    count: { type: Number, default: 0 },
}, {
    collection: 'categories-Analytics'
});
exports.DealCategoryAnalyticsSchema.set('timestamps', true);
exports.DealCategoryAnalyticsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('categories-Analytics', exports.DealCategoryAnalyticsSchema);
exports.DealCategoryAnalyticsSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=dealcategoryanalytics.schema.js.map