import { AMOUNTENUM } from 'src/enum/sorting/sortamount.enum';
import { NAMEENUM } from 'src/enum/sorting/sortcustomername.enum';
import { FEEENUM } from 'src/enum/sorting/sortfee.enum';
import { NETENUM } from 'src/enum/sorting/sortnet.enum';
import { TRANSACTIONDATEENUM } from 'src/enum/sorting/sorttransactiondate.enum';
import { VOUCHERSTATUSENUM } from 'src/enum/voucher/voucherstatus.enum';
import { OrdersService } from './orders.service';
export declare class OrdersController {
    private readonly _orderService;
    constructor(_orderService: OrdersService);
    addOrder(): void;
    getOrder(): void;
    getAllOrder(): void;
    getAllOrderByMerchant(merchantID: string, dateFrom: number, dateTo: number, Name: NAMEENUM, Date: TRANSACTIONDATEENUM, Amount: AMOUNTENUM, Fee: FEEENUM, Net: NETENUM, filterStatus: VOUCHERSTATUSENUM, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
