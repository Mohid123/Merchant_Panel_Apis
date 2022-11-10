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
exports.CampaignService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const sort_enum_1 = require("../../enum/sort/sort.enum");
let CampaignService = class CampaignService {
    constructor(campaignModel) {
        this.campaignModel = campaignModel;
    }
    async createCampaign(campaignDto, req) {
        try {
            let affiliateCampaigns = await this.campaignModel.findOne({
                affiliateID: req.user.affiliateID,
                affiliateMongoID: req.user.id,
                deletedCheck: false
            });
            if (affiliateCampaigns) {
                throw new common_1.HttpException('You already have an active campaign', common_1.HttpStatus.BAD_REQUEST);
            }
            campaignDto.affiliateMongoID = req.user.id;
            campaignDto.affiliateID = req.user.affiliateID;
            campaignDto.startDate = new Date().getTime();
            let campaign = new this.campaignModel(campaignDto).save();
            return campaign;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async editCampaign(id, campaignDto) {
        try {
            let campaign = await this.campaignModel.findOne({
                _id: id,
                deletedCheck: false
            });
            if (!campaign) {
                throw new common_1.NotFoundException('Campaign not found');
            }
            await this.campaignModel.updateOne({ _id: id, deletedCheck: false }, campaignDto);
            return {
                message: 'Campaign has been updated successfully!'
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async endCampaign(id) {
        try {
            let campaign = await this.campaignModel.findOne({ _id: id, deletedCheck: false });
            if (!campaign) {
                throw new common_1.HttpException('Campaign not found', common_1.HttpStatus.NOT_FOUND);
            }
            await this.campaignModel.updateOne({
                _id: id
            }, {
                deletedCheck: true,
                endDate: new Date().getTime()
            });
            return {
                message: 'Your campaign has ended!'
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCampaign(id, req) {
        try {
            let campaign = await this.campaignModel.aggregate([
                {
                    $match: {
                        _id: id,
                        affiliateID: req.user.affiliateID,
                        affiliateMongoID: req.user.id
                    },
                },
                {
                    $addFields: {
                        id: '$_id',
                        percentage: {
                            $multiply: [
                                {
                                    $divide: [
                                        '$collectedAmount',
                                        '$fundingGoals'
                                    ]
                                },
                                100
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
                .then(items => items[0]);
            if (!campaign) {
                throw new common_1.HttpException('Campaign not found', common_1.HttpStatus.NOT_FOUND);
            }
            return campaign;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getActiveCampaignByAffiliate(req) {
        try {
            let activeCampaign = await this.campaignModel.aggregate([
                {
                    $match: {
                        affiliateMongoID: req.user.id,
                        affiliateID: req.user.affiliateID,
                        deletedCheck: false
                    }
                },
                {
                    $addFields: {
                        id: '$_id',
                        percentage: {
                            $multiply: [
                                {
                                    $divide: [
                                        '$collectedAmount',
                                        '$fundingGoals'
                                    ]
                                },
                                100
                            ]
                        }
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
                .then(items => items[0]);
            if (!activeCampaign) {
                return {
                    message: false
                };
            }
            return activeCampaign;
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getCampaignsHistoryByAffiliate(vouchers, fundingGoal, collectedAmount, offset, limit, req) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;
            let sort = {};
            if (vouchers) {
                let sortVoucher = vouchers == sort_enum_1.SORT.ASC ? 1 : -1;
                sort = Object.assign(Object.assign({}, sort), { totalVouchers: sortVoucher });
            }
            if (fundingGoal) {
                let sortFundingGoals = fundingGoal == sort_enum_1.SORT.ASC ? 1 : -1;
                sort = Object.assign(Object.assign({}, sort), { fundingGoals: sortFundingGoals });
            }
            if (collectedAmount) {
                let sortCollectedAmount = collectedAmount == sort_enum_1.SORT.ASC ? 1 : -1;
                sort = Object.assign(Object.assign({}, sort), { collectedAmount: sortCollectedAmount });
            }
            if (Object.keys(sort).length === 0 && sort.constructor === Object) {
                sort = {
                    createdAt: -1,
                };
            }
            let totalCount = await this.campaignModel.countDocuments({
                affiliateID: req.user.affiliateID,
                affiliateMongoID: req.user.id,
                deletedCheck: true
            });
            let campaigns = await this.campaignModel.aggregate([
                {
                    $match: {
                        affiliateID: req.user.affiliateID,
                        affiliateMongoID: req.user.id,
                        deletedCheck: true
                    }
                },
                {
                    $lookup: {
                        from: 'vouchers',
                        as: 'voucherData',
                        localField: 'title',
                        foreignField: 'affiliateCampaignName'
                    }
                },
                {
                    $addFields: {
                        id: '$_id',
                        percentage: {
                            $multiply: [
                                {
                                    $divide: [
                                        '$collectedAmount',
                                        '$fundingGoals'
                                    ]
                                },
                                100
                            ]
                        },
                        totalVouchers: {
                            $size: '$voucherData'
                        }
                    }
                },
                {
                    $sort: sort
                },
                {
                    $project: {
                        _id: 0,
                        voucherData: 0
                    }
                }
            ])
                .skip(parseInt(offset))
                .limit(parseInt(limit));
            if (campaigns.length == 0) {
                throw new common_1.HttpException('Campaigns not found!', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                totalCount: totalCount,
                data: campaigns
            };
        }
        catch (err) {
            throw new common_1.HttpException(err, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
CampaignService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Campaign')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CampaignService);
exports.CampaignService = CampaignService;
//# sourceMappingURL=campaign.service.js.map