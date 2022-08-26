import { ApiProperty } from "@nestjs/swagger";

export class AffiliateFavouritesDto {
    @ApiProperty()
    affiliateMongoID: string;

    @ApiProperty()
    affiliateID: string;

    @ApiProperty()
    customerMongoID: string;

    @ApiProperty()
    customerID: string;

    @ApiProperty()
    deletedCheck: boolean;
}