import { UtilService } from './utils.service';
export declare class UtilController {
    private readonly UtilService;
    constructor(UtilService: UtilService);
    getCity(zipCode: string): Promise<any>;
}
