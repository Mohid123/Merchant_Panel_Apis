import { BillingDto } from '../../dto/billing/billing.dto';
import { BILLINGSTATUS } from '../../enum/billing/billingStatus.enum';
import { SORT } from '../../enum/sort/sort.enum';
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
    getBillingsByMerchant(paymentMethod: SORT, amount: SORT, date: SORT, status: BILLINGSTATUS, dateFrom: number, dateTo: number, offset: number, limit: number, merchantId: string): Promise<{
        totalBillings: number;
        billings: any[];
    }>;
}
