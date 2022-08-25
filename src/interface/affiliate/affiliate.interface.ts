export interface AffiliateFavouritesInterface {
    _id: string;
    affiliateMongoID: string;
    affiliateID: string;
    customerMongoID: string;
    customerID: string;
    deletedCheck: boolean;
}