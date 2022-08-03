"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.BlogSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    title: { type: String, default: '' },
    text: { type: String, default: '' },
    media: { type: Array },
    deletedCheck: { type: Boolean, default: false }
}, {
    collection: 'blog'
});
mongoose.model('blog', exports.BlogSchema);
exports.BlogSchema.set('timestamps', true);
exports.BlogSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=blog.schema.js.map