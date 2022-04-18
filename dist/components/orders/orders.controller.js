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
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const sortamount_enum_1 = require("../../enum/sorting/sortamount.enum");
const sortcustomername_enum_1 = require("../../enum/sorting/sortcustomername.enum");
const sortfee_enum_1 = require("../../enum/sorting/sortfee.enum");
const sortnet_enum_1 = require("../../enum/sorting/sortnet.enum");
const sorttransactiondate_enum_1 = require("../../enum/sorting/sorttransactiondate.enum");
const voucherstatus_enum_1 = require("../../enum/voucher/voucherstatus.enum");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const orders_service_1 = require("./orders.service");
let OrdersController = class OrdersController {
    constructor(_orderService) {
        this._orderService = _orderService;
    }
    addOrder() { }
    getOrder() { }
    getAllOrder() { }
    getAllOrderByMerchant(merchantID, dateFrom = 0, dateTo = 0, Name, Date, Amount, Fee, Net, filterStatus, offset = 0, limit = 10) {
        return this._orderService.getOrdersByMerchant(merchantID, dateFrom, dateTo, Name, Date, Amount, Fee, Net, filterStatus, offset, limit);
    }
};
__decorate([
    (0, common_1.Post)('addOrder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "addOrder", null);
__decorate([
    (0, common_1.Get)('getOrder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getOrder", null);
__decorate([
    (0, common_1.Get)('getAllOrder'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getAllOrder", null);
__decorate([
    (0, swagger_1.ApiQuery)({ name: "dateFrom", type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: "dateTo", type: Number, required: false }),
    (0, swagger_1.ApiQuery)({ name: "Name", enum: sortcustomername_enum_1.NAMEENUM, required: false }),
    (0, swagger_1.ApiQuery)({ name: "Date", enum: sorttransactiondate_enum_1.TRANSACTIONDATEENUM, required: false }),
    (0, swagger_1.ApiQuery)({ name: "Amount", enum: sortamount_enum_1.AMOUNTENUM, required: false }),
    (0, swagger_1.ApiQuery)({ name: "Fee", enum: sortamount_enum_1.AMOUNTENUM, required: false }),
    (0, swagger_1.ApiQuery)({ name: "Net", enum: sortnet_enum_1.NETENUM, required: false }),
    (0, swagger_1.ApiQuery)({ name: "filterStatus", enum: voucherstatus_enum_1.VOUCHERSTATUSENUM, required: false }),
    (0, common_1.Get)('getAllOrderByMerchant/:merchantID'),
    __param(0, (0, common_1.Param)('merchantID')),
    __param(1, (0, common_1.Query)("dateFrom")),
    __param(2, (0, common_1.Query)("dateTo")),
    __param(3, (0, common_1.Query)("Name")),
    __param(4, (0, common_1.Query)("Date")),
    __param(5, (0, common_1.Query)("Amount")),
    __param(6, (0, common_1.Query)("Fee")),
    __param(7, (0, common_1.Query)("Net")),
    __param(8, (0, common_1.Query)("filterStatus")),
    __param(9, (0, common_1.Query)("offset")),
    __param(10, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String, String, String, String, Number, Number]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getAllOrderByMerchant", null);
OrdersController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Orders'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
exports.OrdersController = OrdersController;
//# sourceMappingURL=orders.controller.js.map