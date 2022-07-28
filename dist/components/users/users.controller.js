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
const updatepassword_dto_1 = require("../../dto/user/updatepassword.dto");
const userstatus_enum_1 = require("../../enum/user/userstatus.enum");
const kyc_dto_1 = require("../../dto/user/kyc.dto");
const updatehours_dto_1 = require("../../dto/user/updatehours.dto");
const updatemerchantprofile_dto_1 = require("../../dto/user/updatemerchantprofile.dto");
const users_dto_1 = require("../../dto/user/users.dto");
const jwt_admin_auth_guard_1 = require("../auth/jwt-admin-auth.guard");
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
    updateMerchantprofile(merchantID, usersDto) {
        return this._usersService.updateMerchantprofile(merchantID, usersDto);
    }
    updateBusinessHours(updateHoursDTO) {
        return this._usersService.updateBusinessHours(updateHoursDTO);
    }
    geUserById(id) {
        return this._usersService.getUserById(id);
    }
    getUserStats(id) {
        return this._usersService.getMerchantStats(id);
    }
    getAllUsers(offset = 0, limit = 10) {
        return this._usersService.getAllUsers(offset, limit);
    }
    resetPassword(resetPasswordDto, req) {
        return this._usersService.resetPassword(resetPasswordDto, req);
    }
    getPendingUsers(offset = 0, limit = 10) {
        return this._usersService.getPendingUsers(offset, limit);
    }
    approvePendingUsers(status, userID) {
        return this._usersService.approvePendingUsers(status, userID);
    }
    validateVatNumber(vatNumber) {
        return this._usersService.validateVatNumber(vatNumber);
    }
    approveMerchant(id, approveMerchantDto) {
        return this._usersService.approveMerchant(id, approveMerchantDto);
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
    (0, common_1.UseGuards)(jwt_admin_auth_guard_1.JwtAdminAuthGuard),
    (0, common_1.Get)('getPendingUsers'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getPendingUsers", null);
__decorate([
    (0, common_1.UseGuards)(jwt_admin_auth_guard_1.JwtAdminAuthGuard),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: userstatus_enum_1.USERSTATUS, required: false }),
    (0, common_1.Get)('approvePendingUsers/:userID'),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Param)('userID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "approvePendingUsers", null);
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
    (0, common_1.Post)('approveMerchant/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, approveMerchant_dto_1.ApproveMerchantDTO]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "approveMerchant", null);
UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map