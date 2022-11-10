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
exports.CampaignController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const campaign_dto_1 = require("../../dto/campaign/campaign.dto");
const sort_enum_1 = require("../../enum/sort/sort.enum");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const campaign_service_1 = require("./campaign.service");
let CampaignController = class CampaignController {
    constructor(camapaignService) {
        this.camapaignService = camapaignService;
    }
    createCampaign(campaignDto, req) {
        return this.camapaignService.createCampaign(campaignDto, req);
    }
    editCampaign(id, campaignDto) {
        return this.camapaignService.editCampaign(id, campaignDto);
    }
    endCampaign(id) {
        return this.camapaignService.endCampaign(id);
    }
    getCampaign(id, req) {
        return this.camapaignService.getCampaign(id, req);
    }
    getActiveCampaignByAffiliate(req) {
        return this.camapaignService.getActiveCampaignByAffiliate(req);
    }
    getCampaignsHistoryByAffiliate(vouchers, fundingGoal, collectedAmount, offset = 0, limit = 10, req) {
        return this.camapaignService.getCampaignsHistoryByAffiliate(vouchers, fundingGoal, collectedAmount, offset, limit, req);
    }
};
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('createCampaign'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [campaign_dto_1.CamapaignDto, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "createCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('editCampaign/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, campaign_dto_1.CamapaignDto]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "editCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Post)('endCampaign/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "endCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getCampaign/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getCampaign", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Get)('getActiveCampaignByAffiliate'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getActiveCampaignByAffiliate", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiQuery)({ name: 'vouchers', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'fundingGoal', enum: sort_enum_1.SORT, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'collectedAmount', enum: sort_enum_1.SORT, required: false }),
    (0, common_1.Get)('getCampaignsHistoryByAffiliate'),
    __param(0, (0, common_1.Query)('vouchers')),
    __param(1, (0, common_1.Query)('fundingGoal')),
    __param(2, (0, common_1.Query)('collectedAmount')),
    __param(3, (0, common_1.Query)('offset')),
    __param(4, (0, common_1.Query)('limit')),
    __param(5, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Number, Object]),
    __metadata("design:returntype", void 0)
], CampaignController.prototype, "getCampaignsHistoryByAffiliate", null);
CampaignController = __decorate([
    (0, swagger_1.ApiTags)('Campaign'),
    (0, common_1.Controller)('campaign'),
    __metadata("design:paramtypes", [campaign_service_1.CampaignService])
], CampaignController);
exports.CampaignController = CampaignController;
//# sourceMappingURL=campaign.controller.js.map