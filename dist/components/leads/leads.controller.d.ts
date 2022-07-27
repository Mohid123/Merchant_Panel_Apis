/// <reference types="mongoose" />
import { LeadDto } from 'src/dto/lead/lead.dto';
import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly _leadsService;
    constructor(_leadsService: LeadsService);
    createLead(leadDto: LeadDto): Promise<import("mongoose").Document<unknown, any, import("../../interface/lead/lead.interface").LeadInterface> & import("../../interface/lead/lead.interface").LeadInterface & {
        _id: string;
    }>;
}
