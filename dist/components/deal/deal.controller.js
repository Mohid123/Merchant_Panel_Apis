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
exports.DealController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const deal_service_1 = require("./deal.service");
const deal_dto_1 = require("../../dto/deal/deal.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const jwt_admin_auth_guard_1 = require("../auth/jwt-admin-auth.guard");
const jwt_merchant_auth_guard_1 = require("../auth/jwt-merchant-auth.guard");
const updatedealstatus_dto_1 = require("../../dto/deal/updatedealstatus.dto");
let DealController = class DealController {
    constructor(dealService) {
        this.dealService = dealService;
    }
    createDeal(dealDto) {
        return this.dealService.createDeal(dealDto);
    }
    approveRejectDeal(dealID, dealStatusDto) {
        return this.dealService.approveRejectDeal(dealID, dealStatusDto);
    }
    getDeal(id) {
        return this.dealService.getDeal(id);
    }
    getDealByMerchant(merchantId) {
        return this.dealService.getDealByMerchant(merchantId);
    }
    getAllDeals(offset = 0, limit = 10) {
        return this.dealService.getAllDeals(offset, limit);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.Post)('createDeal'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deal_dto_1.DealDto]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "createDeal", null);
__decorate([
    (0, common_1.UseGuards)(jwt_admin_auth_guard_1.JwtAdminAuthGuard),
    (0, common_1.Post)('approveRejectDeal/:dealID'),
    __param(0, (0, common_1.Param)('dealID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatedealstatus_dto_1.DealStatusDto]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "approveRejectDeal", null);
__decorate([
    (0, common_1.Get)('getDeal/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDeal", null);
__decorate([
    (0, common_1.Get)('getDealByMerchant/:merchantId'),
    __param(0, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealByMerchant", null);
__decorate([
    (0, common_1.Get)('getAllDeals'),
    __param(0, (0, common_1.Query)("offset")),
    __param(1, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getAllDeals", null);
DealController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Deal'),
    (0, common_1.Controller)('deal'),
    __metadata("design:paramtypes", [deal_service_1.DealService])
], DealController);
exports.DealController = DealController;
//# sourceMappingURL=deal.controller.js.map