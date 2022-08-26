"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const stripe_schema_1 = require("../../schema/stripe/stripe.schema");
const users_schema_1 = require("../../schema/user/users.schema");
const stripe_controller_1 = require("./stripe.controller");
const stripe_service_1 = require("./stripe.service");
let StripeModule = class StripeModule {
};
StripeModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Stripe', schema: stripe_schema_1.StripeSchema },
                { name: 'User', schema: users_schema_1.UsersSchema },
            ]),
        ],
        providers: [stripe_service_1.StripeService],
        controllers: [stripe_controller_1.StripeController],
        exports: [stripe_service_1.StripeService],
    })
], StripeModule);
exports.StripeModule = StripeModule;
//# sourceMappingURL=stripe.module.js.map