"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoucherCounterSchema = void 0;
const mongoose = require("mongoose");
exports.VoucherCounterSchema = new mongoose.Schema({
    _id: { type: String },
    sequenceValue: { type: Number },
});
mongoose.model('Counter', exports.VoucherCounterSchema);
exports.VoucherCounterSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=vouchersCounter.schema.js.map