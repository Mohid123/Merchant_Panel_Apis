import { Model } from 'mongoose';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
import { ViewsInterface } from 'src/interface/views/views.interface';
export declare class ViewsService {
    private readonly viewsModel;
    private readonly dealModel;
    private readonly _userModel;
    constructor(viewsModel: Model<ViewsInterface>, dealModel: Model<DealInterface>, _userModel: Model<UsersInterface>);
    createDealView(viewsDto: any, req: any): Promise<import("mongoose").Document<unknown, any, ViewsInterface> & ViewsInterface & {
        _id: string;
    }>;
    getView(id: any): Promise<any>;
    getAllViews(offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllViewsByCustomer(customerID: any, offset: any, limit: any): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
