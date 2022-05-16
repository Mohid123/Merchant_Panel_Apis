import { ApiProperty } from "@nestjs/swagger";

export class IsEmailExistsDTO {
    @ApiProperty()
    email: string;
}