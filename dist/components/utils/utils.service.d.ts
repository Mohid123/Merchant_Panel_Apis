export declare class UtilService {
    getCity(zipCode: any): Promise<{
        zip: string;
        city: string;
        lng: number;
        lat: number;
    }[]>;
    getAllCategoriesAndSubCategories(): Promise<{
        category: string;
        subCategories: string[];
    }[]>;
    validateVatNumber(vatNumber: any): Promise<any>;
    searchCategory(searchCategory: any): Promise<{
        category: string;
        subCategories: string[];
    }[]>;
}
