import { ApiProperty } from "@nestjs/swagger";

export class ReviewTextDto {

    @ApiProperty()
    reviewID: string;

    @ApiProperty()
    merchantID: string;

    @ApiProperty()
    merchantName: string;

    @ApiProperty()
    legalName: string;

    @ApiProperty()
    profilePicURL: string;

    @ApiProperty()
    merchantReplyText: string;

    @ApiProperty()
    deletedCheck: boolean;
}