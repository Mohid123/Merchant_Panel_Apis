import { Body, Controller, Param, Get, Post } from '@nestjs/common';
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
  getAll() {
    return this.reviewService.getAll();
  }

  @Post('updateReview/:id')
  updateReview(
    @Body() updateReviewDto: UpdateReviewDto,
    @Param('id') id: string,
  ) {
    return this.reviewService.updateReview(updateReviewDto, id);
  }
}
