export interface InvoiceInterface {
    _id: string;
    invoiceID: string;
    invoiceDate: number;
    invoiceAmount: number;
    status: string;
    invoiceURL: string;
    merchantMongoID: string;
    merchantID: string;
    affiliateMongoID: string;
    affiliateID: string;
    deletedCheck: boolean;
}