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
exports.InvoicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invoices_dto_1 = require("../../dto/invoices/invoices.dto");
const sortinvoiceamount_enum_1 = require("../../enum/sorting/sortinvoiceamount.enum");
const sortinvoicedate_enum_1 = require("../../enum/sorting/sortinvoicedate.enum");
const invoices_service_1 = require("./invoices.service");
let InvoicesController = class InvoicesController {
    constructor(_invoiceService) {
        this._invoiceService = _invoiceService;
    }
    createInvoice(invoiceDto) {
        return this._invoiceService.createInvoice(invoiceDto);
    }
    getInvoice(invoiceURL) {
        return this._invoiceService.getInvoice(invoiceURL);
    }
    getAllInvoices(offset = 0, limit = 10) {
        return this._invoiceService.getAllInvoices(offset, limit);
    }
    getAllInvoicesByMerchant(merchantID, dateFrom = 0, dateTo = 0, invoiceDate, invoiceAmount, offset = 0, limit = 10) {
        return this._invoiceService.getAllInvoicesByMerchant(merchantID, dateFrom, dateTo, invoiceDate, invoiceAmount, offset, limit);
    }
};
__decorate([
    (0, common_1.Post)('createInvoice'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [invoices_dto_1.InvoiceDTO]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "createInvoice", null);
__decorate([
    (0, common_1.Get)('getInvoice/:invoiceURL'),
    __param(0, (0, common_1.Param)('invoiceURL')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "getInvoice", null);
__decorate([
    (0, common_1.Get)('getAllInvoices'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "getAllInvoices", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: "dateFrom", type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: "dateTo", type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: "invoiceDate", enum: sortinvoicedate_enum_1.INVOICEDATEENUM, required: false }),
    (0, swagger_1.ApiQuery)({ name: "invoiceAmount", enum: sortinvoiceamount_enum_1.INVOICEAMOUNTENUM, required: false }),
    (0, common_1.Get)('getAllInvoicesByMerchant/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)("dateFrom")),
    __param(2, (0, common_1.Query)("dateTo")),
    __param(3, (0, common_1.Query)("invoiceDate")),
    __param(4, (0, common_1.Query)("invoiceAmount")),
    __param(5, (0, common_1.Query)('offset')),
    __param(6, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], InvoicesController.prototype, "getAllInvoicesByMerchant", null);
InvoicesController = __decorate([
    (0, swagger_1.ApiTags)('Invoices'),
    (0, common_1.Controller)('invoices'),
    __metadata("design:paramtypes", [invoices_service_1.InvoicesService])
], InvoicesController);
exports.InvoicesController = InvoicesController;
//# sourceMappingURL=invoices.controller.js.map