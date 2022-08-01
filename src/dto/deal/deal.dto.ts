import { ApiProperty } from '@nestjs/swagger';
import {
  MedialUrl,
  VoucherInterface,
} from '../../interface/deal/deal.interface';

export class DealDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  dealID: string;

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
        mediaUrl: '',
        type: '',
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
        subTitle: '',
        originalPrice: 0,
        dealPrice: 0,
        discountPercentage: 0,
        // details: '',
        soldVouchers: 0,
        numberOfVouchers: 0,
        grossEarning: 0,
        netEarning: 0,
        voucherValidity: 0,
        voucherStartDate: new Date(),
        voucherEndDate: new Date(),
      },
    ],
  })
  vouchers: VoucherInterface[];

  @ApiProperty()
  aboutThisDeal: string;

  @ApiProperty()
  soldVouchers: number;

  @ApiProperty()
  availableVouchers: number;

  @ApiProperty()
  dealStatus: string;

  @ApiProperty()
  deletedCheck: boolean;

  @ApiProperty()
  readMore: string;

  @ApiProperty()
  finePrints: string;

  @ApiProperty()
  pageNumber: string;

  @ApiProperty()
  isCollapsed: boolean;

  @ApiProperty()
  isDuplicate: boolean;

  @ApiProperty()
  isSpecialOffer: boolean;

  @ApiProperty()
  dealPreviewURL: string;
}
