import { ApiProperty } from "@nestjs/swagger";

export class SubCategoryDTO {
    @ApiProperty()
    subCategoryName: string;

    @ApiProperty()
    categoryID: string;

    @ApiProperty()
    categoryName: string;
}