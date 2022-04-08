"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategorySchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.CategorySchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    type: { type: String, default: '' },
}, {
    collection: 'categories',
});
exports.CategorySchema.set('timestamps', true);
exports.CategorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('Category', exports.CategorySchema);
exports.CategorySchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=category.schema.js.map