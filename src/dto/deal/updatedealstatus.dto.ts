import { ApiProperty } from "@nestjs/swagger";

export class DealStatusDto {
    @ApiProperty()
    dealStatus: string
}