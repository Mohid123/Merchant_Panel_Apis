import { ApiProperty } from "@nestjs/swagger";

export class MultipleDealsDto {
    @ApiProperty()
    dealIDsArray: [string];

    @ApiProperty()
    dealHeaderArray: [string];

    @ApiProperty()
    dealStatusArray: [string];
}