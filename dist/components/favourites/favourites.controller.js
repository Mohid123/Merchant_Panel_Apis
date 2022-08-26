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
exports.FavouritesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const affiliate_dto_1 = require("../../dto/affiliate/affiliate.dto");
const favourites_dto_1 = require("../../dto/favourites/favourites.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const favourites_service_1 = require("./favourites.service");
let FavouritesController = class FavouritesController {
    constructor(favouriteService) {
        this.favouriteService = favouriteService;
    }
    addToFavourites(favouritesDto, req) {
        return this.favouriteService.addToFavourites(favouritesDto, req);
    }
    addToAffiliateFavourites(affiliateFavouritesDto, req) {
        return this.favouriteService.addToAffiliateFavourites(affiliateFavouritesDto, req);
    }
    removeFromFavourites(id, req) {
        return this.favouriteService.removeFromFavourites(id, req);
    }
    removeFromAffiliateFavourites(id) {
        return this.favouriteService.removeFromAffiliateFavourites(id);
    }
    getFavourite(id) {
        return this.favouriteService.getFavourite(id);
    }
    getAllFavourites(offset = 0, limit = 10) {
        return this.favouriteService.getAllFavourites(offset, limit);
    }
};
__decorate([
    (0, common_1.Post)('addToFavourites'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [favourites_dto_1.FavouritesDto, Object]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "addToFavourites", null);
__decorate([
    (0, common_1.Post)('addToAffiliateFavourites'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [affiliate_dto_1.AffiliateFavouritesDto, Object]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "addToAffiliateFavourites", null);
__decorate([
    (0, common_1.Get)('removeFromFavourites/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "removeFromFavourites", null);
__decorate([
    (0, common_1.Get)('removeFromAffiliateFavourites'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "removeFromAffiliateFavourites", null);
__decorate([
    (0, common_1.Get)('getFavourite/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "getFavourite", null);
__decorate([
    (0, common_1.Get)('getAllFavourites'),
    __param(0, (0, common_1.Query)('offset')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], FavouritesController.prototype, "getAllFavourites", null);
FavouritesController = __decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiTags)('Favourites'),
    (0, common_1.Controller)('favourites'),
    __metadata("design:paramtypes", [favourites_service_1.FavouritesService])
], FavouritesController);
exports.FavouritesController = FavouritesController;
//# sourceMappingURL=favourites.controller.js.map