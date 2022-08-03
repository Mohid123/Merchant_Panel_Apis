import { ApiProperty } from '@nestjs/swagger';

export class LocationDTO {
  @ApiProperty()
  merchantID: string;

  @ApiProperty()
  locationName: string;

  @ApiProperty()
  streetAddress: string;

  @ApiProperty()
  zipCode: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  googleMapPin: string;

  @ApiProperty()
  province: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  plusCode: string;
}
