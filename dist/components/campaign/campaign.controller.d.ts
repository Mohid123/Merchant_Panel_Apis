/// <reference types="mongoose" />
import { CamapaignDto } from 'src/dto/campaign/campaign.dto';
import { SORT } from 'src/enum/sort/sort.enum';
import { CampaignService } from './campaign.service';
export declare class CampaignController {
    private readonly camapaignService;
    constructor(camapaignService: CampaignService);
    createCampaign(campaignDto: CamapaignDto, req: any): Promise<import("mongoose").Document<unknown, any, import("../../interface/campaign/campaign.interfce").CampaignInterface> & import("../../interface/campaign/campaign.interfce").CampaignInterface & {
        _id: string;
    }>;
    editCampaign(id: string, campaignDto: CamapaignDto): Promise<{
        message: string;
    }>;
    endCampaign(id: string): Promise<{
        message: string;
    }>;
    getCampaign(id: string, req: any): Promise<any>;
    getActiveCampaignByAffiliate(req: any): Promise<any>;
    getCampaignsHistoryByAffiliate(vouchers: SORT, fundingGoal: SORT, collectedAmount: SORT, offset: number, limit: number, req: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
