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
import { RATINGENUM } from 'src/enum/review/ratingValue.enum';
import { MultipleDealsDto } from 'src/dto/deal/multipledeals.dto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Deal')
@Controller('deal')
export class DealController {
  constructor(private readonly dealService: DealService) {}

  @UseGuards(JwtMerchantAuthGuard)
  @Post('createDeal')
  createDeal(@Body() dealDto: DealDto, @Req() req) {
    return this.dealService.createDeal(dealDto, req);
  }

  @UseGuards(JwtMerchantAuthGuard)
  @Post('updateDeal/:dealID')
  updateDeal(
    @Param('dealID') dealID: string,
    @Body() updateDealDto: UpdateDealDto,
  ) {
    return this.dealService.updateDeal(updateDealDto, dealID);
  }

  @UseGuards(JwtMerchantAuthGuard)
  @Post('deleteDeal/:dealID')
  deleteDeal(@Param('dealID') dealID: string) {
    return this.dealService.deleteDeal(dealID);
  }

  @UseGuards(JwtAdminAuthGuard)
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

  @ApiQuery({ name: 'averageRating', enum: RATINGENUM, required: false })
  // @ApiQuery({ name: 'dealID', required: false })
  @Get('getDealsReviewStatsByMerchant/:merchantID')
  getDealsReviewStatsByMerchant(
    @Param('merchantID') merchantID: string,
    @Query('averageRating') averageRating: RATINGENUM = RATINGENUM.all,
    @Query('dealID') dealID: string = "",
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getDealsReviewStatsByMerchant(
      merchantID,
      averageRating,
      dealID,
      offset,
      limit,
    );
  }

  @Get('getAllDeals')
  getAllDeals(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Req() req,
  ) {
    return this.dealService.getAllDeals(req, offset, limit);
  }

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
    @Query("dealID") dealID: string = "",
    @Query("header") header: string = "",
    @Query("dealStatus") dealStatus: string = "",
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Body() multipleDealsDto: MultipleDealsDto
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
      multipleDealsDto
      // req,
    );
  }

  @Get('getSalesStatistics')
  getSalesStatistics(@Req() req) {
    return this.dealService.getSalesStatistics(req);
  }

  @ApiQuery({ name: 'rating', required: false })
  @Get('getDealReviews/:dealID')
  getDealReviews(
    @Param('dealID') dealID: string,
    @Query('rating') rating: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getDealReviews(offset, limit, rating, dealID);
  }

  @Get('getTopRatedDeals/:merchantID')
  getTopRatedDeals(@Param('merchantID') merchantID: string) {
    return this.dealService.getTopRatedDeals(merchantID);
  }
}
