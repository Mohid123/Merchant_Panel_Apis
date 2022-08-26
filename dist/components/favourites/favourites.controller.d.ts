/// <reference types="mongoose" />
import { AffiliateFavouritesDto } from 'src/dto/affiliate/affiliate.dto';
import { FavouritesDto } from 'src/dto/favourites/favourites.dto';
import { FavouritesService } from './favourites.service';
export declare class FavouritesController {
    private readonly favouriteService;
    constructor(favouriteService: FavouritesService);
    addToFavourites(favouritesDto: FavouritesDto, req: any): Promise<(import("mongoose").Document<unknown, any, import("../../interface/favourites/favourites.interface").FavouritesInterface> & import("../../interface/favourites/favourites.interface").FavouritesInterface & {
        _id: string;
    }) | {
        message: string;
    }>;
    addToAffiliateFavourites(affiliateFavouritesDto: AffiliateFavouritesDto, req: any): Promise<(import("mongoose").Document<unknown, any, import("../../interface/affiliate/affiliate.interface").AffiliateFavouritesInterface> & import("../../interface/affiliate/affiliate.interface").AffiliateFavouritesInterface & {
        _id: string;
    }) | {
        message: string;
    }>;
    removeFromFavourites(id: string, req: any): Promise<{
        message: string;
    }>;
    removeFromAffiliateFavourites(id: string): Promise<{
        message: string;
    }>;
    getFavourite(id: string): Promise<any>;
    getAllFavourites(offset?: number, limit?: number): Promise<{
        totalFavouriteDeals: number;
        data: any[];
    }>;
}
