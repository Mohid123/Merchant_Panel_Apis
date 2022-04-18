import { Model } from 'mongoose';
import { OrderInterface } from '../../interface/orders/orders.interface';
export declare class OrdersService {
    private readonly _orderModel;
    constructor(_orderModel: Model<OrderInterface>);
    addOrder(orderDto: any): Promise<import("mongoose").Document<unknown, any, OrderInterface> & OrderInterface & {
        _id: string;
    }>;
    getOrder(id: any): Promise<any[]>;
    getAllOrders(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getOrdersByMerchant(merchantID: any, dateFrom: any, dateTo: any, Name: any, Date: any, Amount: any, Fee: any, Net: any, filterStatus: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
