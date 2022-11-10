"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.affiliateCategorySchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.affiliateCategorySchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    affiliateCategoryName: { type: String, default: '' },
}, {
    collection: 'affiliateCategories',
});
exports.affiliateCategorySchema.set('timestamps', true);
exports.affiliateCategorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('affiliateCategories', exports.affiliateCategorySchema);
exports.affiliateCategorySchema.pre('save', async function (next) {
    next();
});
exports.affiliateCategorySchema.index({ affiliateCategoryName: 1 });
exports.affiliateCategorySchema.index({ _id: 1 });
//# sourceMappingURL=affiliatecategory.schema.js.map