import { Model } from 'mongoose';
import { InvoiceInterface } from 'src/interface/invoices/invoices.interface';
export declare class InvoicesService {
    private readonly _invoicesModel;
    constructor(_invoicesModel: Model<InvoiceInterface>);
    createInvoice(invoiceDto: any): Promise<import("mongoose").Document<unknown, any, InvoiceInterface> & InvoiceInterface & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getInvoice(invoiceURL: any): Promise<import("mongoose").Document<unknown, any, InvoiceInterface> & InvoiceInterface & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllInvoices(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllInvoicesByMerchant(merchantID: any, dateFrom: any, dateTo: any, invoiceDate: any, invoiceAmount: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
