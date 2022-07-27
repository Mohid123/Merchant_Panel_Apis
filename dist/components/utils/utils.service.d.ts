export declare class UtilService {
    getCity(zipCode: any): Promise<{
        zip: string;
        city: string;
        lng: number;
        lat: number;
    }[]>;
    getAllCategoriesAndSubCategories(): Promise<{
        id: string;
        name: string;
        subCategories: {
            id: string;
            name: string;
        }[];
    }[]>;
    validateVatNumber(vatNumber: any): Promise<any>;
}
