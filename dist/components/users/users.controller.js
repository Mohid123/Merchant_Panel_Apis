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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const resetPassword_dto_1 = require("../../dto/resetPasswordDto/resetPassword.dto");
const approveMerchant_dto_1 = require("../../dto/user/approveMerchant.dto");
const updatecustomerprofile_dto_1 = require("../../dto/user/updatecustomerprofile.dto");
const updatemerchantfromcrm_dto_1 = require("../../dto/user/updatemerchantfromcrm.dto");
const updatepassword_dto_1 = require("../../dto/user/updatepassword.dto");
const voucherpincode_dto_1 = require("../../dto/user/voucherpincode.dto");
const sort_enum_1 = require("../../enum/sort/sort.enum");
const userstatus_enum_1 = require("../../enum/user/userstatus.enum");
const kyc_dto_1 = require("../../dto/user/kyc.dto");
const updatehours_dto_1 = require("../../dto/user/updatehours.dto");
const updatemerchantprofile_dto_1 = require("../../dto/user/updatemerchantprofile.dto");
const users_dto_1 = require("../../dto/user/users.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const jwt_manager_auth_guard_1 = require("../auth/jwt-manager-auth.guard");
const users_service_1 = require("./users.service");
let UsersController = class UsersController {
    constructor(_usersService) {
        this._usersService = _usersService;
    }
    addUser(usersDto) {
        return this._usersService.addUser(usersDto);
    }
    changePassword(id, updatepasswordDto) {
        return this._usersService.changePassword(id, updatepasswordDto);
    }
    completeKYC(merchantID, kycDto) {
        return this._usersService.completeKYC(merchantID, kycDto);
    }
    updateVoucherPinCode(merchantID, voucherPinCodeDto) {
        return this._usersService.updateVoucherPinCode(merchantID, voucherPinCodeDto);
    }
    updateMerchantprofile(merchantID, usersDto) {
        return this._usersService.updateMerchantprofile(merchantID, usersDto);
    }
    updateCustomerProfile(customerID, usersDto) {
        return this._usersService.updateCustomerProfile(customerID, usersDto);
    }
    getCustomer(id) {
        return this._usersService.getCustomer(id);
    }
    updateBusinessHours(updateHoursDTO) {
        return this._usersService.updateBusinessHours(updateHoursDTO);
    }
    geUserById(id) {
        return this._usersService.getUserById(id);
    }
    getMerchantByID(merchantID) {
        return this._usersService.getMerchantByID(merchantID);
    }
    getMerchantForCRM(merchantID) {
        return this._usersService.getMerchantForCRM(merchantID);
    }
    updateMerchantFromCRM(merchantID, updateMerchantFromCrmDto) {
        return this._usersService.updateMerchantFromCRM(merchantID, updateMerchantFromCrmDto);
    }
    getUserStats(id) {
        return this._usersService.getMerchantStats(id);
    }
    getAllUsers(offset = 0, limit = 10) {
        return this._usersService.getAllUsers(offset, limit);
    }
    searchAllAffiliates(searchAffiliates = '', categories = '', sortAffiliates, offset = 0, limit = 10, req) {
        return this._usersService.searchAllAffiliates(searchAffiliates, categories, sortAffiliates, offset, limit, req);
    }
    getPopularAffiliates(offset = 0, limit = 10, req) {
        return this._usersService.getPopularAffiliates(offset, limit, req);
    }
    getFavouriteAffiliates(offset = 0, limit = 10, req) {
        return this._usersService.getFavouriteAffiliates(offset, limit, req);
    }
    resetPassword(resetPasswordDto, req) {
        return this._usersService.resetPassword(resetPasswordDto, req);
    }
    getPendingUsers(offset = 0, limit = 10) {
        return this._usersService.getPendingUsers(offset, limit);
    }
    approvePendingMerchants(status, userID) {
        return this._usersService.approvePendingMerchants(status, userID);
    }
    approvePendingAffiliates(status, userID) {
        return this._usersService.approvePendingAffiliates(status, userID);
    }
    validateVatNumber(vatNumber) {
        return this._usersService.validateVatNumber(vatNumber);
    }
    approveMerchant(id, approveMerchantDto) {
        return this._usersService.approveMerchant(id, approveMerchantDto);
    }
    approveAffiliate(id, approveAffiliateDto) {
        return this._usersService.approveAffiliate(id, approveAffiliateDto);
    }
    getCustomerByID(customerID) {
        return this._usersService.getCustomerByID(customerID);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('addUser'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.UsersDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "addUser", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('changePassword/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatepassword_dto_1.UpdatePasswordDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('completeKYC/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, kyc_dto_1.KycDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "completeKYC", null);
__decorate([
    (0, common_1.Post)('updateVoucherPinCode/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, voucherpincode_dto_1.VoucherPinCodeDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateVoucherPinCode", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('updateMerchantprofile/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatemerchantprofile_dto_1.UpdateMerchantProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMerchantprofile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('updateCustomerProfile/:customerID'),
    __param(0, (0, common_1.Param)('customerID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatecustomerprofile_dto_1.UpdateCustomerProfileDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateCustomerProfile", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getCustomer/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getCustomer", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('updateBusinessHours'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updatehours_dto_1.UpdateHoursDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateBusinessHours", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getUserById/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "geUserById", null);
__decorate([
    (0, common_1.Get)('getMerchantByID/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMerchantByID", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_manager_auth_guard_1.JwtManagerAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getMerchantForCRM/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMerchantForCRM", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_manager_auth_guard_1.JwtManagerAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('updateMerchantFromCRM/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, updatemerchantfromcrm_dto_1.UpdateMerchantFromCrmDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMerchantFromCRM", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getMerchantStats/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getAllUsers'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'searchAffiliates', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'sortAffiliates', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'categories', required: false }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('searchAllAffiliates'),
    __param(0, (0, common_1.Query)('searchAffiliates')),
    __param(1, (0, common_1.Query)('categories')),
    __param(2, (0, common_1.Query)('sortAffiliates')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "searchAllAffiliates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getPopularAffiliates'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getPopularAffiliates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getFavouriteAffiliates'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getFavouriteAffiliates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('/resetPassword'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [resetPassword_dto_1.ResetPasswordDto, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('getPendingUsers'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getPendingUsers", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'status', enum: userstatus_enum_1.USERSTATUS, required: false }),
    (0, common_1.Get)('approvePendingMerchants/:userID'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Param)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "approvePendingMerchants", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'status', enum: userstatus_enum_1.USERSTATUS, required: false }),
    (0, common_1.Get)('approvePendingAffiliates/:userID'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Param)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "approvePendingAffiliates", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('validateVatNumber/:vatNumber'),
    __param(0, (0, common_1.Param)('vatNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "validateVatNumber", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_manager_auth_guard_1.JwtManagerAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiQuery)({ name: 'id', required: false }),
    (0, common_1.Post)('approveMerchant'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approveMerchant_dto_1.ApproveMerchantDTO]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "approveMerchant", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_manager_auth_guard_1.JwtManagerAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiQuery)({ name: 'id', required: false }),
    (0, common_1.Post)('approveAffiliate'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approveMerchant_dto_1.ApproveMerchantDTO]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "approveAffiliate", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_manager_auth_guard_1.JwtManagerAuthGuard),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('getCustomerByID/:customerID'),
    __param(0, (0, common_1.Param)('customerID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getCustomerByID", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map