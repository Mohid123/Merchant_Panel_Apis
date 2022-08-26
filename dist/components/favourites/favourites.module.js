"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FavouritesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const affiliate_schema_1 = require("../../schema/affiliate/affiliate.schema");
const deal_schema_1 = require("../../schema/deal/deal.schema");
const favourites_schema_1 = require("../../schema/favourites/favourites.schema");
const users_schema_1 = require("../../schema/user/users.schema");
const favourites_controller_1 = require("./favourites.controller");
const favourites_service_1 = require("./favourites.service");
let FavouritesModule = class FavouritesModule {
};
FavouritesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: 'favourites', schema: favourites_schema_1.FavouriteSchema },
                { name: 'affiliateFvaourites', schema: affiliate_schema_1.AffiliateFavouritesSchema },
                { name: 'Deal', schema: deal_schema_1.DealSchema },
                { name: 'User', schema: users_schema_1.UsersSchema }
            ]),
        ],
        controllers: [favourites_controller_1.FavouritesController],
        providers: [favourites_service_1.FavouritesService],
    })
], FavouritesModule);
exports.FavouritesModule = FavouritesModule;
//# sourceMappingURL=favourites.module.js.map