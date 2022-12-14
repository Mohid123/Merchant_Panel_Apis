import { ApiProperty } from '@nestjs/swagger';
import {
  MedialUrl,
  SubDealInterface,
} from '../../interface/deal/deal.interface';

export class DealDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  dealID: string;

  @ApiProperty()
  merchantMongoID: string;

  @ApiProperty()
  merchantID: string;

  @ApiProperty()
  dealHeader: string;

  @ApiProperty()
  subTitle: string;

  @ApiProperty()
  highlights: string;

  @ApiProperty()
  categoryID: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  subCategoryID: string;

  @ApiProperty()
  subCategory: string;

  @ApiProperty({
    example: [
      {
        type: '',
        captureFileURL: '',
        path: '',
        thumbnailURL: '',
        thumbnailPath: '',
        blurHash: '',
        backgroundColorHex: '',
      },
    ],
  })
  mediaUrl: MedialUrl[];

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty({
    example: [
      {
        title: '',
        originalPrice: 0,
        dealPrice: 0,
        discountPercentage: 0,
        soldVouchers: 0,
        numberOfVouchers: 0,
        grossEarning: 0,
        netEarning: 0,
        platformNetEarning: 0,
        voucherValidity: 0,
        voucherStartDate: 0,
        voucherEndDate: 0,
      },
    ],
  })
  subDeals: SubDealInterface[];

  @ApiProperty()
  aboutThisDeal: string;

  @ApiProperty()
  soldVouchers: number;

  @ApiProperty()
  availableVouchers: number;

  @ApiProperty()
  minDealPrice: number;

  @ApiProperty()
  minOriginalPrice: number;

  @ApiProperty()
  minDiscountPercentage: number;

  @ApiProperty()
  dealStatus: string;

  @ApiProperty()
  deletedCheck: boolean;

  @ApiProperty()
  readMore: string;

  @ApiProperty()
  finePrints: string;

  @ApiProperty()
  pageNumber: number;

  @ApiProperty()
  isCollapsed: boolean;

  @ApiProperty()
  isDuplicate: boolean;

  @ApiProperty()
  isSpecialOffer: boolean;

  @ApiProperty()
  dealPreviewURL: string;

  @ApiProperty()
  editDealURL: string;
}
