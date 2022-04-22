"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
const validator = require('validator');
exports.ReviewSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    dealId: { type: String, default: '' },
    customerID: { type: String, default: '' },
    merchantID: { type: String, default: '' },
    text: {
        type: String,
        required: [true, 'A review must not be empty.'],
        trim: true,
    },
    rating: {
        type: Number,
        min: [1, 'Rating must be above or equal to 1.0'],
        max: [5, 'Rating must be below or equal to 5.0'],
    },
    customerEmail: {
        type: String,
        required: [true, 'Please provide email'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
    customerName: { type: String, default: '' },
    profilePicURL: { type: String, default: '' },
}, {
    collection: 'reviews',
});
exports.ReviewSchema.set('timestamps', true);
exports.ReviewSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('Review', exports.ReviewSchema);
exports.ReviewSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=review.schema.js.map