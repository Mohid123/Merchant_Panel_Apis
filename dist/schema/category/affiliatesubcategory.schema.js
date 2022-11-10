"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.affiliateSubCategoriesSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.affiliateSubCategoriesSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    affiliateSubCategoryName: { type: String, default: '' },
    affiliateCategoryID: { type: String, default: '' },
    affiliateCategoryName: { type: String, default: '' },
}, {
    collection: 'affiliateSubCategories',
});
mongoose.model('affiliateSubCategories', exports.affiliateSubCategoriesSchema);
exports.affiliateSubCategoriesSchema.set('timestamps', true);
exports.affiliateSubCategoriesSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
exports.affiliateSubCategoriesSchema.index({ categoryID: 1 });
exports.affiliateSubCategoriesSchema.index({ categoryName: 1 });
//# sourceMappingURL=affiliatesubcategory.schema.js.map