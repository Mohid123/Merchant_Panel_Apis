import { ApiProperty } from '@nestjs/swagger';

export class CategoryDto {
  @ApiProperty()
  categoryName: string;

}
