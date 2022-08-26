import { ApiProperty } from "@nestjs/swagger";

export class ViewsDto {
    @ApiProperty()
    dealMongoID: string;

    @ApiProperty()
    dealID: string;

    @ApiProperty()
    customerMongoID: string;

    @ApiProperty()
    customerID: string;

    @ApiProperty()
    viewedTime: number;
}