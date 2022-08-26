"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouriteSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.FavouriteSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    customerMongoID: { type: String, default: '' },
    customerID: { type: String, default: '' },
    dealMongoID: { type: String, default: '' },
    dealID: { type: String, default: '' },
    deletedCheck: { type: Boolean, default: false }
}, {
    collection: 'favourites'
});
exports.FavouriteSchema.set('timestamps', true);
exports.FavouriteSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('favourites', exports.FavouriteSchema);
exports.FavouriteSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=favourites.schema.js.map