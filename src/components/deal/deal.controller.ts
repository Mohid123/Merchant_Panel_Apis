import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DealService } from './deal.service';
import { DealDto } from '../../dto/deal/deal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtAdminAuthGuard } from '../auth/jwt-admin-auth.guard';
import { JwtMerchantAuthGuard } from '../auth/jwt-merchant-auth.guard';
import { DealStatusDto } from '../../dto/deal/updatedealstatus.dto';
import { SORT } from '../../enum/sort/sort.enum';
import { DEALSTATUS } from '../../enum/deal/dealstatus.enum';
import { UpdateDealDto } from '../../dto/deal/updatedeal.dto';
import { MultipleDealsDto } from 'src/dto/deal/multipledeals.dto';
import { MultipleReviewsDto } from 'src/dto/review/multiplereviews.dto';
import { JwtManagerAuthGuard } from '../auth/jwt-manager-auth.guard';
import { UpdateDealForCRMDTO } from 'src/dto/deal/updateDealForCrm.dto';
import { BuyNowDTO } from 'src/dto/deal/buy-now.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-auth.guard';
import { SORTINGENUM } from 'src/enum/sort/categoryapisorting.enum';
import { FilterCategoriesApiDto } from 'src/dto/deal/filtercategoriesapi.dto';

@ApiTags('Deal')
@Controller('deal')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @ApiBearerAuth()
  @UseGuards(JwtMerchantAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('createDeal')
  createDeal(@Body() dealDto: DealDto, @Req() req) {
    return this.dealService.createDeal(dealDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(JwtMerchantAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('updateDeal/:dealID')
  updateDeal(
    @Param('dealID') dealID: string,
    @Body() updateDealDto: UpdateDealDto,
  ) {
    return this.dealService.updateDeal(updateDealDto, dealID);
  }

  @ApiBearerAuth()
  @UseGuards(JwtMerchantAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('deleteDeal/:dealID')
  deleteDeal(@Param('dealID') dealID: string) {
    return this.dealService.deleteDeal(dealID);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAdminAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('approveRejectDeal/:dealID')
  approveRejectDeal(
    @Param('dealID') dealID: string,
    @Body() dealStatusDto: DealStatusDto,
  ) {
    return this.dealService.approveRejectDeal(dealID, dealStatusDto);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Get('getDeal/:id')
  getDeal(@Param('id') id: string, @Req() req) {
    return this.dealService.getDeal(id, req);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtMerchantAuthGuard)
  // @UseGuards(JwtAuthGuard)
  // @Get('getDealForMerchantPanel/:dealMongoID')
  // getDealForMerchantPanel (
  //   @Param('dealMongoID') dealMongoID: string
  // ) {
  //   return this.dealService.getDealForMerchantPanel(dealMongoID)
  // }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  // @ApiQuery({ name: 'averageRating', enum: RATINGENUM, required: false })
  @Post('getDealsReviewStatsByMerchant/:merchantID')
  getDealsReviewStatsByMerchant(
    @Param('merchantID') merchantID: string,
    // @Query('averageRating') averageRating: RATINGENUM = RATINGENUM.all,
    @Query('dealID') dealID: string = '',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() multipleReviewsDto: MultipleReviewsDto,
  ) {
    return this.dealService.getDealsReviewStatsByMerchant(
      merchantID,
      // averageRating,
      dealID,
      offset,
      limit,
      multipleReviewsDto,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getAllDeals')
  getAllDeals(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getAllDeals(req, offset, limit);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'dealHeader', enum: SORT, required: false })
  @ApiQuery({ name: 'price', enum: SORT, required: false })
  @ApiQuery({ name: 'startDate', enum: SORT, required: false })
  @ApiQuery({ name: 'endDate', enum: SORT, required: false })
  @ApiQuery({ name: 'availableVoucher', enum: SORT, required: false })
  @ApiQuery({ name: 'soldVoucher', enum: SORT, required: false })
  @ApiQuery({ name: 'status', enum: DEALSTATUS, required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @Post('getDealsByMerchantID/:merchantID')
  getDealsByMerchantID(
    @Param('merchantID') merchantID: string,
    @Query('dealHeader') dealHeader: SORT,
    @Query('price') price: SORT,
    @Query('startDate') startDate: SORT,
    @Query('endDate') endDate: SORT,
    @Query('availableVoucher') availableVoucher: SORT,
    @Query('soldVoucher') soldVoucher: SORT,
    @Query('status') status: DEALSTATUS,
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
    @Query('dealID') dealID: string = '',
    @Query('header') header: string = '',
    @Query('dealStatus') dealStatus: string = '',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() multipleDealsDto: MultipleDealsDto,
    // @Req() req,
  ) {
    return this.dealService.getDealsByMerchantID(
      merchantID,
      dealHeader,
      price,
      startDate,
      endDate,
      availableVoucher,
      soldVoucher,
      status,
      dateFrom,
      dateTo,
      dealID,
      header,
      dealStatus,
      offset,
      limit,
      multipleDealsDto,
      // req,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getDealsByMerchantIDForCustomerPanel/:merchantID')
  getDealsByMerchantIDForCustomerPanel(
    @Param('merchantID') merchantID: string,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getDealsByMerchantIDForCustomerPanel(
      merchantID,
      lat,
      lng,
      distance,
      offset,
      limit,
      req,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getSalesStatistics')
  getSalesStatistics(@Req() req) {
    return this.dealService.getSalesStatistics(req);
  }

  @ApiQuery({ name: 'createdAt', enum: SORT, required: false })
  @ApiQuery({ name: 'totalRating', enum: SORT, required: false })
  @ApiQuery({ name: 'rating', required: false })
  @Get('getDealReviews/:dealID')
  getDealReviews(
    @Param('dealID') dealID: string,
    @Query('createdAt') createdAt: SORT,
    @Query('totalRating') totalRating: SORT,
    @Query('rating') rating: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getDealReviews(
      offset,
      limit,
      rating,
      dealID,
      createdAt,
      totalRating,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('getTopRatedDeals/:merchantID')
  getTopRatedDeals(@Param('merchantID') merchantID: string) {
    return this.dealService.getTopRatedDeals(merchantID);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @ApiQuery({ name: 'price', required: false })
  @ApiQuery({ name: 'percentage', required: false })
  @ApiQuery({ name: 'categoryName', required: false })
  @ApiQuery({ name: 'subCategoryName', required: false })
  @ApiQuery({ name: 'fromPrice', required: false })
  @ApiQuery({ name: 'toPrice', required: false })
  @ApiQuery({ name: 'reviewRating', required: false })
  @ApiQuery({ name: 'sorting', enum: SORTINGENUM, required: false })
  @Post('getAllDynamicAPIs')
  getAllDynamicAPIs (
    @Query('apiName') apiName: string,
    @Query('price') price: number,
    @Query('percentage') percentage: number,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('categoryName') categoryName: string,
    @Query('subCategoryName') subCategoryName: string,
    @Query('fromPrice') fromPrice: number,
    @Query('toPrice') toPrice: number,
    @Query('reviewRating') reviewRating: number,
    @Query('sorting') sorting: SORT,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() filterCategoriesApiDto: FilterCategoriesApiDto,
    @Req() req,
  ) {
    switch (apiName) {
      case 'getNewDealsDynamically':
        return this.dealService.getNewDealsDynamically(
          lat,
          lng,
          distance,
          categoryName,
          subCategoryName,
          fromPrice,
          toPrice,
          reviewRating,
          sorting,
          offset,
          limit,
          filterCategoriesApiDto,
          req
        )

      case 'getLowPriceDealsDynamically':
        return this.dealService.getLowPriceDealsDynamically(
          lat,
          lng,
          distance,
          price,
          categoryName,
          subCategoryName,
          fromPrice,
          toPrice,
          reviewRating,
          sorting,
          offset,
          limit,
          filterCategoriesApiDto,
          req
        )
      
      case 'getDiscountedDealsDynamically':
        return this.dealService.getDiscountedDealsDynamically(
          lat,
          lng,
          distance,
          percentage,
          categoryName,
          subCategoryName,
          fromPrice,
          toPrice,
          reviewRating,
          sorting,
          offset,
          limit,
          filterCategoriesApiDto,
          req
        )

      case 'getSpecialOfferDealsDynamically':
        return this.dealService.getSpecialOfferDealsDynamically(
          lat,
          lng,
          distance,
          categoryName,
          subCategoryName,
          fromPrice,
          toPrice,
          reviewRating,
          sorting,
          offset,
          limit,
          filterCategoriesApiDto,
          req
        )

      case 'getHotDealsDynamically':
        return this.dealService.getHotDealsDynamically(
          lat,
          lng,
          distance,
          categoryName,
          subCategoryName,
          fromPrice,
          toPrice,
          reviewRating,
          sorting,
          offset,
          limit,
          filterCategoriesApiDto,
          req
        )

      case 'getNewFavouriteDealDynamically':
        return this.dealService.getNewFavouriteDealDynamically(
          lat,
          lng,
          distance,
          categoryName,
          subCategoryName,
          fromPrice,
          toPrice,
          reviewRating,
          sorting,
          offset,
          limit,
          filterCategoriesApiDto,
          req
        )

      case 'getNearByDealsDynamically':
        return this.dealService.getNearByDealsDynamically(
          lat,
          lng,
          distance,
          categoryName,
          subCategoryName,
          fromPrice,
          toPrice,
          reviewRating,
          sorting,
          offset,
          limit,
          filterCategoriesApiDto,
          req,
        )
    }
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getNewDeals')
  getNewDeals(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getNewDeals(lat, lng, distance, offset, limit, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getLowPriceDeals/:price')
  getLowPriceDeals(
    @Param('price') price: number,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getLowPriceDeals(price, lat, lng, distance, offset, limit, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getDiscountedDeals/:percentage')
  getDiscountedDeals(
    @Param('percentage') percentage: number,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getDiscountedDeals(percentage, lat, lng, distance, offset, limit, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getSpecialOfferDeals')
  getSpecialOfferDeals(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getSpecialOfferDeals(lat, lng, distance, offset, limit, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getHotDeals')
  getHotDeals(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getHotDeals(lat, lng, distance, offset, limit, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getNewFavouriteDeal')
  getNewFavouriteDeal(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getNewFavouriteDeal(lat, lng, distance, offset, limit, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getNearByDeals')
  getNearByDeals(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getNearByDeals(
      lat,
      lng,
      distance,
      offset,
      limit,
      req,
    );
  }

  @ApiQuery({ name: 'searchBar', required: false })
  @ApiQuery({ name: 'header', required: false })
  @ApiQuery({ name: 'categoryName', required: false })
  @ApiQuery({ name: 'subCategoryName', required: false })
  @ApiQuery({ name: 'fromPrice', required: false })
  @ApiQuery({ name: 'toPrice', required: false })
  @ApiQuery({ name: 'reviewRating', required: false })
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Post('searchDeals')
  searchDeals(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('searchBar') searchBar: string = '',
    @Query('header') header: string = '',
    @Query('categoryName') categoryName: string,
    @Query('subCategoryName') subCategoryName: string,
    @Query('fromPrice') fromPrice: number,
    @Query('toPrice') toPrice: number,
    @Query('reviewRating') reviewRating: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() filterCategoriesApiDto: FilterCategoriesApiDto,
    @Req() req,
  ) {
    return this.dealService.searchDeals(
      lat,
      lng,
      distance,
      searchBar,
      header,
      categoryName,
      subCategoryName,
      fromPrice,
      toPrice,
      reviewRating,
      offset,
      limit,
      filterCategoriesApiDto,
      req,
    );
  }

  @ApiQuery({ name: 'categoryName', required: true })
  @ApiQuery({ name: 'subCategoryName', required: false })
  @ApiQuery({ name: 'fromPrice', required: false })
  @ApiQuery({ name: 'toPrice', required: false })
  @ApiQuery({ name: 'reviewRating', required: false })
  @ApiQuery({ name: 'sorting', enum: SORTINGENUM, required: false })
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Post('getDealsByCategories')
  getDealsByCategories(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('categoryName') categoryName: string,
    @Query('subCategoryName') subCategoryName: string,
    @Query('fromPrice') fromPrice: number,
    @Query('toPrice') toPrice: number,
    @Query('reviewRating') reviewRating: number,
    @Query('sorting') sorting: SORT,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() filterCategoriesApiDto: FilterCategoriesApiDto,
    @Req() req,
  ) {
    return this.dealService.getDealsByCategories(
      lat,
      lng,
      distance,
      categoryName,
      subCategoryName,
      fromPrice,
      toPrice,
      reviewRating,
      sorting,
      offset,
      limit,
      filterCategoriesApiDto,
      req,
    );
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('getWishListDeals')
  getWishListDeals (
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req
  ) {
    return this.dealService.getWishListDeals(offset, limit, req)
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getTrendingDeals')
  getTrendingDeals(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getTrendingDeals(lat, lng, distance, offset, limit, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getSimilarDeals/:categoryName/:subCategoryName')
  getSimilarDeals(
    @Param('categoryName') categoryName: string,
    @Param('subCategoryName') subCategoryName: string,
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getSimilarDeals(
      categoryName,
      subCategoryName,
      lat,
      lng,
      distance,
      offset,
      limit,
      req,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @Get('getRecentlyViewedDeals')
  getRecentlyViewedDeals(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getRecentlyViewedDeals(offset, limit, req);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'lat', required: false })
  @ApiQuery({ name: 'lng', required: false })
  @ApiQuery({ name: 'distance', required: false })
  @Get('getRecommendedForYouDeals')
  getRecommendedForYouDeals(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getRecommendedForYouDeals(lat, lng, distance, offset, limit, req);
  }

  @ApiBearerAuth()
  @UseGuards(JwtManagerAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getDealByID/:dealID')
  getDealByID(@Param('dealID') dealID: string) {
    return this.dealService.getDealByID(dealID);
  }

  @ApiBearerAuth()
  @UseGuards(JwtManagerAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Post('updateDealByID')
  updateDealByID(@Body() updateDealDto: UpdateDealForCRMDTO) {
    return this.dealService.updateDealByID(updateDealDto);
  }

  // @Get('changeMediaURL')
  // changeMediaURL (
  // ) {
  //   return this.dealService.changeMediaURL()
  // }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('buyNow')
  buyNow(@Body() buyNowDto: BuyNowDTO, @Req() req) {
    return this.dealService.buyNow(buyNowDto, req);
  }

  @ApiBearerAuth()
  @UseGuards(JwtMerchantAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('getPublishedDealsForMerchant')
  getPublishedDealsForMerchant(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getPublishedDealsForMerchant(req, offset, limit);
  }
}
