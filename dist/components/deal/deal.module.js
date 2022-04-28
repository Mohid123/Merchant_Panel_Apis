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
let DealModule = class DealModule {
};
DealModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => category_module_1.CategoryModule),
            mongoose_1.MongooseModule.forFeature([
                { name: 'Deal', schema: deal_schema_1.DealSchema },
                { name: 'Category', schema: category_schema_1.CategorySchema },
                { name: 'Counter', schema: vouchersCounter_schema_1.VoucherCounterSchema },
                { name: 'SubCategory', schema: subcategory_schema_1.SubCategorySchema }
            ]),
        ],
        controllers: [deal_controller_1.DealController],
        providers: [deal_service_1.DealService],
    })
], DealModule);
exports.DealModule = DealModule;
//# sourceMappingURL=deal.module.js.map