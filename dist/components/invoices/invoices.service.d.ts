import { Model } from 'mongoose';
import { InvoiceInterface } from '../../interface/invoices/invoices.interface';
import { VoucherCounterInterface } from '../../interface/vouchers/vouchersCounter.interface';
export declare class InvoicesService {
    private readonly _invoicesModel;
    private readonly voucherCounterModel;
    constructor(_invoicesModel: Model<InvoiceInterface>, voucherCounterModel: Model<VoucherCounterInterface>);
    generateVoucherId(sequenceName: any): Promise<string>;
    createInvoice(invoiceDto: any): Promise<import("mongoose").Document<unknown, any, InvoiceInterface> & InvoiceInterface & {
        _id: string;
    }>;
    getInvoice(invoiceURL: any): Promise<import("mongoose").Document<unknown, any, InvoiceInterface> & InvoiceInterface & {
        _id: string;
    }>;
    getAllInvoices(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllInvoicesByMerchant(merchantID: any, dateFrom: any, dateTo: any, invoiceDate: any, invoiceAmount: any, status: any, invoiceID: any, offset: any, limit: any, multipleInvoicesDto: any): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    getAllInvoicesByAffiliate(affiliateMongoID: any, invoiceID: any, dateFrom: any, dateTo: any, multipleInvoicesDto: any, offset: any, limit: any): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
}
