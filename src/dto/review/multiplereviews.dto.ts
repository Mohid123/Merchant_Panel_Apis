import { ApiProperty } from '@nestjs/swagger';

export class MultipleReviewsDto {
  @ApiProperty()
  dealIDsArray: [string];

  @ApiProperty()
  ratingsArray: [string];
}
