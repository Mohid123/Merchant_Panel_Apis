import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CampaignInterface } from 'src/interface/campaign/campaign.interfce';

@Injectable()
export class CampaignService {
    constructor (
        @InjectModel('Campaign')
        private readonly campaignModel: Model<CampaignInterface>,
    ) {}

    async createCampaign (campaignDto, req) {
        try {
            let affiliateCampaigns = await this.campaignModel.find({
                affiliateID: req.user.affiliateID,
                affiliateMongoID: req.user.id,
                deletedCheck: false
            });
            if(affiliateCampaigns) {
                throw new HttpException('You already have an active campaign', HttpStatus.BAD_REQUEST);
            }

            campaignDto.affiliateMongoID = req.user.id;
            campaignDto.affiliateID = req.user.affiliateID;

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

    async deleteCampaign (id) {
        try {
            let campaign = await this.campaignModel.findOne({_id: id, deletedCheck: false});

            if(!campaign) {
                throw new NotFoundException('Campaign not found');
            } else {
                await this.campaignModel.updateOne({_id: id}, {deletedCheck: true});
                return {
                    message: 'Campaign has been deleted successfully!'
                }
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
            ]);

            if(campaign.length == 0) {
                throw new HttpException('Campaign not found', HttpStatus.NOT_FOUND);
            }

            return campaign;
        } catch (err) {
            throw new HttpException(err, HttpStatus.BAD_REQUEST);
        }
    }

    async getAllCampaignsByAffiliate (offset, limit, req) {
        try {
            offset = parseInt(offset) < 0 ? 0 : offset;
            limit = parseInt(limit) < 1 ? 10 : limit;

            let totalCount = await this.campaignModel.countDocuments({
                affiliateID: req.user.affiliateID,
                affiliateMongoID: req.user.id
            });

            let campaigns = await this.campaignModel.aggregate([
                {
                    $match: {
                        affiliateID: req.user.affiliateID,
                        affiliateMongoID: req.user.id
                    }
                },
                {
                    $sort: {
                        createdAt: -1
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
                    $project: {
                        _id: 0,
                        voucherData: 0
                    }
                }
            ])
            .skip(parseInt(offset))
            .limit(parseInt(limit))

            if (campaigns.length == 0) {
                throw new NotFoundException('Campaigns not found!');
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
