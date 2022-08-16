/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";

export class KycDto {

    @ApiProperty()
    iban: string;

    @ApiProperty()
    bic_swiftCode: string;

    @ApiProperty()
    accountHolder: string;

    @ApiProperty()
    bankName: string;
}