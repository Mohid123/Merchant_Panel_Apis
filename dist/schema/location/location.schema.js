"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationSchema = void 0;
const mongoose = require("mongoose");
const utils_1 = require("../../components/file-management/utils/utils");
exports.LocationSchema = new mongoose.Schema({
    _id: { type: String, default: utils_1.generateStringId },
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: 'Point',
        },
        coordinates: [Number],
    },
    merchantID: { type: String },
    locationName: { type: String },
    streetAddress: { type: String },
    zipCode: { type: String },
    city: { type: String },
    googleMapPin: { type: String },
    province: { type: String },
    phoneNumber: { type: String },
    plusCode: { type: String },
}, {
    collection: 'locations',
});
mongoose.model('Location', exports.LocationSchema);
exports.LocationSchema.set('timestamps', true);
exports.LocationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
//# sourceMappingURL=location.schema.js.map