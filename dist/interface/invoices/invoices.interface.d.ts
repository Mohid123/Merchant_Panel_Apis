export interface InvoiceInterface {
    _id: string;
    invoiceID: string;
    invoiceDate: number;
    invoiceAmount: number;
    status: string;
    invoiceURL: string;
    merchantID: string;
}
