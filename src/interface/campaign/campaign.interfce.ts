export interface CampaignInterface {
    _id: string;
    affiliateMongoID: string;
    affiliateID: string;
    title: string;
    fundingGoals: number;
    collectedAmount: number;
    details: string;
    startDate: number;
    endDate: number;
    deletedCheck: boolean;
}