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
exports.SubscribeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const subscribe_dto_1 = require("../../dto/subscribe/subscribe.dto");
const subscribe_service_1 = require("./subscribe.service");
let SubscribeController = class SubscribeController {
    constructor(_subscribeService) {
        this._subscribeService = _subscribeService;
    }
    addSubscribe(subscribeDto) {
        return this._subscribeService.addSubscription(subscribeDto);
    }
    deleteSubscription(id) {
        return this._subscribeService.deleteSubscription(id);
    }
    getSubscription(email) {
        return this._subscribeService.getSubscription(email);
    }
    getAllSubscriptions(offset = 0, limit = 10) {
        return this._subscribeService.getAllSubscriptions(offset, limit);
    }
};
__decorate([
    (0, common_1.Post)('addSubscription'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [subscribe_dto_1.SubscribeDTO]),
    __metadata("design:returntype", void 0)
], SubscribeController.prototype, "addSubscribe", null);
__decorate([
    (0, common_1.Post)('deleteSubscription/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscribeController.prototype, "deleteSubscription", null);
__decorate([
    (0, common_1.Get)('getSubscription/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubscribeController.prototype, "getSubscription", null);
__decorate([
    (0, common_1.Get)('getAllSubscriptions'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], SubscribeController.prototype, "getAllSubscriptions", null);
SubscribeController = __decorate([
    (0, swagger_1.ApiTags)('Subscription'),
    (0, common_1.Controller)('subscribe'),
    __metadata("design:paramtypes", [subscribe_service_1.SubscribeService])
], SubscribeController);
exports.SubscribeController = SubscribeController;
//# sourceMappingURL=subscribe.controller.js.map