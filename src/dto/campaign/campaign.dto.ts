import { ApiProperty } from "@nestjs/swagger";

export class CamapaignDto {

    @ApiProperty()
    title: string;

    @ApiProperty()
    fundingGoals: number;

    @ApiProperty()
    details: string;

}