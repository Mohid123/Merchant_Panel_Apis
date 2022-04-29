import { ApiProperty } from '@nestjs/swagger';

export class ReviewDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  dealID: string;

  @ApiProperty()
  customerID: string;

  @ApiProperty()
  merchantID: string;

  @ApiProperty()
  text: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  customerEmail: string;

  @ApiProperty()
  customerName: string;

  @ApiProperty()
  profilePicURL: string;
}
