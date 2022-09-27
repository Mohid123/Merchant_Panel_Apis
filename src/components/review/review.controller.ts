import {
  Body,
  Controller,
  Param,
  Get,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReviewTextDto } from 'src/dto/review/merchantreviewreply.dto';
import { ReviewDto } from '../../dto/review/review.dto';
import { UpdateReviewDto } from '../../dto/review/updateReview.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtMerchantAuthGuard } from '../auth/jwt-merchant-auth.guard';
import { ReviewService } from './review.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('createReview')
  createReview(
    @Body() revieDto: ReviewDto,
    @Req() req) {
    return this.reviewService.createReview(revieDto, req);
  }

  @Get('getReviewforCustomerProfile/:voucherID')
  getReviewforCustomerProfile (
    @Param('voucherID') voucherID: string
  ) {
    return this.reviewService.getReviewforCustomerProfile(voucherID)
  }

  @Post('createReviewReply')
  createReviewReply(@Body() reviewTextDto: ReviewTextDto) {
    return this.reviewService.createReviewReply(reviewTextDto);
  }

  @Get('getMerchantReply/:merchantID/:reviewID')
  getMerchantReply(
    @Param('merchantID') merchantID: string,
    @Param('reviewID') reviewID: string,
  ) {
    return this.reviewService.getMerchantReply(merchantID, reviewID);
  }

  @Post('deleteReview/:reviewID')
  deleteReview(@Param('reviewID') reviewID: string) {
    return this.reviewService.deleteReview(reviewID);
  }

  @Get('getAllReviews')
  getAllReviews(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewService.getAllReviews(offset, limit);
  }

  @Get('getReviewsByMerchant/:merchantId')
  getReviewsByMerchant(
    @Param('merchantId') merchantId: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewService.getReviewsByMerchant(merchantId, offset, limit);
  }

  @Post('updateReviewViewState/:reviewID')
  updateReviewViewState(@Param('reviewID') reviewID: string) {
    return this.reviewService.updateReviewViewState(reviewID);
  }

  @Get('getNewReviewsForMerchant/:merchantId')
  getNewReviewsForMerchant(
    @Param('merchantId') merchantId: string,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.reviewService.getNewReviewsForMerchant(
      merchantId,
      offset,
      limit,
    );
  }
}
