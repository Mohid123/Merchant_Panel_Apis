import { UtilService } from './utils.service';
export declare class UtilController {
    private readonly UtilService;
    constructor(UtilService: UtilService);
    getCity(zipCode: string): Promise<{
        zip: string;
        city: string;
        lng: number;
        lat: number;
    }>;
    validateVatNumber(vatNumber: string): Promise<any>;
}
