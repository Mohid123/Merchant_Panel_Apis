import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SORT } from 'src/enum/sort/sort.enum';
import { CampaignInterface } from 'src/interface/campaign/campaign.interfce';

@Injectable()
export class CampaignService {
    constructor (
        @InjectModel('Campaign')
        private readonly campaignModel: Model<CampaignInterface>,
    ) {}

    async createCampaign (campaignDto, req) {
        try {
            let affiliateCampaigns = await this.campaignModel.findOne({
                affiliateID: req.user.affiliateID,
                affiliateMongoID: req.user.id,
                deletedCheck: false
            });
            if(affiliateCampaigns) {
                throw new HttpException('You already have an active campaign', HttpStatus.BAD_REQUEST);
            }

            campaignDto.affiliateMongoID = req.user.id;
            campaignDto.affiliateID = req.user.affiliateID;
            campaignDto.startDate = new Date().getTime();

            let campaign = new this.campaignModel(campaignDto).save();
            return campaign;
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async editCampaign (id, campaignDto) {
        try {
            let campaign = await this.campaignModel.findOne({
                _id: id,
                deletedCheck: false
            });

            if(!campaign) {
                throw new NotFoundException('Campaign not found');
            }

            await this.campaignModel.updateOne({_id: id, deletedCheck: false}, campaignDto);

            return {
                message: 'Campaign has been updated successfully!'
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async endCampaign (id) {
        try {
            let campaign = await this.campaignModel.findOne({_id: id, deletedCheck: false});
            if(!campaign) {
                throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
            }

            await this.campaignModel.updateOne(
                {
                    _id: id
                },
                {
                    deletedCheck: true,
                    endDate: new Date().getTime()
                }
            );

            return {
                message: 'Your campaign has ended!'
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getCampaign (id, req) {
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
            .then(items=>items[0]);

            if(!campaign) {
                throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
            }

            return campaign;
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getActiveCampaignByAffiliate (req) {
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
            .then(items=>items[0]);

            if (!activeCampaign) {
                throw new HttpException('No active campaign against this affiliate!', HttpStatus.NOT_FOUND);
            }

            return activeCampaign;
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getCampaignsHistoryByAffiliate (vouchers, fundingGoal, collectedAmount, offset, limit, req) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            let sort = {};

            if (vouchers) {
                let sortVoucher = vouchers == SORT.ASC ? 1 : -1;
                sort = {
                  ...sort,
                  voucherHeader: sortVoucher,
                };
            }

            if (fundingGoal) {
                let sortFundingGoals = fundingGoal == SORT.ASC ? 1 : -1;
                sort = {
                  ...sort,
                  fundingGoals: sortFundingGoals,
                };
            }

            if (collectedAmount) {
                let sortCollectedAmount = collectedAmount == SORT.ASC ? 1 : -1;
                sort = {
                  ...sort,
                  collectedAmount: sortCollectedAmount,
                };
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
            .limit(parseInt(limit))

            if (campaigns.length == 0) {
                throw new HttpException('Campaigns not found!', HttpStatus.NOT_FOUND);
            }

            return {
                totalCount: totalCount,
                data: campaigns
            }
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

}
