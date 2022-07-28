import { LeadDto } from 'src/dto/lead/lead.dto';
import { LeadsService } from './leads.service';
export declare class LeadsController {
    private readonly _leadsService;
    constructor(_leadsService: LeadsService);
    createLead(leadDto: LeadDto): Promise<any>;
    getLead(id: string): Promise<any>;
}
