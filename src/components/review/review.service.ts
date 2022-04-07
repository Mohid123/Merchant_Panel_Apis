import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReviewInterface } from '../../interface/review/review.interface';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel('Review')
    private readonly reviewModel: Model<ReviewInterface>,
  ) {}

  async createReview(reviewDto) {
    try {
      const review = await this.reviewModel.create(reviewDto);
      return review;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async getAll() {
    try {
      const reviews = await this.reviewModel.find();
      return reviews;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  async updateReview(updateReviewDto, id) {
    try {
      const updatedReview = await this.reviewModel.findByIdAndUpdate(
        id,
        updateReviewDto,
      );
      return updateReviewDto;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }
}
