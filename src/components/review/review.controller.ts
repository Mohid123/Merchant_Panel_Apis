import { Body, Controller, Param, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ReviewDto } from '../../dto/review/review.dto';
import { UpdateReviewDto } from '../../dto/review/updateReview.dto';
import { ReviewService } from './review.service';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('createReview')
  createReview(@Body() revieDto: ReviewDto) {
    return this.reviewService.createReview(revieDto);
  }

  @Get('getAllReviews')
  getAllReviews(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10) {
    return this.reviewService.getAllReviews(offset, limit);
  }

  @Post('updateReview')
  updateReview(
    @Body() updateReviewDto: UpdateReviewDto
  ) {
    return this.reviewService.updateReview(updateReviewDto);
  }
}
