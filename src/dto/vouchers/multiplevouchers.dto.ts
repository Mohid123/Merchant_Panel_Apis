import { ApiProperty } from "@nestjs/swagger";

export class MultipleVouchersDto {
    @ApiProperty()
    voucherIDsArray: [string];

    @ApiProperty()
    dealHeaderArray: [string];

    @ApiProperty()
    voucherHeaderArray: [string];

    @ApiProperty()
    voucherStatusArray: [string];

    @ApiProperty()
    invoiceStatusArray: [string]
}