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
const dealstatus_enum_1 = require("../../enum/deal/dealstatus.enum");
const updatedeal_dto_1 = require("../../dto/deal/updatedeal.dto");
const multipledeals_dto_1 = require("../../dto/deal/multipledeals.dto");
const multiplereviews_dto_1 = require("../../dto/review/multiplereviews.dto");
const jwt_manager_auth_guard_1 = require("../auth/jwt-manager-auth.guard");
const updateDealForCrm_dto_1 = require("../../dto/deal/updateDealForCrm.dto");
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
    deleteDeal(dealID) {
        return this.dealService.deleteDeal(dealID);
    }
    approveRejectDeal(dealID, dealStatusDto) {
        return this.dealService.approveRejectDeal(dealID, dealStatusDto);
    }
    getDeal(id) {
        return this.dealService.getDeal(id);
    }
    getDealsReviewStatsByMerchant(merchantID, dealID = '', offset = 0, limit = 10, multipleReviewsDto) {
        return this.dealService.getDealsReviewStatsByMerchant(merchantID, dealID, offset, limit, multipleReviewsDto);
    }
    getAllDeals(offset = 0, limit = 10, req) {
        return this.dealService.getAllDeals(req, offset, limit);
    }
    getDealsByMerchantID(merchantID, dealHeader, price, startDate, endDate, availableVoucher, soldVoucher, status, dateFrom, dateTo, dealID = '', header = '', dealStatus = '', offset = 0, limit = 10, multipleDealsDto) {
        return this.dealService.getDealsByMerchantID(merchantID, dealHeader, price, startDate, endDate, availableVoucher, soldVoucher, status, dateFrom, dateTo, dealID, header, dealStatus, offset, limit, multipleDealsDto);
    }
    getDealsByMerchantIDForCustomerPanel(merchantID, offset = 0, limit = 10) {
        return this.dealService.getDealsByMerchantIDForCustomerPanel(merchantID, offset, limit);
    }
    getSalesStatistics(req) {
        return this.dealService.getSalesStatistics(req);
    }
    getDealReviews(dealID, createdAt, totalRating, rating, offset = 0, limit = 10) {
        return this.dealService.getDealReviews(offset, limit, rating, dealID, createdAt, totalRating);
    }
    getTopRatedDeals(merchantID) {
        return this.dealService.getTopRatedDeals(merchantID);
    }
    getNewDeals(offset = 0, limit = 10) {
        return this.dealService.getNewDeals(offset, limit);
    }
    getLowPriceDeals(price, offset = 0, limit = 10) {
        return this.dealService.getLowPriceDeals(price, offset, limit);
    }
    getDiscountedDeals(percentage, offset = 0, limit = 10) {
        return this.dealService.getDiscountedDeals(percentage, offset, limit);
    }
    getSpecialOfferDeals(offset = 0, limit = 10) {
        return this.dealService.getSpecialOfferDeals(offset, limit);
    }
    getHotDeals(offset = 0, limit = 10) {
        return this.dealService.getHotDeals(offset, limit);
    }
    getNewFavouriteDeal(offset = 0, limit = 10) {
        return this.dealService.getNewFavouriteDeal(offset, limit);
    }
    getNearByDeals(lat, lng, distance, offset = 0, limit = 10) {
        return this.dealService.getNearByDeals(lat, lng, distance, offset, limit);
    }
    searchDeals(header = '', offset = 0, limit = 10) {
        return this.dealService.searchDeals(header, offset, limit);
    }
    getSimilarDeals(categoryName, subCategoryName, offset = 0, limit = 10) {
        return this.dealService.getSimilarDeals(categoryName, subCategoryName, offset, limit);
    }
    getDealByID(dealID) {
        return this.dealService.getDealByID(dealID);
    }
    updateDealByID(updateDealDto) {
        return this.dealService.updateDealByID(updateDealDto);
    }
};
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('createDeal'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [deal_dto_1.DealDto, Object]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "createDeal", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('updateDeal/:dealID'),
    __param(0, (0, common_1.Param)('dealID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatedeal_dto_1.UpdateDealDto]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "updateDeal", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('deleteDeal/:dealID'),
    __param(0, (0, common_1.Param)('dealID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "deleteDeal", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_admin_auth_guard_1.JwtAdminAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
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
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('getDealsReviewStatsByMerchant/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)('dealID')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('limit')),
    __param(4, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number, multiplereviews_dto_1.MultipleReviewsDto]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealsReviewStatsByMerchant", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getAllDeals'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getAllDeals", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiQuery)({ name: 'dealHeader', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'price', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'availableVoucher', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'soldVoucher', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: dealstatus_enum_1.DEALSTATUS, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, common_1.Post)('getDealsByMerchantID/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)('dealHeader')),
    __param(2, (0, common_1.Query)('price')),
    __param(3, (0, common_1.Query)('startDate')),
    __param(4, (0, common_1.Query)('endDate')),
    __param(5, (0, common_1.Query)('availableVoucher')),
    __param(6, (0, common_1.Query)('soldVoucher')),
    __param(7, (0, common_1.Query)('status')),
    __param(8, (0, common_1.Query)('dateFrom')),
    __param(9, (0, common_1.Query)('dateTo')),
    __param(10, (0, common_1.Query)('dealID')),
    __param(11, (0, common_1.Query)('header')),
    __param(12, (0, common_1.Query)('dealStatus')),
    __param(13, (0, common_1.Query)('offset')),
    __param(14, (0, common_1.Query)('limit')),
    __param(15, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String, String, Number, Number, String, String, String, Number, Number, multipledeals_dto_1.MultipleDealsDto]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealsByMerchantID", null);
__decorate([
    (0, common_1.Get)('getDealsByMerchantIDForCustomerPanel/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealsByMerchantIDForCustomerPanel", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getSalesStatistics'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getSalesStatistics", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'createdAt', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'totalRating', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'rating', required: false }),
    (0, common_1.Get)('getDealReviews/:dealID'),
    __param(0, (0, common_1.Param)('dealID')),
    __param(1, (0, common_1.Query)('createdAt')),
    __param(2, (0, common_1.Query)('totalRating')),
    __param(3, (0, common_1.Query)('rating')),
    __param(4, (0, common_1.Query)('offset')),
    __param(5, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealReviews", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getTopRatedDeals/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getTopRatedDeals", null);
__decorate([
    (0, common_1.Get)('getNewDeals'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getNewDeals", null);
__decorate([
    (0, common_1.Get)('getLowPriceDeals/:price'),
    __param(0, (0, common_1.Param)('price')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getLowPriceDeals", null);
__decorate([
    (0, common_1.Get)('getDiscountedDeals/:percentage'),
    __param(0, (0, common_1.Param)('percentage')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDiscountedDeals", null);
__decorate([
    (0, common_1.Get)('getSpecialOfferDeals'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getSpecialOfferDeals", null);
__decorate([
    (0, common_1.Get)('getHotDeals'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getHotDeals", null);
__decorate([
    (0, common_1.Get)('getNewFavouriteDeal'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getNewFavouriteDeal", null);
__decorate([
    (0, common_1.Get)('getNearByDeals'),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __param(2, (0, common_1.Query)('distance')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Number, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getNearByDeals", null);
__decorate([
    (0, common_1.Get)('searchDeals'),
    __param(0, (0, common_1.Query)('header')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "searchDeals", null);
__decorate([
    (0, common_1.Get)('getSimilarDeals/:categoryName/:subCategoryName'),
    __param(0, (0, common_1.Param)('categoryName')),
    __param(1, (0, common_1.Param)('subCategoryName')),
    __param(2, (0, common_1.Query)('offset')),
    __param(3, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getSimilarDeals", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_manager_auth_guard_1.JwtManagerAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getDealByID/:dealID'),
    __param(0, (0, common_1.Param)('dealID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "getDealByID", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_manager_auth_guard_1.JwtManagerAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('updateDealByID'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateDealForCrm_dto_1.UpdateDealForCRMDTO]),
    __metadata("design:returntype", void 0)
], DealController.prototype, "updateDealByID", null);
DealController = __decorate([
    (0, swagger_1.ApiTags)('Deal'),
    (0, common_1.Controller)('deal'),
    __metadata("design:paramtypes", [deal_service_1.DealService])
], DealController);
exports.DealController = DealController;
//# sourceMappingURL=deal.controller.js.map