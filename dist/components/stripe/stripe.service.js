"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const Stripe = require('stripe');
let StripeService = class StripeService {
    constructor(_stripeModel, _userModel) {
        this._stripeModel = _stripeModel;
        this._userModel = _userModel;
    }
    async checkout(stripePaymentDto, req) {
        try {
            const payment = parseFloat(stripePaymentDto.payment) * 100;
            const key = process.env.stripeSecretKey;
            const stripe = Stripe(key);
            const token = await stripe.tokens.create({
                card: {
                    number: stripePaymentDto.card.number,
                    exp_month: stripePaymentDto.card.expMonth,
                    exp_year: stripePaymentDto.card.expYear,
                    cvc: stripePaymentDto.card.cvc,
                },
            }, {
                apiKey: key,
            });
            const customer = await stripe.customers.create({
                source: token.id,
                metadata: {
                    userId: req.user.id,
                },
            }, {
                apiKey: key,
            });
            const user = await this._userModel.updateOne({
                _id: req.user.id,
            }, {
                stripeCustomerID: customer.id,
            });
            const charge = await stripe.charges.create({
                amount: payment,
                currency: 'EUR',
                description: stripePaymentDto.description,
                customer: customer.id,
            }, {
                apiKey: key,
            });
            const obj = {
                _id: charge.id,
                payment: stripePaymentDto.payment,
                description: stripePaymentDto.description,
                userId: req.user.id,
                stripe: { customer, charge },
            };
            delete obj.stripe.charge.payment_method_details.card.checks;
            delete obj.stripe.charge.payment_method_details.card.exp_month;
            delete obj.stripe.charge.payment_method_details.card.exp_year;
            delete obj.stripe.charge.source.cvc_check;
            delete obj.stripe.charge.source.exp_month;
            delete obj.stripe.charge.source.exp_year;
            delete obj.stripe.charge.source.fingerprint;
            await new this._stripeModel(obj).save();
            return { customer, charge };
        }
        catch (err) {
            console.log(err);
            throw new common_1.HttpException('Invalid Card Details', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
StripeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Stripe')),
    __param(1, (0, mongoose_1.InjectModel)('User')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], StripeService);
exports.StripeService = StripeService;
//# sourceMappingURL=stripe.service.js.map