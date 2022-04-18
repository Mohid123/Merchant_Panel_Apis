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
exports.ActivityController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const activity_dto_1 = require("../../dto/activity/activity.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const activity_service_1 = require("./activity.service");
let ActivityController = class ActivityController {
    constructor(activityService) {
        this.activityService = activityService;
    }
    createActivity(activityDto) {
        return this.activityService.createActivity(activityDto);
    }
    getActivity(id) {
        return this.activityService.getActivity(id);
    }
    getAllActivities(offset = 0, limit = 10) {
        return this.activityService.getAllActivities(offset, limit);
    }
    getActivityByMerchant(offset = 0, limit = 10, id) {
        return this.activityService.getActivitiesByMerchant(id, offset, limit);
    }
};
__decorate([
    (0, common_1.Post)('createActivity'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [activity_dto_1.ActivityDto]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "createActivity", null);
__decorate([
    (0, common_1.Get)('getActivity/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "getActivity", null);
__decorate([
    (0, common_1.Get)('getAllActivities'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "getAllActivities", null);
__decorate([
    (0, common_1.Get)('getActivityByMerchant/:id'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", void 0)
], ActivityController.prototype, "getActivityByMerchant", null);
ActivityController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiTags)('Activity'),
    (0, common_1.Controller)('activity'),
    __metadata("design:paramtypes", [activity_service_1.ActivityService])
], ActivityController);
exports.ActivityController = ActivityController;
//# sourceMappingURL=activity.controller.js.map