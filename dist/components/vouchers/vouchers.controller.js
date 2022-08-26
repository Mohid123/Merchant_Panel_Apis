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
exports.VouchersController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const swagger_1 = require("@nestjs/swagger");
const multiplevouchers_dto_1 = require("../../dto/vouchers/multiplevouchers.dto");
const redeemVoucher_dto_1 = require("../../dto/vouchers/redeemVoucher.dto");
const vouchers_dto_1 = require("../../dto/vouchers/vouchers.dto");
const billingStatus_enum_1 = require("../../enum/billing/billingStatus.enum");
const sort_enum_1 = require("../../enum/sort/sort.enum");
const voucherstatus_enum_1 = require("../../enum/voucher/voucherstatus.enum");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const jwt_merchant_auth_guard_1 = require("../auth/jwt-merchant-auth.guard");
const vouchers_service_1 = require("./vouchers.service");
let VouchersController = class VouchersController {
    constructor(voucherService) {
        this.voucherService = voucherService;
    }
    createVoucher(voucherDto) {
        return this.voucherService.createVoucher(voucherDto);
    }
    getAllVouchers(merchantID, deal, voucher, amount, fee, net, status, paymentStatus, dateFrom, dateTo, voucherID = '', dealHeader = '', voucherHeader = '', voucherStatus = '', invoiceStatus = '', offset = 0, limit = 10, multipleVouchersDto) {
        return this.voucherService.getAllVouchersByMerchantID(deal, voucher, amount, fee, net, status, paymentStatus, dateFrom, dateTo, merchantID, voucherID, dealHeader, voucherHeader, voucherStatus, invoiceStatus, offset, limit, multipleVouchersDto);
    }
    searchByVoucherId(merchantID, voucherId = '', offset = 0, limit = 10) {
        return this.voucherService.searchByVoucherId(merchantID, voucherId, offset, limit);
    }
    redeemVoucher(voucherId, req) {
        return this.voucherService.redeemVoucher(voucherId, req);
    }
    getVoucherByMongoId(voucherId) {
        return this.voucherService.getVoucherByMongoId(voucherId);
    }
    redeemVoucherByMerchantPin(redeemVoucherDto) {
        return this.voucherService.redeemVoucherByMerchantPin(redeemVoucherDto);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.Post)('createVoucher'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [vouchers_dto_1.VoucherDto]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "createVoucher", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiQuery)({ name: 'deal', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'voucher', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'amount', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'fee', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'net', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: voucherstatus_enum_1.VOUCHERSTATUSENUM, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'paymentStatus', enum: billingStatus_enum_1.BILLINGSTATUS, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, common_1.Post)('getAllVouchersByMerchantID/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)('deal')),
    __param(2, (0, common_1.Query)('voucher')),
    __param(3, (0, common_1.Query)('amount')),
    __param(4, (0, common_1.Query)('fee')),
    __param(5, (0, common_1.Query)('net')),
    __param(6, (0, common_1.Query)('status')),
    __param(7, (0, common_1.Query)('paymentStatus')),
    __param(8, (0, common_1.Query)('dateFrom')),
    __param(9, (0, common_1.Query)('dateTo')),
    __param(10, (0, common_1.Query)('voucherID')),
    __param(11, (0, common_1.Query)('dealHeader')),
    __param(12, (0, common_1.Query)('voucherHeader')),
    __param(13, (0, common_1.Query)('voucherStatus')),
    __param(14, (0, common_1.Query)('invoiceStatus')),
    __param(15, (0, common_1.Query)('offset')),
    __param(16, (0, common_1.Query)('limit')),
    __param(17, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, Number, Number, String, String, String, String, String, Number, Number, multiplevouchers_dto_1.MultipleVouchersDto]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "getAllVouchers", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiQuery)({ name: 'voucherId', required: false }),
    (0, common_1.Get)('searchByVoucherId/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)('voucherId')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "searchByVoucherId", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.Get)('redeemVoucher/:voucherId'),
    __param(0, (0, common_1.Param)('voucherId')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "redeemVoucher", null);
__decorate([
    (0, common_1.Get)('getVoucherByMongoId/:voucherId'),
    __param(0, (0, common_1.Param)('voucherId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "getVoucherByMongoId", null);
__decorate([
    (0, common_1.Post)('redeemVoucherByMerchantPin/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [redeemVoucher_dto_1.RedeemVoucherDto]),
    __metadata("design:returntype", void 0)
], VouchersController.prototype, "redeemVoucherByMerchantPin", null);
VouchersController = __decorate([
    (0, swagger_1.ApiTags)('Voucher'),
    (0, common_1.Controller)('voucher'),
    __metadata("design:paramtypes", [vouchers_service_1.VouchersService])
], VouchersController);
exports.VouchersController = VouchersController;
//# sourceMappingURL=vouchers.controller.js.map