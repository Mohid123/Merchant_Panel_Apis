import { Model } from 'mongoose';
import { LeadInterface } from 'src/interface/lead/lead.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
export declare class LeadsService {
    private readonly _leadModel;
    private readonly _userModel;
    constructor(_leadModel: Model<LeadInterface>, _userModel: Model<UsersInterface>);
    createLead(leadDto: any): Promise<import("mongoose").Document<unknown, any, LeadInterface> & LeadInterface & {
        _id: string;
    }>;
    getLead(id: any): Promise<any>;
}
