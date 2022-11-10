/// <reference types="mongoose" />
import { MultipleInvoicesDto } from 'src/dto/invoices/multipleinvoices.dto';
import { InvoiceDTO } from '../../dto/invoices/invoices.dto';
import { INVOICEAMOUNTENUM } from '../../enum/sorting/sortinvoiceamount.enum';
import { INVOICEDATEENUM } from '../../enum/sorting/sortinvoicedate.enum';
import { InvoicesService } from './invoices.service';
export declare class InvoicesController {
    private readonly _invoiceService;
    constructor(_invoiceService: InvoicesService);
    createInvoice(invoiceDto: InvoiceDTO): Promise<import("mongoose").Document<unknown, any, import("../../interface/invoices/invoices.interface").InvoiceInterface> & import("../../interface/invoices/invoices.interface").InvoiceInterface & {
        _id: string;
    }>;
    getInvoice(invoiceURL: string): Promise<import("mongoose").Document<unknown, any, import("../../interface/invoices/invoices.interface").InvoiceInterface> & import("../../interface/invoices/invoices.interface").InvoiceInterface & {
        _id: string;
    }>;
    getAllInvoices(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllInvoicesByMerchant(merchantID: string, dateFrom: number, dateTo: number, invoiceDate: INVOICEDATEENUM, invoiceAmount: INVOICEAMOUNTENUM, status: INVOICEAMOUNTENUM, invoiceID: string, offset: number, limit: number, multipleInvoicesDto: MultipleInvoicesDto): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
    getAllInvoicesByAffiliate(affiliateMongoID: string, invoiceID: string, dateFrom: number, dateTo: number, multipleInvoicesDto: MultipleInvoicesDto, offset?: number, limit?: number): Promise<{
        totalCount: number;
        filteredCount: number;
        data: any[];
    }>;
}
