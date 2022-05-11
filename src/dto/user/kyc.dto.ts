import { ApiProperty } from "@nestjs/swagger";

export class KycDto {

    @ApiProperty()
    iban: string;

    @ApiProperty()
    bankName: string;
}