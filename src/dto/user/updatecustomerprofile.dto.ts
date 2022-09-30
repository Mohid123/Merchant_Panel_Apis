import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class UpdateCustomerProfileDto {
    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    // @ApiProperty()
    // // @IsEmail()
    // email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    // @IsNotEmpty()
    // @IsString()
    // @MinLength(8)
    newPassword: string;
}