import { ApiProperty } from "@nestjs/swagger";
import { IsEmail } from "class-validator";

export class UpdateCustomerProfileDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    @IsEmail()
    email: string;
}