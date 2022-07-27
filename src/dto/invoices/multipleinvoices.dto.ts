import { ApiProperty } from "@nestjs/swagger";

export class MultipleInvoicesDto {
    @ApiProperty()
    invoiceIDsArray: [string];
}