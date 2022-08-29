import { ApiProperty } from '@nestjs/swagger';
import { MedialUrl, multipleRatings } from 'src/interface/review/review.interface';

export class ReviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  dealMongoID: string;

  @ApiProperty()
  dealID: string;

  @ApiProperty()
  dealHeader: string;

  @ApiProperty()
  subDealHeader: string;

  @ApiProperty()
  voucherMongoID: string;

  @ApiProperty()
  voucherID: string;

  @ApiProperty()
  customerMongoID: string;

  @ApiProperty()
  customerID: string;

  @ApiProperty()
  merchantMongoID: string;

  @ApiProperty()
  merchantID: string;

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

  @ApiProperty()
  totalRating: number;

  @ApiProperty({
    example: [
      {
        ratingName: '',
        ratingScore: 0,
      },
    ],
  })
  multipleRating: multipleRatings[];

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  profilePicURL: string;

  @ApiProperty()
  voucherRedeemedDate: number;

  @ApiProperty()
  isViewed: boolean;
}
