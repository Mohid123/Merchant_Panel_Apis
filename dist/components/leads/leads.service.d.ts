import { Model } from 'mongoose';
import { LeadInterface } from 'src/interface/lead/lead.interface';
export declare class LeadsService {
    private readonly _leadModel;
    constructor(_leadModel: Model<LeadInterface>);
    createLead(leadDto: any): Promise<import("mongoose").Document<unknown, any, LeadInterface> & LeadInterface & {
        _id: string;
    }>;
    getLead(id: any): Promise<any>;
}
