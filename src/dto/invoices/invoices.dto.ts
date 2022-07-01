import { ApiProperty } from "@nestjs/swagger";

export class InvoiceDTO {
    @ApiProperty()
    invoiceNo: string;

    @ApiProperty()
    invoiceDate: number;

    @ApiProperty()
    invoiceAmount: number;

    @ApiProperty()
    status: string;

    @ApiProperty()
    invoiceURL: string;

    @ApiProperty()
    merchantID: string;
}