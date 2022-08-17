import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, MaxLength, MinLength } from "class-validator";

export class VoucherPinCodeDto {
    @ApiProperty()
    @MaxLength(4)
    @MinLength(4)
    // @IsNumber()
    voucherPinCode: string;
}