"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const review_controller_1 = require("./review.controller");
const review_service_1 = require("./review.service");
const review_schema_1 = require("../../schema/review/review.schema");
const deal_schema_1 = require("../../schema/deal/deal.schema");
const users_schema_1 = require("../../schema/user/users.schema");
const merchantreviewreply_schema_1 = require("../../schema/review/merchantreviewreply.schema");
const vouchers_schema_1 = require("../../schema/vouchers/vouchers.schema");
let ReviewModule = class ReviewModule {
};
ReviewModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Review', schema: review_schema_1.ReviewSchema },
                { name: 'Deal', schema: deal_schema_1.DealSchema },
                { name: 'User', schema: users_schema_1.UsersSchema },
                { name: 'reviewText', schema: merchantreviewreply_schema_1.ReviewTextSchema },
                { name: 'Voucher', schema: vouchers_schema_1.VoucherSchema },
            ]),
        ],
        controllers: [review_controller_1.ReviewController],
        providers: [review_service_1.ReviewService],
    })
], ReviewModule);
exports.ReviewModule = ReviewModule;
//# sourceMappingURL=review.module.js.map