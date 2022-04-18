import { Model } from 'mongoose';
import { BillingInterface } from 'src/interface/billing/billing.interface';
export declare class BillingService {
    private readonly billingModel;
    constructor(billingModel: Model<BillingInterface>);
    createBilling(billingDto: any): Promise<BillingInterface & {
        _id: any;
    }>;
    getBill(id: any): Promise<(BillingInterface & {
        _id: any;
    })[]>;
    getAllBillings(offset: any, limit: any): Promise<{
        totalBilling: number;
        data: any[];
    }>;
}
