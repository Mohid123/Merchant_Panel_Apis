import { VoucherInterface } from "src/interface/deal/deal.interface";
export declare class UpdateDealDto {
    id: string;
    endDate: Date;
    vouchers: VoucherInterface[];
}
