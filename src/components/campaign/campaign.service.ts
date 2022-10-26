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

    async createCampaign (campaignDto) {
        try {
            let campaign = new this.campaignModel(campaignDto).save();
            return campaign;
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
            let campaign = await this.campaignModel.findOne({
                _id: id,
                deletedCheck: false,
                affiliateID: req.user.affiliateID
            });

            if(!campaign) {
                throw new NotFoundException('Campaign not found');
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
                deletedCheck: false,
                affiliateID: req.user.affiliateID
            });

            let campaigns = await this.campaignModel.aggregate([
                {
                    $match: {
                        deletedCheck: false,
                        affiliateID: req.user.affiliateID
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $addFields: {
                        id: '$_id'
                    }
                },
                {
                    $project: {
                        _id: 0
                    }
                }
            ])
            .skip(parseInt(offset))
            .limit(parseInt(limit))

            if (!campaigns) {
                throw new NotFoundException('Campaigns not found!')
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
