"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateFavouritesSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.AffiliateFavouritesSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    affiliateMongoID: { type: String, default: '' },
    affiliateID: { type: String, default: '' },
    customerMongoID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false }
}, {
    collection: 'affiliateFvaourites'
});
exports.AffiliateFavouritesSchema.set('timestamps', true);
exports.AffiliateFavouritesSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('affiliateFvaourites', exports.AffiliateFavouritesSchema);
exports.AffiliateFavouritesSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=affiliate.schema.js.map