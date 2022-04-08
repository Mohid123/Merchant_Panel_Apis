import { ReviewDto } from '../../dto/review/review.dto';
import { UpdateReviewDto } from '../../dto/review/updateReview.dto';
import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly reviewService;
    constructor(reviewService: ReviewService);
    createReview(revieDto: ReviewDto): Promise<import("../../interface/review/review.interface").ReviewInterface & {
        _id: any;
    }>;
    getAll(): Promise<(import("../../interface/review/review.interface").ReviewInterface & {
        _id: any;
    })[]>;
    updateReview(updateReviewDto: UpdateReviewDto, id: string): Promise<any>;
}
