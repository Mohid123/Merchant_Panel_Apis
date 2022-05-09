/// <reference types="mongoose" />
import { InvoiceDTO } from 'src/dto/invoices/invoices.dto';
import { INVOICEAMOUNTENUM } from 'src/enum/sorting/sortinvoiceamount.enum';
import { INVOICEDATEENUM } from 'src/enum/sorting/sortinvoicedate.enum';
import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly _invoiceService;
    constructor(_invoiceService: InvoicesService);
    createInvoice(invoiceDto: InvoiceDTO): Promise<import("mongoose").Document<unknown, any, import("../../interface/invoices/invoices.interface").InvoiceInterface> & import("../../interface/invoices/invoices.interface").InvoiceInterface & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getInvoice(invoiceURL: string): Promise<import("mongoose").Document<unknown, any, import("../../interface/invoices/invoices.interface").InvoiceInterface> & import("../../interface/invoices/invoices.interface").InvoiceInterface & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    getAllInvoices(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllInvoicesByMerchant(merchantID: string, dateFrom: number, dateTo: number, invoiceDate: INVOICEDATEENUM, invoiceAmount: INVOICEAMOUNTENUM, status: INVOICEAMOUNTENUM, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
