export interface OrderInterface {
    _id: string;
    orderID: string;
    transactionDate: number;
    customerName: string;
    amount: number;
    fee: number;
    netAmount: number;
    source: string;
    status: string;
    merchantID: string;
    customerID: string;
    voucherID: string;
    dealID: string;
}
