import { BillingDto } from 'src/dto/billing/billing.dto';
import { BillingService } from './billing.service';
export declare class BillingController {
    private readonly billingService;
    constructor(billingService: BillingService);
    createBilling(billingDto: BillingDto): Promise<import("../../interface/billing/billing.interface").BillingInterface & {
        _id: any;
    }>;
    getBill(id: string): Promise<(import("../../interface/billing/billing.interface").BillingInterface & {
        _id: any;
    })[]>;
    getAllBillings(offset?: number, limit?: number): Promise<{
        totalBilling: number;
        data: any[];
    }>;
}
