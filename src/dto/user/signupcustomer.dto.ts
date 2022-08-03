import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SignUpCustomerDTO {
    @ApiProperty()
    @IsNotEmpty()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    // Personal Details

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string
}