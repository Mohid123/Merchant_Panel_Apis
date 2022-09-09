import { ApiProperty } from "@nestjs/swagger";

export class FilterCategoriesApiDto {
    @ApiProperty()
    provincesArray: [string];
}