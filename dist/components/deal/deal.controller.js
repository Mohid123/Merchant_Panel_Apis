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
const sort_enum_1 = require("../../enum/sort/sort.enum");
const updateDeal_dto_1 = require("../../dto/deal/updateDeal.dto");
let DealController = class DealController {
    constructor(dealService) {
        this.dealService = dealService;
    }
    createDeal(dealDto, req) {
        return this.dealService.createDeal(dealDto, req);
    }
    updateDeal(dealID, updateDealDto) {
        return this.dealService.updateDeal(updateDealDto, dealID);
    }
    approveRejectDeal(dealID, dealStatusDto) {
        return this.dealService.approveRejectDeal(dealID, dealStatusDto);
    }
    getDeal(id) {
        return this.dealService.getDeal(id);
    }
    getDealsReviewStatsByMerchant(merchantID, offset = 0, limit = 10) {
        return this.dealService.getDealsReviewStatsByMerchant(merchantID, offset, limit);
    }
    getAllDeals(offset = 0, limit = 10, req) {
        return this.dealService.getAllDeals(req, offset, limit);
    }
    getDealsByMerchantID(merchantID, title, price, startDate, endDate, dateFrom, dateTo, offset = 0, limit = 10) {
        return this.dealService.getDealsByMerchantID(merchantID, title, price, startDate, endDate, dateFrom, dateTo, offset, limit);
    }
    getSalesStatistics(req) {
        return this.dealService.getSalesStatistics(req);
    }
    getDealReviews(dealID, rating, offset = 0, limit = 10) {
        return this.dealService.getDealReviews(offset, limit, rating, dealID);
    }
    getTopRatedDeals(merchantID) {
        return this.dealService.getTopRatedDeals(merchantID);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.Post)('createDeal'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deal_dto_1.DealDto, Object]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "createDeal", null);
__decorate([
    (0, common_1.UseGuards)(jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.Post)('updateDeal/:dealID'),
    __param(0, (0, common_1.Param)('dealID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updateDeal_dto_1.UpdateDealDto]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "updateDeal", null);
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
    (0, common_1.Get)('getDealsReviewStatsByMerchant/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealsReviewStatsByMerchant", null);
__decorate([
    (0, common_1.Get)('getAllDeals'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getAllDeals", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'title', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'price', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, common_1.Get)('getDealsByMerchantID/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)('title')),
    __param(2, (0, common_1.Query)('price')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('dateFrom')),
    __param(6, (0, common_1.Query)('dateTo')),
    __param(7, (0, common_1.Query)('offset')),
    __param(8, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealsByMerchantID", null);
__decorate([
    (0, common_1.Get)('getSalesStatistics'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getSalesStatistics", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'rating', required: false }),
    (0, common_1.Get)('getDealReviews/:dealID'),
    __param(0, (0, common_1.Param)('dealID')),
    __param(1, (0, common_1.Query)('rating')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealReviews", null);
__decorate([
    (0, common_1.Get)('getTopRatedDeals/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getTopRatedDeals", null);
DealController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Deal'),
    (0, common_1.Controller)('deal'),
    __metadata("design:paramtypes", [deal_service_1.DealService])
], DealController);
exports.DealController = DealController;
//# sourceMappingURL=deal.controller.js.map