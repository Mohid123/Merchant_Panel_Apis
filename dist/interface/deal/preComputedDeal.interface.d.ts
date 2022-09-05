import { Document } from 'mongoose';
export interface PreComputedDealInteface extends Document {
    data: {
        id: string;
        data: [];
        methodName: string;
        totalCount: number;
        filterValue: number;
    };
    methodname: string;
}
