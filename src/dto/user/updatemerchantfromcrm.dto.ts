import { ApiProperty } from "@nestjs/swagger";

export class UpdateMerchantFromCrmDto {
    @ApiProperty()
    tradeName: string;

    @ApiProperty()
    ratingsAverage: number;

    @ApiProperty()
    profilePicURL: string;

    @ApiProperty()
    platformPercentage: number;
}