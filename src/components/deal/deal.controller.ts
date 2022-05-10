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
import { UpdateDealDto } from '../../dto/deal/updateDeal.dto';

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

  @Get('getDealsReviewStatsByMerchant/:merchantID')
  getDealsReviewStatsByMerchant(
    @Param('merchantID') merchantID: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.dealService.getDealsReviewStatsByMerchant(
      merchantID,
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

  @ApiQuery({ name: 'title', enum: SORT, required: false })
  @ApiQuery({ name: 'price', enum: SORT, required: false })
  @ApiQuery({ name: 'startDate', enum: SORT, required: false })
  @ApiQuery({ name: 'endDate', enum: SORT, required: false })
  @ApiQuery({ name: 'dateFrom', required: false })
  @ApiQuery({ name: 'dateTo', required: false })
  @Get('getDealsByMerchantID/:merchantID')
  getDealsByMerchantID(
    @Param('merchantID') merchantID: string,
    @Query('title') title: SORT,
    @Query('price') price: SORT,
    @Query('startDate') startDate: SORT,
    @Query('endDate') endDate: SORT,
    @Query('dateFrom') dateFrom: number,
    @Query('dateTo') dateTo: number,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    // @Req() req,
  ) {
    return this.dealService.getDealsByMerchantID(
      merchantID,
      title,
      price,
      startDate,
      endDate,
      dateFrom,
      dateTo,
      offset,
      limit,
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
