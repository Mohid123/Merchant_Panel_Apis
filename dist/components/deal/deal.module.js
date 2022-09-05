"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DealModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const category_module_1 = require("../category/category.module");
const deal_controller_1 = require("./deal.controller");
const deal_service_1 = require("./deal.service");
const deal_schema_1 = require("../../schema/deal/deal.schema");
const category_schema_1 = require("../../schema/category/category.schema");
const vouchersCounter_schema_1 = require("../../schema/vouchers/vouchersCounter.schema");
const subcategory_schema_1 = require("../../schema/category/subcategory.schema");
const users_schema_1 = require("../../schema/user/users.schema");
const schedule_service_1 = require("../schedule/schedule.service");
const schedule_schema_1 = require("../../schema/schedule/schedule.schema");
const stripe_schema_1 = require("../../schema/stripe/stripe.schema");
const stripe_module_1 = require("../stripe/stripe.module");
const vouchers_schema_1 = require("../../schema/vouchers/vouchers.schema");
const vouchers_module_1 = require("../vouchers/vouchers.module");
const views_schema_1 = require("../../schema/views/views.schema");
const views_service_1 = require("../views/views.service");
const preComputed_deals_schema_1 = require("../../schema/deal/preComputed-deals.schema");
const review_schema_1 = require("../../schema/review/review.schema");
let DealModule = class DealModule {
};
DealModule = __decorate([
    (0, common_1.Module)({
        imports: [
            common_1.CacheModule.register(),
            (0, common_1.forwardRef)(() => category_module_1.CategoryModule),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Deal', schema: deal_schema_1.DealSchema },
                { name: 'PreComputedDeal', schema: preComputed_deals_schema_1.PreComputedDealSchema },
                { name: 'Category', schema: category_schema_1.CategorySchema },
                { name: 'Counter', schema: vouchersCounter_schema_1.VoucherCounterSchema },
                { name: 'SubCategory', schema: subcategory_schema_1.SubCategorySchema },
                { name: 'User', schema: users_schema_1.UsersSchema },
                { name: 'Schedule', schema: schedule_schema_1.ScheduleSchema },
                { name: 'Stripe', schema: stripe_schema_1.StripeSchema },
                { name: 'Voucher', schema: vouchers_schema_1.VoucherSchema },
                { name: 'views', schema: views_schema_1.ViewsSchema },
                { name: 'Review', schema: review_schema_1.ReviewSchema },
            ]),
            stripe_module_1.StripeModule,
            vouchers_module_1.VouchersModule,
        ],
        controllers: [deal_controller_1.DealController],
        providers: [deal_service_1.DealService, schedule_service_1.ScheduleService, views_service_1.ViewsService],
    })
], DealModule);
exports.DealModule = DealModule;
//# sourceMappingURL=deal.module.js.map