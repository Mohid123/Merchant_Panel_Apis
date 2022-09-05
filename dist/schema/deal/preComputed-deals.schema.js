"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreComputedDealSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.PreComputedDealSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    data: { type: Array },
    methodName: { type: String },
    totalCount: { type: Number },
    filterValue: { type: Number },
}, {
    collection: 'precomputed-deals',
});
exports.PreComputedDealSchema.set('timestamps', true);
exports.PreComputedDealSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('PreComputedDeal', exports.PreComputedDealSchema);
exports.PreComputedDealSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=preComputed-deals.schema.js.map