import { ApiProperty } from '@nestjs/swagger';

export class EmailDTO {
  @ApiProperty()
  from: string;

  @ApiProperty()
  to: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  text: string;
  
  @ApiProperty()
  html: string;
}
