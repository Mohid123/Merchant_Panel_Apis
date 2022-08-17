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

  @Get('getDeal/:id')
  getDeal(@Param('id') id: string) {
    return this.dealService.getDeal(id);
  }

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

  @Get('getDealsByMerchantIDForCustomerPanel/:merchantID')
  getDealsByMerchantIDForCustomerPanel(
    @Param('merchantID') merchantID: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getDealsByMerchantIDForCustomerPanel(
      merchantID,
      offset,
      limit,
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
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
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

  @Get('getNewDeals')
  getNewDeals(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getNewDeals(offset, limit);
  }

  @Get('getLowPriceDeals/:price')
  getLowPriceDeals(
    @Param('price') price: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getLowPriceDeals(price, offset, limit);
  }

  @Get('getDiscountedDeals/:percentage')
  getDiscountedDeals(
    @Param('percentage') percentage: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getDiscountedDeals(percentage, offset, limit);
  }

  @Get('getSpecialOfferDeals')
  getSpecialOfferDeals(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getSpecialOfferDeals(offset, limit);
  }

  @Get('getHotDeals')
  getHotDeals(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getHotDeals(offset, limit);
  }

  @Get('getNewFavouriteDeal')
  getNewFavouriteDeal(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getNewFavouriteDeal(offset, limit);
  }

  @Get('getNearByDeals')
  getNearByDeals(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('distance') distance: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getNearByDeals(lat, lng, distance, offset, limit);
  }

  @Get('searchDeals')
  searchDeals(
    @Query('header') header: string = '',
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.searchDeals(header, offset, limit);
  }

  @Get('getSimilarDeals/:categoryName/:subCategoryName')
  getSimilarDeals(
    @Param('categoryName') categoryName: string,
    @Param('subCategoryName') subCategoryName: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getSimilarDeals(
      categoryName,
      subCategoryName,
      offset,
      limit,
    );
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
}
