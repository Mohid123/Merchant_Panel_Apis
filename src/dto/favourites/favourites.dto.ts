import { ApiProperty } from "@nestjs/swagger";

export class FavouritesDto {
    @ApiProperty()
    customerMongoID: string;

    @ApiProperty()
    customerID: string;

    @ApiProperty()
    dealMongoID: string;

    @ApiProperty()
    dealID: string;

    @ApiProperty()
    deletedCheck: boolean;
}