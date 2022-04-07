import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  rating: number;

  @ApiProperty()
  profilePicURL: string;
}
