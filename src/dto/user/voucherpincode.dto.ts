import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, MaxLength } from "class-validator";

export class VoucherPinCodeDto {
    @ApiProperty()
    @MaxLength(4)
    @IsNumber()
    voucherPinCode: number;
}