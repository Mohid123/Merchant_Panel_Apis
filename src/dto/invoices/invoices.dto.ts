import { ApiProperty } from "@nestjs/swagger";

export class InvoiceDTO {
    @ApiProperty()
    invoiceNo: number;

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