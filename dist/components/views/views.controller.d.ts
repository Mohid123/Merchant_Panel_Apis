/// <reference types="mongoose" />
import { ViewsDto } from 'src/dto/views/views.dto';
import { ViewsService } from './views.service';
export declare class ViewsController {
    private readonly viewsService;
    constructor(viewsService: ViewsService);
    createDealView(viewsDto: ViewsDto, req: any): Promise<import("mongoose").Document<unknown, any, import("../../interface/views/views.interface").ViewsInterface> & import("../../interface/views/views.interface").ViewsInterface & {
        _id: string;
    }>;
    getView(id: string): Promise<any>;
    getAllViews(offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
    getAllViewsByCustomer(customerID: string, offset?: number, limit?: number): Promise<{
        totalCount: number;
        data: any[];
    }>;
}
