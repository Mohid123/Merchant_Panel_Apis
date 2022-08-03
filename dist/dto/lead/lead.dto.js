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
exports.LeadDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class LeadDto {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Array)
], LeadDto.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "legalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "streetAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], LeadDto.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "vatNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "website_socialAppLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "googleMapPin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                day: 'MN',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: '',
            },
            {
                day: 'TU',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: '',
            },
            {
                day: 'WD',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: '',
            },
            {
                day: 'TH',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: '',
            },
            {
                day: 'FR',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: '',
            },
            {
                day: 'SA',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: '',
            },
            {
                day: 'SU',
                firstStartTime: '',
                firstEndTime: '',
                secondStartTime: '',
                secondEndTime: '',
            },
        ],
    }),
    __metadata("design:type", Array)
], LeadDto.prototype, "businessHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "finePrint", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "aboutUs", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "profilePicURL", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "profilePicBlurHash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], LeadDto.prototype, "deletedCheck", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "countryCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], LeadDto.prototype, "leadSource", void 0);
exports.LeadDto = LeadDto;
//# sourceMappingURL=lead.dto.js.map