import { ApiProperty } from "@nestjs/swagger";

export class CamapaignDto {

    @ApiProperty()
    title: string;

    @ApiProperty()
    fundingGoals: number;

    @ApiProperty()
    details: string;

    @ApiProperty()
    startDate: number;

    @ApiProperty()
    endDate: number;

    @ApiProperty()
    deletedCheck: boolean;
}