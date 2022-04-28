import { ApiProperty } from "@nestjs/swagger";

export class UpdateMerchantProfileDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    generalTermsAgreements: string;

    @ApiProperty()
    businessProfile: string;
}