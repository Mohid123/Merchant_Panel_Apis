import { ApiProperty } from "@nestjs/swagger";

export class MultipleVouchersAffiliateDto {
    @ApiProperty()
    voucherIDsArray: [string];
}