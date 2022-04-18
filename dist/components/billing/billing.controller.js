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
exports.BillingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const billing_dto_1 = require("../../dto/billing/billing.dto");
const billingStatus_enum_1 = require("../../enum/billing/billingStatus.enum");
const sort_enum_1 = require("../../enum/sort/sort.enum");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const billing_service_1 = require("./billing.service");
let BillingController = class BillingController {
    constructor(billingService) {
        this.billingService = billingService;
    }
    createBilling(billingDto) {
        return this.billingService.createBilling(billingDto);
    }
    getBill(id) {
        return this.billingService.getBill(id);
    }
    getAllBillings(offset = 0, limit = 10) {
        return this.billingService.getAllBillings(offset, limit);
    }
    getBillingsByMerchant(paymentMethod, amount, date, status, dateFrom, dateTo, offset = 0, limit = 10, merchantId) {
        return this.billingService.getBillingsByMerchant(paymentMethod, amount, date, status, dateFrom, dateTo, offset, limit, merchantId);
    }
};
__decorate([
    (0, common_1.Post)('createBilling'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [billing_dto_1.BillingDto]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "createBilling", null);
__decorate([
    (0, common_1.Get)('getBill/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getBill", null);
__decorate([
    (0, common_1.Get)('getAllBillings'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getAllBillings", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: 'paymentMethod', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'amount', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'date', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: billingStatus_enum_1.BILLINGSTATUS, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateFrom', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'dateTo', required: false }),
    (0, common_1.Get)('getBillingsByMerchant/:merchantId'),
    __param(0, (0, common_1.Query)('paymentMethod')),
    __param(1, (0, common_1.Query)('amount')),
    __param(2, (0, common_1.Query)('date')),
    __param(3, (0, common_1.Query)('status')),
    __param(4, (0, common_1.Query)('dateFrom')),
    __param(5, (0, common_1.Query)('dateTo')),
    __param(6, (0, common_1.Query)('offset')),
    __param(7, (0, common_1.Query)('limit')),
    __param(8, (0, common_1.Param)('merchantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Number, Number, Number, Number, String]),
    __metadata("design:returntype", void 0)
], BillingController.prototype, "getBillingsByMerchant", null);
BillingController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Billing'),
    (0, common_1.Controller)('billing'),
    __metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
exports.BillingController = BillingController;
//# sourceMappingURL=billing.controller.js.map