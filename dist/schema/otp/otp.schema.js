"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OtpSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.OtpSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    otp: { type: String, unique: true },
    expiryTime: { type: Number },
    isUsed: { type: Boolean, default: false },
    userEmail: { type: String },
    userID: { type: String },
}, {
    collection: 'otps',
});
mongoose.model('OTP', exports.OtpSchema);
exports.OtpSchema.set('timestamps', true);
exports.OtpSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=otp.schema.js.map