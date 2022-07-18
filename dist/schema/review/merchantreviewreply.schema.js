"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewTextSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.ReviewTextSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    reviewID: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    voucherID: { type: String, default: "" },
    merchantName: { type: String, default: '' },
    legalName: { type: String, default: '' },
    profilePicURL: { type: String, default: '' },
    merchantReplyText: {
        type: String,
        required: [true, 'A review must not be empty.'],
        trim: true
    },
    deletedCheck: { type: Boolean, default: true }
}, {
    collection: 'reviewText'
});
exports.ReviewTextSchema.set('timestamps', true);
exports.ReviewTextSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('reviewText', exports.ReviewTextSchema);
exports.ReviewTextSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=merchantreviewreply.schema.js.map