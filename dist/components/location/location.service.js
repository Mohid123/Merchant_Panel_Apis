"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var OpenLocationCode = require('open-location-code').OpenLocationCode;
var openLocationCode = new OpenLocationCode();
const NodeGeocoder = require('node-geocoder');
let LocationService = class LocationService {
    constructor(_locationModel) {
        this._locationModel = _locationModel;
        const options = {
            provider: 'google',
            apiKey: process.env.geocodingApiKey,
            formatter: null,
        };
        this.geocoder = NodeGeocoder(options);
    }
    async createLocation(locationDto) {
        try {
            const res = await this.geocoder.geocode(`${locationDto.streetAddress},${locationDto.city}`);
            let coordinates = [res[0].longitude, res[0].latitude];
            const locationObj = Object.assign(Object.assign({}, locationDto), { location: {
                    coordinates: coordinates,
                } });
            return await new this._locationModel(locationObj).save();
        }
        catch (err) {
            console.log(err + ' ..........');
        }
    }
    async updateLocation(locationDto, merchantID) {
        try {
            const location = await this._locationModel.updateOne({ merchantID: merchantID }, Object.assign({}, locationDto));
            return { message: 'Location updated successfully!' };
        }
        catch (err) {
            throw new common_1.HttpException(err.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
LocationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Location')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], LocationService);
exports.LocationService = LocationService;
//# sourceMappingURL=location.service.js.map