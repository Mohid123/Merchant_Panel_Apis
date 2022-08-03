"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const media_upload_module_1 = require("./components/file-management/media-upload/media-upload.module");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const deal_module_1 = require("./components/deal/deal.module");
const category_module_1 = require("./components/category/category.module");
const review_module_1 = require("./components/review/review.module");
const auth_module_1 = require("./components/auth/auth.module");
const users_module_1 = require("./components/users/users.module");
const billing_module_1 = require("./components/billing/billing.module");
const orders_module_1 = require("./components/orders/orders.module");
const activity_module_1 = require("./components/activity/activity.module");
const vouchers_module_1 = require("./components/vouchers/vouchers.module");
const invoices_module_1 = require("./components/invoices/invoices.module");
const utils_module_1 = require("./components/utils/utils.module");
const leads_module_1 = require("./components/leads/leads.module");
const location_module_1 = require("./components/location/location.module");
const blog_module_1 = require("./components/blog/blog.module");
const subscribe_module_1 = require("./components/subscribe/subscribe.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: 'src/config/development.env',
                isGlobal: true,
            }),
            mongoose_1.MongooseModule.forRoot(process.env.MONGO_URI),
            auth_module_1.AuthModule.forRoot(),
            users_module_1.UsersModule,
            deal_module_1.DealModule,
            category_module_1.CategoryModule,
            orders_module_1.OrdersModule,
            review_module_1.ReviewModule,
            billing_module_1.BillingModule,
            activity_module_1.ActivityModule,
            media_upload_module_1.MediaUploadModule,
            vouchers_module_1.VouchersModule,
            invoices_module_1.InvoicesModule,
            leads_module_1.LeadsModule,
            location_module_1.LocationModule,
            blog_module_1.BlogModule,
            subscribe_module_1.SubscribeModule,
            utils_module_1.UtilModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map