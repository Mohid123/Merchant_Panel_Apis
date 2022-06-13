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
exports.UtilController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const utils_service_1 = require("./utils.service");
let UtilController = class UtilController {
    constructor(UtilService) {
        this.UtilService = UtilService;
    }
    getCity(zipCode) {
        return this.UtilService.getCity(zipCode);
    }
    validateVatNumber(vatNumber) {
        return this.UtilService.validateVatNumber(vatNumber);
    }
};
__decorate([
    (0, common_1.Get)('getCity/:zipCode'),
    __param(0, (0, common_1.Param)('zipCode')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UtilController.prototype, "getCity", null);
__decorate([
    (0, common_1.Post)('validateVatNumber/:vatNumber'),
    __param(0, (0, common_1.Param)('vatNumber')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UtilController.prototype, "validateVatNumber", null);
UtilController = __decorate([
    (0, swagger_1.ApiTags)('Utils'),
    (0, common_1.Controller)('utils'),
    __metadata("design:paramtypes", [utils_service_1.UtilService])
], UtilController);
exports.UtilController = UtilController;
//# sourceMappingURL=utils.controller.js.map