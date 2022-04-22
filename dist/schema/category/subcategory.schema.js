"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubCategorySchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.SubCategorySchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    subCategoryName: { type: String, default: '' },
    categoryID: { type: String, default: '' },
    categoryName: { type: String, default: '' }
}, {
    collection: 'subCategories'
});
mongoose.model('SubCategory', exports.SubCategorySchema);
exports.SubCategorySchema.set('timestamps', true);
exports.SubCategorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=subcategory.schema.js.map