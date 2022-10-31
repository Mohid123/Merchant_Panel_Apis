import { ApiProperty } from "@nestjs/swagger";

export class AffiliateSubCategoryDTO {
    @ApiProperty()
    affiliateSubCategoryName: string;

    @ApiProperty()
    affiliateCategoryID: string;

    @ApiProperty()
    affiliateCategoryName: string;
}