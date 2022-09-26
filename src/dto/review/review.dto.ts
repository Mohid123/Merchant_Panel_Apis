import { ApiProperty } from '@nestjs/swagger';
import { MedialUrl, multipleRatings } from 'src/interface/review/review.interface';

export class ReviewDto {

  @ApiProperty()
  voucherMongoID: string;

  @ApiProperty()
  voucherID: string;

  @ApiProperty()
  text: string;

  @ApiProperty({
    example: [
      {
        type: '',
        captureFileURL: '',
        path: '',
        thumbnailURL: '',
        thumbnailPath: '',
        blurHash:'',
        backgroundColorHex:'',
      }
    ],
  })
  mediaUrl: MedialUrl[];

  @ApiProperty({
    example: [
      {
        ratingName: '',
        ratingScore: 0,
      },
    ],
  })
  multipleRating: multipleRatings[];

  // @ApiProperty()
  // customerEmail: string;

  // @ApiProperty()
  // customerName: string;

  // @ApiProperty()
  // customerProfilePicURL: string;

  @ApiProperty()
  isViewed: boolean;
}
