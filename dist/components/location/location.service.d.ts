import { Model } from 'mongoose';
import { Location } from 'src/interface/location/location.interface';
export declare class LocationService {
    private _locationModel;
    constructor(_locationModel: Model<Location>);
    createLocation(locationDto: any): Promise<Location & {
        _id: string;
    }>;
}
