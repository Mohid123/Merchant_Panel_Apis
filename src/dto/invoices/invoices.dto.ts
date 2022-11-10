import { ApiProperty } from "@nestjs/swagger";

export class InvoiceDTO {
    @ApiProperty()
    invoiceID: string;

    @ApiProperty()
    invoiceDate: number;

    @ApiProperty()
    invoiceAmount: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    invoiceURL: string;

    @ApiProperty()
    merchantMongoID: string;

    @ApiProperty()
    merchantID: string;

    @ApiProperty()
    affiliateMongoID: string;

    @ApiProperty()
    affiliateID: string;
}