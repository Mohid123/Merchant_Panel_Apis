"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VouchersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const vouchers_schema_1 = require("../../schema/vouchers/vouchers.schema");
const vouchersCounter_schema_1 = require("../../schema/vouchers/vouchersCounter.schema");
const vouchers_controller_1 = require("./vouchers.controller");
const vouchers_service_1 = require("./vouchers.service");
let VouchersModule = class VouchersModule {
};
VouchersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'Voucher', schema: vouchers_schema_1.VoucherSchema },
                { name: 'Counter', schema: vouchersCounter_schema_1.VoucherCounterSchema },
            ]),
        ],
        controllers: [vouchers_controller_1.VouchersController],
        providers: [vouchers_service_1.VouchersService],
    })
], VouchersModule);
exports.VouchersModule = VouchersModule;
//# sourceMappingURL=vouchers.module.js.map