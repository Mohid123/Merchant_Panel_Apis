import { ApiProperty } from "@nestjs/swagger";

export class CamapaignDto {
    @ApiProperty()
    affiliateMongoID: string;

    @ApiProperty()
    affiliateID: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    fundingGoals: number;

    @ApiProperty()
    collectedAmount: number;

    @ApiProperty()
    details: string;

    @ApiProperty()
    startDate: number;

    @ApiProperty()
    endDate: number;

    @ApiProperty()
    deletedCheck: boolean;
}