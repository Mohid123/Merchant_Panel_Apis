import { ApiProperty } from "@nestjs/swagger";

export class ReviewTextDto {

    @ApiProperty()
    reviewID: string;

    @ApiProperty()
    voucherMongoID: string;

    @ApiProperty()
    voucherID: string;

    // @ApiProperty()
    // merchantName: string;

    // @ApiProperty()
    // legalName: string;

    // @ApiProperty()
    // merchantProfilePicURL: string;

    @ApiProperty()
    merchantReplyText: string;

    @ApiProperty()
    deletedCheck: boolean;
}