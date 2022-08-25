import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AffiliateFavouritesDto } from 'src/dto/affiliate/affiliate.dto';
import { FavouritesDto } from 'src/dto/favourites/favourites.dto';
import { UpdateFavourite } from 'src/dto/favourites/updatefavourite.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FavouritesService } from './favourites.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Favourites')
@Controller('favourites')
export class FavouritesController {
    constructor(private readonly favouriteService: FavouritesService) {}

    @Post('addToFavourites')
    addToFavourites (
        @Body() favouritesDto: FavouritesDto,
        @Req() req
    ) {
        return this.favouriteService.addToFavourites(favouritesDto, req)
    }

    @Post('addToAffiliateFavourites')
    addToAffiliateFavourites (
        @Body() affiliateFavouritesDto: AffiliateFavouritesDto,
        @Req() req
    ) {
        return this.favouriteService.addToAffiliateFavourites(affiliateFavouritesDto, req)
    }

    @Post('removeFromFavourites/:id')
    removeFromFavourites (
        @Param('id') id: string,
        @Req() req
    ) {
        return this.favouriteService.removeFromFavourites(id,req)
    }

    @Get('getFavouriteDeal/:id')
    getFavourite (
        @Param('id') id: string
    ) {
        return this.favouriteService.getFavouriteDeal(id)
    }

    @Get('getAllFavouriteDeals')
    getAllFavouriteDeals (
        @Query('offset') offset: number = 0,
        @Query('limit') limit: number = 10,
    ) {
        return this.favouriteService.getAllFavouriteDeals(offset, limit)
    }
}
