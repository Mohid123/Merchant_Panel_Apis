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
exports.SignUpDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class SignUpDTO {
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "businessType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "legalName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "streetAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SignUpDTO.prototype, "zipCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "province", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SignUpDTO.prototype, "website_socialAppLink", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SignUpDTO.prototype, "newUser", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: [
            {
                day: 'MN',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'TU',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'WD',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'TH',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'FR',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'SA',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
            {
                day: 'SU',
                firstStartTime: '10:00',
                firstEndTime: '13:00',
                secondStartTime: '14:00',
                secondEndTime: '18:00',
                isWorkingDay: false,
            },
        ]
    }),
    __metadata("design:type", Array)
], SignUpDTO.prototype, "businessHours", void 0);
exports.SignUpDTO = SignUpDTO;
//# sourceMappingURL=signup.dto.js.map