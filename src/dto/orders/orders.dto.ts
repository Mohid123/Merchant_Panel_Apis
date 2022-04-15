import { ApiProperty } from "@nestjs/swagger"

export class OrderDto {

    @ApiProperty()
    _id: string;

    @ApiProperty()
    orderID: string;

    @ApiProperty()
    transactionDate: number;

    @ApiProperty()
    customerName: string;

    @ApiProperty()
    amount: number;

    @ApiProperty()
    fee: number;

    @ApiProperty()
    netAmount: number;

    @ApiProperty()
    source: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    merchantID: string;

    @ApiProperty()
    customerID: string;

    @ApiProperty()
    voucherID: string;

    @ApiProperty()
    dealID: string;
}