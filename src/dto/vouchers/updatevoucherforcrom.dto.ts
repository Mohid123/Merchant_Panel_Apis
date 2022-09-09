import { ApiProperty } from "@nestjs/swagger";

export class UpdateVoucherForCRMDto {
    @ApiProperty()
    affiliatePaymentStatus: string;

    @ApiProperty()
    merchantPaymentStatus: string;
}