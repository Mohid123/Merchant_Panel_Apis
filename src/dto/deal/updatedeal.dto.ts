import { ApiProperty } from "@nestjs/swagger";
import { VoucherInterface } from "src/interface/deal/deal.interface";

export class UpdateDealDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    endDate: Date;

    @ApiProperty({
        example: [
          {
            // subTitle: '',
            // originalPrice: 0,
            // dealPrice: 0,
            // discountPercentage: 0,
            // details: '',
            // soldVouchers: 0,
            numberOfVouchers: 0,
            // voucherValidity: 0,
            // voucherStartDate: new Date(),
            // voucherEndDate: new Date(),
          },
        ],
      })
    vouchers: VoucherInterface[];
}