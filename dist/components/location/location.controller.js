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
exports.LocationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const location_dto_1 = require("../../dto/location/location.dto");
const updateLocation_dto_1 = require("../../dto/location/updateLocation.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const jwt_merchant_auth_guard_1 = require("../auth/jwt-merchant-auth.guard");
const location_service_1 = require("./location.service");
let LocationController = class LocationController {
    constructor(_locationService) {
        this._locationService = _locationService;
    }
    createDeal(locationDto) {
        return this._locationService.createLocation(locationDto);
    }
    updateLocation(updateLocationDto, merchantID) {
        return this._locationService.updateLocation(updateLocationDto, merchantID);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.Post)('createLocation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [location_dto_1.LocationDTO]),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "createDeal", null);
__decorate([
    (0, common_1.UseGuards)(jwt_merchant_auth_guard_1.JwtMerchantAuthGuard),
    (0, common_1.Post)('updateLocation/:merchantID'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('merchantID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [updateLocation_dto_1.UpdateLocationDTO, String]),
    __metadata("design:returntype", void 0)
], LocationController.prototype, "updateLocation", null);
LocationController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Location'),
    (0, common_1.Controller)('location'),
    __metadata("design:paramtypes", [location_service_1.LocationService])
], LocationController);
exports.LocationController = LocationController;
//# sourceMappingURL=location.controller.js.map