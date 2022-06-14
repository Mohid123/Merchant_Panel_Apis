import { ApiProperty } from '@nestjs/swagger';

export class OtpEmailDto {
  @ApiProperty()
  email: string;
}
