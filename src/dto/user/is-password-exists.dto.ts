import { ApiProperty } from "@nestjs/swagger";

export class IsPasswordExistsDto {
    @ApiProperty()
    password: string;
}