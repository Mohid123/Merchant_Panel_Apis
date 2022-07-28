import { LocationDTO } from 'src/dto/location/location.dto';
import { LocationService } from './location.service';
export declare class LocationController {
    private readonly _locationService;
    constructor(_locationService: LocationService);
    createDeal(locationDto: LocationDTO): Promise<import("../../interface/location/location.interface").Location & {
        _id: string;
    }>;
}
