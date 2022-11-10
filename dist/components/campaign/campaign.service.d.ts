import { Model } from 'mongoose';
import { CampaignInterface } from 'src/interface/campaign/campaign.interfce';
export declare class CampaignService {
    private readonly campaignModel;
    constructor(campaignModel: Model<CampaignInterface>);
    createCampaign(campaignDto: any, req: any): Promise<import("mongoose").Document<unknown, any, CampaignInterface> & CampaignInterface & {
        _id: string;
    }>;
    editCampaign(id: any, campaignDto: any): Promise<{
        message: string;
    }>;
    endCampaign(id: any): Promise<{
        message: string;
    }>;
    getCampaign(id: any, req: any): Promise<any>;
    getActiveCampaignByAffiliate(req: any): Promise<any>;
    getCampaignsHistoryByAffiliate(vouchers: any, fundingGoal: any, collectedAmount: any, offset: any, limit: any, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
