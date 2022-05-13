export declare class UtilService {
    getCity(zipCode: any): Promise<{
        zip: string;
        city: string;
        lng: number;
        lat: number;
    }>;
}
