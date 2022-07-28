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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApproveMerchantDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ApproveMerchantDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], ApproveMerchantDTO.prototype, "categoryType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "vatNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ApproveMerchantDTO.prototype, "website_socialAppLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                _id: '',
                locationName: '',
                streetAddress: '',
                zipCode: '',
                city: '',
                googleMapPin: '',
                province: '',
                phoneNumber: '',
            },
        ],
    }),
    __metadata("design:type", Array)
], ApproveMerchantDTO.prototype, "locations", void 0);
exports.ApproveMerchantDTO = ApproveMerchantDTO;
//# sourceMappingURL=approveMerchant.dto.js.map