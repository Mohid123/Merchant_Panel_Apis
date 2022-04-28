import { ApiProperty } from "@nestjs/swagger";

export class KycDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    iban: string;

    @ApiProperty()
    bankName: string;
}