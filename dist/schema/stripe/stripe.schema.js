"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeSchema = void 0;
const mongoose = require("mongoose");
exports.StripeSchema = new mongoose.Schema({
    _id: { type: String },
    payment: { type: String, dafault: '0' },
    description: { type: String },
    userId: { type: String },
    stripe: { type: Object },
}, {
    collection: 'stripePayments',
});
exports.StripeSchema.set('timestamps', true);
exports.StripeSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
    },
});
mongoose.model('Stripe', exports.StripeSchema);
exports.StripeSchema.pre('save', async function (next) {
    next();
});
//# sourceMappingURL=stripe.schema.js.map