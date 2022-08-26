import { ApiProperty } from '@nestjs/swagger';
import { MaxLength, MinLength } from 'class-validator';

class CardDTO {
  @ApiProperty()
  number: string;
  @ApiProperty()
  expMonth: number;
  @ApiProperty()
  expYear: number;
  @ApiProperty()
  @MinLength(3)
  @MaxLength(4)
  cvc: number;
}
export class BuyNowDTO {
  @ApiProperty()
  card: CardDTO;

  @ApiProperty()
  dealID: string;

  @ApiProperty()
  subDealID: string;

  @ApiProperty()
  affiliateID: string;

  @ApiProperty()
  quantity: number;
}
