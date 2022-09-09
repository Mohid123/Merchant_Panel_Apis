import { Model } from 'mongoose';
import { AffiliateFavouritesInterface } from 'src/interface/affiliate/affiliate.interface';
import { DealInterface } from 'src/interface/deal/deal.interface';
import { FavouritesInterface } from 'src/interface/favourites/favourites.interface';
import { UsersInterface } from 'src/interface/user/users.interface';
export declare class FavouritesService {
    private readonly favouriteModel;
    private readonly dealModel;
    private readonly affiliateFavouriteModel;
    private readonly _userModel;
    constructor(favouriteModel: Model<FavouritesInterface>, dealModel: Model<DealInterface>, affiliateFavouriteModel: Model<AffiliateFavouritesInterface>, _userModel: Model<UsersInterface>);
    addToFavourites(favouritesDto: any, req: any): Promise<(import("mongoose").Document<unknown, any, FavouritesInterface> & FavouritesInterface & {
        _id: string;
    }) | {
        message: string;
    }>;
    addToAffiliateFavourites(affiliateFavouritesDto: any, req: any): Promise<(import("mongoose").Document<unknown, any, AffiliateFavouritesInterface> & AffiliateFavouritesInterface & {
        _id: string;
    }) | {
        message: string;
    }>;
    removeFromFavourites(id: any, req: any): Promise<{
        message: string;
    }>;
    removeFromAffiliateFavourites(id: any, req: any): Promise<{
        message: string;
    }>;
    getFavourite(id: any): Promise<any>;
    getAllFavourites(offset: any, limit: any): Promise<{
        totalFavouriteDeals: number;
        data: any[];
    }>;
}
