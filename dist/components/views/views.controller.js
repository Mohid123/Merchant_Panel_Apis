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
exports.ViewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const views_dto_1 = require("../../dto/views/views.dto");
const views_service_1 = require("./views.service");
let ViewsController = class ViewsController {
    constructor(viewsService) {
        this.viewsService = viewsService;
    }
    createDealView(viewsDto, req) {
        return this.viewsService.createDealView(viewsDto, req);
    }
    getView(id) {
        return this.viewsService.getView(id);
    }
    getAllViews(offset = 0, limit = 10) {
        return this.viewsService.getAllViews(offset, limit);
    }
    getAllViewsByCustomer(customerID, offset = 0, limit = 10) {
        return this.viewsService.getAllViewsByCustomer(customerID, offset, limit);
    }
};
__decorate([
    (0, common_1.Post)('createDealView'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [views_dto_1.ViewsDto, Object]),
    __metadata("design:returntype", void 0)
], ViewsController.prototype, "createDealView", null);
__decorate([
    (0, common_1.Get)('getView/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ViewsController.prototype, "getView", null);
__decorate([
    (0, common_1.Get)('getAllViews'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ViewsController.prototype, "getAllViews", null);
__decorate([
    (0, common_1.Get)('getAllViewsByCustomer/:customerID'),
    __param(0, (0, common_1.Param)('customerID')),
    __param(1, (0, common_1.Query)('offset')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", void 0)
], ViewsController.prototype, "getAllViewsByCustomer", null);
ViewsController = __decorate([
    (0, swagger_1.ApiTags)('Views'),
    (0, common_1.Controller)('views'),
    __metadata("design:paramtypes", [views_service_1.ViewsService])
], ViewsController);
exports.ViewsController = ViewsController;
//# sourceMappingURL=views.controller.js.map